"use server";

import { db } from "..";
import { ConnectionsResults, NewConnectionsResults } from "../types";
import { LocalDate } from "@js-joda/core";
import { OrderByDirection } from "kysely/dist/cjs/parser/order-by-parser";

export const getConnectionsResults = async ({
  date,
  userId,
  orderBy,
  dateRange,
}: {
  date?: string;
  userId: string;
  orderBy?: {
    column: keyof ConnectionsResults;
    dir: OrderByDirection;
  };
  dateRange?: { start?: string; end?: string };
  circleId?: string;
}) => {
  const requestedCircles = await db
    .selectFrom("CircleUsers")
    .where("CircleUsers.userId", "=", userId)
    .select("CircleUsers.circleId")
    .execute();

  let query = db
    .selectFrom("ConnectionsResults")
    .distinctOn(["ConnectionsResults.userId", "ConnectionsResults.createdAt"])
    .selectAll("ConnectionsResults")
    .leftJoin("User", "ConnectionsResults.userId", "User.id")
    .fullJoin("CircleUsers", "ConnectionsResults.userId", "CircleUsers.userId")
    .select(["User.name", "User.image"]);

  if (requestedCircles.length === 0) {
    query = query.where("ConnectionsResults.userId", "=", userId);
  } else {
    query = query.where((eb) =>
      eb.or([
        eb("ConnectionsResults.userId", "=", userId),
        eb(
          "CircleUsers.circleId",
          "in",
          requestedCircles.map((c) => c.circleId),
        ),
      ]),
    );
  }

  if (date) {
    query = query.where("date", "=", date);
  }

  if (dateRange) {
    if (dateRange.start) {
      query = query.where("date", ">=", dateRange.start);
    }
    if (dateRange.end) {
      query = query.where("date", "<=", dateRange.end);
    }
  }

  if (orderBy) {
    query = query
      .orderBy([`${orderBy.column} ${orderBy.dir}`, "createdAt asc"])
      .distinctOn([orderBy.column]);
  }

  return query.execute();
};

export const getUserScoreAverages = ({
  dateRange,
}: {
  dateRange: { start: string; end: string };
}) =>
  db
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
    .execute();

export const getUserResultCount = ({
  dateRange,
}: {
  dateRange: { start: string; end: string };
}) =>
  db
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
    .execute();

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
