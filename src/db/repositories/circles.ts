"use server";

import { db } from "..";
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

export const getUserCircles = (userId: string) =>
  db
    .selectFrom("User")
    .leftJoin("CircleUsers", "User.id", "CircleUsers.userId")
    .leftJoin("Circles", "CircleUsers.circleId", "Circles.id")
    .where("User.id", "=", userId)
    .select("Circles.id")
    .execute();

export const addUserToCircle = ({
  circleId,
  userId,
}: {
  circleId: string;
  userId: string;
}) => db.insertInto("CircleUsers").values({ circleId, userId }).execute();

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
