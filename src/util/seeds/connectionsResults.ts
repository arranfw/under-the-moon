import { db } from "@/db";
import { createConnectionsResult } from "@/db/repositories";
import { addUserToCircle, createCircle } from "@/db/repositories/circles";
import { createUser } from "@/db/repositories/user";
import { User } from "@/db/types";

import {
  circleFactory,
  connectionsResultsFactory,
  userFactory,
} from "../testUtils";
import { input } from "@inquirer/prompts";
import { LocalDate } from "@js-joda/core";
import { result, times } from "lodash";

const numberInput = async ({
  message,
  defaultValue,
}: {
  message: string;
  defaultValue: string;
}) =>
  parseInt(
    await input({
      message,
      default: defaultValue,
      validate: (value) => !Number.isNaN(value) || "You must provide a number",
    }),
  );

(async () => {
  const userCount = await numberInput({
    message: "How many users would you like to create?",
    defaultValue: "5",
  });

  const resultCount = await numberInput({
    message: "How many days of results would you like to create?",
    defaultValue: "12",
  });

  const circle = await createCircle(circleFactory.build());

  const createdUsers: User[] = [];

  const userTimes = times(userCount);
  const connectionsResultsTimes = times(resultCount);

  await db.transaction().execute(async (trx) => {
    console.log(`Creating user ${1} of ${userCount}`);
    for await (const _ of userTimes) {
      const user = await createUser(userFactory.build(), trx);
      await addUserToCircle(
        {
          circleId: circle.id,
          userId: user.id,
        },
        trx,
      );
      createdUsers.push(user);

      for await (const index of connectionsResultsTimes) {
        await createConnectionsResult(
          connectionsResultsFactory.build({
            userId: user.id,
            date: LocalDate.now().minusDays(index).toJSON(),
          }),
          trx,
        );
      }
    }
  });

  console.log({ circle, createdUsers });

  await db.destroy();
})();
