"use server";

import { db } from "..";
import { Database, NewCircles } from "../types";
import { getSingle } from "../utils";
import { Transaction } from "kysely";
import { jsonArrayFrom } from "kysely/helpers/postgres";

export const getCircles = () =>
  db
    .selectFrom("Circles")
    .fullJoin("CircleUsers", "Circles.id", "CircleUsers.circleId")
    .leftJoin("User as createdByUser", "createdByUser.id", "Circles.createdBy")
    .select((eb) => [
      "Circles.id",
      "Circles.name",
      "Circles.description",
      "Circles.isSystem",
      "createdByUser.name as createdByUserName",
      "createdByUser.image as createdByUserImage",
      eb
        .case()
        .when("Circles.password", "is not", null)
        .then(true)
        .when("Circles.password", "is", null)
        .then(false)
        .end()
        .as("hasPassword"),
      eb.fn.agg<number>("count", ["CircleUsers.userId"]).as("userCount"),
      jsonArrayFrom(
        eb
          .selectFrom("CircleUsers")
          .leftJoin("User", "CircleUsers.userId", "User.id")
          .whereRef("CircleUsers.circleId", "=", "Circles.id")
          .limit(4)
          .select(["User.id", "User.name", "User.image"]),
      ).as("users"),
    ])
    .groupBy(["Circles.id", "createdByUserName", "createdByUserImage"])
    .execute();

export const mutualCircleUsers = async (userId: string) => {
  const requestedCircles = await getUserCircles(userId);

  return db
    .selectFrom("User")
    .distinctOn(["User.id"])
    .leftJoin("CircleUsers", "User.id", "CircleUsers.userId")
    .leftJoin("Circles", "Circles.id", "CircleUsers.circleId")
    .where((eb) =>
      eb.or([
        eb("Circles.isSystem", "=", true),
        requestedCircles.length > 0
          ? eb(
              "CircleUsers.circleId",
              "in",
              requestedCircles.map((c) => c.circleId),
            )
          : eb("User.id", "=", userId),
      ]),
    )
    .select("User.id")
    .execute();
};

export const getCircle = async (circleId: string) =>
  db
    .selectFrom("Circles")
    .where("Circles.id", "=", circleId)
    .selectAll()
    .execute()
    .then(getSingle);

export const getCircleUsers = async (
  circleId: string,
  trx?: Transaction<Database>,
) =>
  (trx ?? db)
    .selectFrom("CircleUsers")
    .leftJoin("User", "CircleUsers.userId", "User.id")
    .where("CircleUsers.circleId", "=", circleId)
    .selectAll("User")
    .execute();

export const deleteCircle = (circleId: string, trx?: Transaction<Database>) =>
  (trx ?? db)
    .deleteFrom("Circles")
    .where("id", "=", circleId)
    .returningAll()
    .execute()
    .then(getSingle);

export const createCircle = async (values: NewCircles) =>
  (await db.insertInto("Circles").values(values).returningAll().execute())[0];

export const getUserCircles = (userId: string) =>
  db
    .selectFrom("CircleUsers")
    .where("CircleUsers.userId", "=", userId)
    .select("CircleUsers.circleId")
    .execute();

export const addUserToCircle = (
  {
    circleId,
    userId,
  }: {
    circleId: string;
    userId: string;
  },
  trx?: Transaction<Database>,
) =>
  (trx ?? db).insertInto("CircleUsers").values({ circleId, userId }).execute();

export const removeUserFromCircle = ({
  circleId,
  userId,
}: {
  circleId: string;
  userId: string;
}) =>
  db
    .deleteFrom("CircleUsers")
    .where("userId", "=", userId)
    .where("circleId", "=", circleId)
    .execute();
