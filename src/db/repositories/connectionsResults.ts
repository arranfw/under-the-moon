"use server";

import { db } from "..";
import { ConnectionsResults, NewConnectionsResults } from "../types";
import { OrderByDirection } from "kysely/dist/cjs/parser/order-by-parser";

export const getConnectionsResults = ({
  date,
  userId,
  orderBy,
}: {
  date: string;
  userId?: string;
  orderBy?: {
    column: keyof ConnectionsResults;
    dir: OrderByDirection;
  };
}) => {
  let query = db
    .selectFrom("ConnectionsResults")
    .selectAll("ConnectionsResults")
    .leftJoin("User", "ConnectionsResults.userId", "User.id")
    .select("User.name")
    .where("date", "=", date);

  if (userId) {
    query = query.where("userId", "=", userId);
  }

  if (orderBy) {
    query = query.orderBy(orderBy.column, orderBy.dir);
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
