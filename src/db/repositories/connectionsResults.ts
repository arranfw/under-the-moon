"use server";

import { db } from "..";
import { ConnectionsResults, NewConnectionsResults } from "../types";
import { mutualCircleUsers as getMutualCircleUsers } from "./circles";
import { LocalDate } from "@js-joda/core";
import { OrderByDirection } from "kysely/dist/cjs/parser/order-by-parser";

export const getConnectionsResults = async ({
  userId,
  orderBy,
  dateRange,
}: {
  userId: string;
  orderBy?: {
    column: keyof ConnectionsResults;
    dir: OrderByDirection;
  };
  dateRange?: { start?: string; end?: string };
  circleId?: string;
}) => {
  const mutualUserCircles = await getMutualCircleUsers(userId);

  let query = db
    .selectFrom("ConnectionsResults")
    .selectAll("ConnectionsResults")
    .leftJoin("User", "ConnectionsResults.userId", "User.id")
    .select(["User.name", "User.image"])
    .where(
      "User.id",
      "in",
      mutualUserCircles.map((r) => r.id),
    );

  if (dateRange) {
    if (dateRange.start) {
      query = query.where("date", ">=", dateRange.start);
    }
    if (dateRange.end) {
      query = query.where("date", "<=", dateRange.end);
    }
  }

  if (orderBy) {
    query = query.orderBy([
      `${orderBy.column} ${orderBy.dir}`,
      "createdAt asc",
    ]);
  }

  return query.execute();
};

export const getUserScoreAverages = async ({
  userId,
  dateRange,
}: {
  userId: string;
  dateRange: { start: string; end: string };
}) => {
  const mutualUserCircles = await getMutualCircleUsers(userId);
  return db
    .selectFrom("ConnectionsResults")
    .leftJoin("User", "ConnectionsResults.userId", "User.id")
    .select(({ fn }) => [
      "userId",
      "User.name",
      "User.image",
      fn.agg<string>("avg", ["ConnectionsResults.score"]).as("scoreAverage"),
    ])
    .groupBy(["userId", "User.name", "User.image"])
    .orderBy("scoreAverage", "desc")
    .where("date", ">=", dateRange.start)
    .where("date", "<=", dateRange.end)
    .where(
      "User.id",
      "in",
      mutualUserCircles.map((r) => r.id),
    )
    .execute();
};

export const getUserResultCount = async ({
  userId,
  dateRange,
}: {
  userId: string;
  dateRange: { start: string; end: string };
}) => {
  const mutualUserCircles = await getMutualCircleUsers(userId);
  return db
    .selectFrom("ConnectionsResults")
    .leftJoin("User", "ConnectionsResults.userId", "User.id")
    .select(({ fn }) => [
      "userId",
      "User.name",
      "User.image",
      fn.agg<string>("count", ["ConnectionsResults.id"]).as("count"),
    ])
    .groupBy(["userId", "User.name", "User.image"])
    .orderBy("count", "desc")
    .where("date", ">=", dateRange.start)
    .where("date", "<=", dateRange.end)
    .where(
      "User.id",
      "in",
      mutualUserCircles.map((r) => r.id),
    )
    .execute();
};

export const createConnectionsResult = async (
  connectionsResult: NewConnectionsResults,
) => {
  const lastResult = (
    await db
      .selectFrom("ConnectionsResults")
      .selectAll("ConnectionsResults")
      .where("userId", "=", connectionsResult.userId)
      .orderBy("date", "desc")
      .limit(1)
      .execute()
  )[0];

  if (lastResult && lastResult.date === connectionsResult.date) {
    return lastResult;
  }

  let currentStreak = 0;
  if (
    lastResult &&
    lastResult.date ===
      LocalDate.parse(connectionsResult.date).minusDays(1).toJSON()
  ) {
    currentStreak = (lastResult.streak || 0) + 1;
  }

  return db
    .insertInto("ConnectionsResults")
    .values({
      ...connectionsResult,
      streak: currentStreak,
    })
    .returningAll()
    .executeTakeFirstOrThrow();
};
