"use server";

import { db } from "..";
import { ConnectionsResults, NewConnectionsResults } from "../types";
import { LocalDate } from "@js-joda/core";
import { OrderByDirection } from "kysely/dist/cjs/parser/order-by-parser";

export const getConnectionsResults = ({
  date,
  userId,
  orderBy,
  dateRange,
}: {
  date?: string;
  userId?: string;
  orderBy?: {
    column: keyof ConnectionsResults;
    dir: OrderByDirection;
  };
  dateRange?: { start?: string; end?: string };
}) => {
  let query = db
    .selectFrom("ConnectionsResults")
    .selectAll("ConnectionsResults")
    .leftJoin("User", "ConnectionsResults.userId", "User.id")
    .select(["User.name", "User.image"]);

  if (date) {
    query = query.where("date", "=", date);
  }

  if (userId) {
    query = query.where("userId", "=", userId);
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
    query = query.orderBy(orderBy.column, orderBy.dir);
    query = query.orderBy("createdAt", "asc");
  }

  return query.execute();
};

export const getConnectionsStreaks = (date: string) =>
  db
    .selectFrom("ConnectionsResults")
    .leftJoin("User", "ConnectionsResults.userId", "User.id")
    .select(({ fn }) => [
      "userId",
      "User.name",
      "User.image",
      fn.agg<string>("max", ["ConnectionsResults.streak"]).as("streak"),
      fn.agg<string>("max", ["ConnectionsResults.date"]).as("date"),
    ])
    .where("ConnectionsResults.streak", ">=", 3)
    .groupBy(["userId", "User.name", "User.image"])
    .orderBy("streak", "desc")
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
