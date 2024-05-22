"use server";

import { db } from "..";
import { NewConnectionsResults } from "../types";

export const getConnectionsResults = ({
  date,
  userId,
}: {
  date: string;
  userId?: string;
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

  return query.execute();
};

export const createConnectionsResult = (
  connectionsResult: NewConnectionsResults,
) =>
  db
    .insertInto("ConnectionsResults")
    .values(connectionsResult)
    .returningAll()
    .executeTakeFirstOrThrow();
