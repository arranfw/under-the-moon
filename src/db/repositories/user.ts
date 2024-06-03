import { db } from "..";
import { NewUser } from "../types";
import { getSingle } from "../utils";

export const createUser = (user: NewUser) =>
  db.insertInto("User").values(user).returningAll().execute().then(getSingle);
