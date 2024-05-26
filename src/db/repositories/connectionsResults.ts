"use server";

import { db } from "..";
import { ConnectionsResults, NewConnectionsResults } from "../types";
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

export const createConnectionsResult = async (
  connectionsResult: NewConnectionsResults,
) => {
  const existingRecord = await getConnectionsResults({
    date: connectionsResult.date,
    userId: connectionsResult.userId,
  });

  if (existingRecord[0]) {
    return existingRecord[0];
  }

  return db
    .insertInto("ConnectionsResults")
    .values(connectionsResult)
    .returningAll()
    .executeTakeFirstOrThrow();
};
