import { db } from "..";
import { Database, NewUser } from "../types";
import { getSingle } from "../utils";
import { Transaction } from "kysely";

export const createUser = (user: NewUser, trx?: Transaction<Database>) =>
  (trx ?? db)
    .insertInto("User")
    .values(user)
    .returningAll()
    .execute()
    .then(getSingle);

export const deleteUser = async (
  userId: string,
  trx?: Transaction<Database>,
) => {
  await (trx ?? db)
    .deleteFrom("CircleUsers")
    .where("userId", "=", userId)
    .execute();

  await (trx ?? db)
    .deleteFrom("ConnectionsResults")
    .where("userId", "=", userId)
    .execute();

  return (trx ?? db)
    .deleteFrom("User")
    .where("id", "=", userId)
    .returningAll()
    .execute()
    .then(getSingle);
};
