import { db } from "@/db";
import { deleteCircle, getCircleUsers } from "@/db/repositories/circles";
import { deleteUser } from "@/db/repositories/user";
import { User } from "@/db/types";

import { input } from "@inquirer/prompts";

(async () => {
  const circleId = await input({
    message: "ID of circle to delete",
  });

  await db.transaction().execute(async (trx) => {
    const circleUsers = await getCircleUsers(circleId, trx);
    console.log(circleUsers);

    const deletedUsers: User[] = [];
    for await (const user of circleUsers) {
      deletedUsers.push(await deleteUser(user.id!, trx));
    }

    const deletedCircle = await deleteCircle(circleId, trx);

    console.log({ deletedCircle, deletedUsers });
  });

  await db.destroy();
})();
