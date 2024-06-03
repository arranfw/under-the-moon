import {
  circleFactory,
  connectionsResultsFactory,
  userFactory,
} from "@/util/testUtils";

import { db } from "..";
import { addUserToCircle, createCircle } from "./circles";
import {
  createConnectionsResult,
  getConnectionsResults,
} from "./connectionsResults";
import { createUser } from "./user";
import { faker } from "@faker-js/faker";
import { LocalDate } from "@js-joda/core";

describe("connectionsResults repository", () => {
  afterEach(async () => {
    await db.deleteFrom("ConnectionsResults").execute();
    await db.deleteFrom("CircleUsers").execute();
    await db.deleteFrom("Circles").execute();
    await db.deleteFrom("User").execute();
  });
  afterAll(async () => {
    await db.destroy();
  });
  describe("getConnectionsResults", () => {
    it("returns results filtered by userId", async () => {
      const user1 = await createUser(userFactory.build());
      const user2 = await createUser(userFactory.build());

      await createConnectionsResult(
        connectionsResultsFactory.build({
          userId: user1.id,
          date: LocalDate.now().toJSON(),
        }),
      );

      await createConnectionsResult(
        connectionsResultsFactory.build({
          userId: user2.id,
          date: LocalDate.now().toJSON(),
        }),
      );

      const results = await getConnectionsResults({
        userId: user1.id,
      });

      expect(results).toEqual([
        expect.objectContaining({
          userId: user1.id,
        }),
      ]);
    });

    it("does not return results for other users by default", async () => {
      const user1 = await createUser(userFactory.build());
      const user2 = await createUser(userFactory.build());

      const circle = await createCircle(circleFactory.build());
      await addUserToCircle({ userId: user1.id, circleId: circle.id });
      await addUserToCircle({ userId: user2.id, circleId: circle.id });

      await createConnectionsResult(
        connectionsResultsFactory.build({
          userId: user1.id,
          date: LocalDate.now().toJSON(),
        }),
      );

      await createConnectionsResult(
        connectionsResultsFactory.build({
          userId: user2.id,
          date: LocalDate.now().toJSON(),
        }),
      );

      const results = await getConnectionsResults({
        userId: user1.id,
      });

      expect(results).toEqual([
        expect.objectContaining({
          userId: user1.id,
        }),
      ]);
    });

    it("returns results for a specific date", async () => {
      const now = LocalDate.now();
      const user = await createUser(userFactory.build());

      await createConnectionsResult(
        connectionsResultsFactory.build({
          userId: user.id,
          date: now.minusDays(1).toJSON(),
        }),
      );
      await createConnectionsResult(
        connectionsResultsFactory.build({
          userId: user.id,
          date: now.minusDays(2).toJSON(),
        }),
      );
      await createConnectionsResult(
        connectionsResultsFactory.build({
          userId: user.id,
          date: now.minusDays(3).toJSON(),
        }),
      );

      const results = await getConnectionsResults({
        userId: user.id,
        dateRange: {
          start: now.minusDays(2).toJSON(),
          end: now.minusDays(2).toJSON(),
        },
      });
      expect(results).toHaveLength(1);
      expect(results).toEqual([
        expect.objectContaining({
          userId: user.id,
          date: now.minusDays(2).toJSON(),
        }),
      ]);
    });

    it("returns results filtered by dateRange", async () => {
      const now = LocalDate.now();
      const user = await createUser(userFactory.build());
      await createConnectionsResult(
        connectionsResultsFactory.build({
          userId: user.id,
          date: now.minusDays(4).toJSON(),
        }),
      );

      await createConnectionsResult(
        connectionsResultsFactory.build({
          userId: user.id,
          date: now.minusDays(2).toJSON(),
        }),
      );

      await createConnectionsResult(
        connectionsResultsFactory.build({
          userId: user.id,
          date: now.toJSON(),
        }),
      );

      const results = await getConnectionsResults({
        userId: user.id,
        dateRange: {
          start: now.minusDays(3).toJSON(),
          end: now.minusDays(1).toJSON(),
        },
      });

      expect(results).toEqual([
        expect.objectContaining({
          date: now.minusDays(2).toJSON(),
        }),
      ]);
    });

    it("returns results filtered by dateRange and userId", async () => {
      const now = LocalDate.now();
      const user1 = await createUser(userFactory.build());
      const user2 = await createUser(userFactory.build());
      await createConnectionsResult(
        connectionsResultsFactory.build({
          userId: user1.id,
          date: now.minusDays(4).toJSON(),
        }),
      );

      await createConnectionsResult(
        connectionsResultsFactory.build({
          userId: user2.id,
          date: now.minusDays(4).toJSON(),
        }),
      );

      await createConnectionsResult(
        connectionsResultsFactory.build({
          userId: user1.id,
          date: now.toJSON(),
        }),
      );

      const results = await getConnectionsResults({
        dateRange: {
          start: now.minusDays(5).toJSON(),
          end: now.minusDays(4).toJSON(),
        },
        userId: user1.id,
      });

      expect(results).toEqual([
        expect.objectContaining({
          userId: user1.id,
          date: now.minusDays(4).toJSON(),
        }),
      ]);
    });

    it("returns results in ascending order", async () => {
      const user = await createUser(userFactory.build());
      await createConnectionsResult(
        connectionsResultsFactory.build({
          userId: user.id,
          date: LocalDate.now().minusDays(1).toJSON(),
        }),
      );

      await createConnectionsResult(
        connectionsResultsFactory.build({
          userId: user.id,
          date: LocalDate.now().toJSON(),
        }),
      );

      await createConnectionsResult(
        connectionsResultsFactory.build({
          userId: user.id,
          date: LocalDate.now().minusDays(2).toJSON(),
        }),
      );

      const results = await getConnectionsResults({
        userId: user.id,
        orderBy: {
          column: "date",
          dir: "asc",
        },
      });

      expect(results).toEqual([
        expect.objectContaining({
          date: LocalDate.now().minusDays(2).toJSON(),
        }),
        expect.objectContaining({
          date: LocalDate.now().minusDays(1).toJSON(),
        }),
        expect.objectContaining({
          date: LocalDate.now().toJSON(),
        }),
      ]);
    });

    it("returns results in descending order", async () => {
      const user = await createUser(userFactory.build());
      const circle = await createCircle(circleFactory.build({}));
      await addUserToCircle({
        userId: user.id,
        circleId: circle.id,
      });
      await createConnectionsResult(
        connectionsResultsFactory.build({
          userId: user.id,
          date: LocalDate.now().minusDays(1).toJSON(),
        }),
      );

      await createConnectionsResult(
        connectionsResultsFactory.build({
          userId: user.id,
          date: LocalDate.now().toJSON(),
        }),
      );

      await createConnectionsResult(
        connectionsResultsFactory.build({
          userId: user.id,
          date: LocalDate.now().minusDays(2).toJSON(),
        }),
      );

      const results = await getConnectionsResults({
        userId: user.id,
        orderBy: {
          column: "date",
          dir: "desc",
        },
      });

      expect(results).toEqual([
        expect.objectContaining({
          date: LocalDate.now().toJSON(),
        }),
        expect.objectContaining({
          date: LocalDate.now().minusDays(1).toJSON(),
        }),
        expect.objectContaining({
          date: LocalDate.now().minusDays(2).toJSON(),
        }),
      ]);
    });

    it("only returns results for users with shared circles", async () => {
      const user1 = await createUser(userFactory.build());
      const user2 = await createUser(userFactory.build());
      const user3 = await createUser(userFactory.build());
      const circle1 = await createCircle(circleFactory.build());
      const circle2 = await createCircle(circleFactory.build());
      const circle3 = await createCircle(circleFactory.build());

      await addUserToCircle({
        userId: user1.id,
        circleId: circle1.id,
      });

      await addUserToCircle({
        userId: user1.id,
        circleId: circle3.id,
      });

      await addUserToCircle({
        userId: user2.id,
        circleId: circle2.id,
      });

      await addUserToCircle({
        userId: user3.id,
        circleId: circle1.id,
      });

      await createConnectionsResult(
        connectionsResultsFactory.build({
          userId: user1.id,
          date: LocalDate.now().toJSON(),
        }),
      );

      await createConnectionsResult(
        connectionsResultsFactory.build({
          userId: user2.id,
          date: LocalDate.now().toJSON(),
        }),
      );

      await createConnectionsResult(
        connectionsResultsFactory.build({
          userId: user3.id,
          date: LocalDate.now().toJSON(),
        }),
      );

      const results = await getConnectionsResults({
        userId: user1.id,
        includeCircles: true,
      });

      expect(results).toHaveLength(2);
      expect(results).toIncludeAllMembers([
        expect.objectContaining({
          userId: user3.id,
        }),
        expect.objectContaining({
          userId: user1.id,
        }),
      ]);
    });

    it("returns results for users in global circles", async () => {
      const user1 = await createUser(userFactory.build());
      const user2 = await createUser(userFactory.build());
      const user3 = await createUser(userFactory.build());
      const circle2 = await createCircle(
        circleFactory.build({
          isSystem: true,
        }),
      );

      await addUserToCircle({
        userId: user2.id,
        circleId: circle2.id,
      });
      await addUserToCircle({
        userId: user3.id,
        circleId: circle2.id,
      });

      await createConnectionsResult(
        connectionsResultsFactory.build({
          userId: user2.id,
          date: LocalDate.now().toJSON(),
        }),
      );
      await createConnectionsResult(
        connectionsResultsFactory.build({
          userId: user3.id,
          date: LocalDate.now().toJSON(),
        }),
      );

      const results = await getConnectionsResults({
        userId: user1.id,
        includeCircles: true,
      });

      expect(results).toHaveLength(2);
      expect(results).toIncludeAllMembers([
        expect.objectContaining({
          userId: user3.id,
        }),
        expect.objectContaining({
          userId: user2.id,
        }),
      ]);
    });

    it("returns results ordered by score", async () => {
      const user = await createUser(userFactory.build());
      const now = LocalDate.now();

      await Promise.all(
        connectionsResultsFactory
          .buildList(3, {
            userId: user.id,
          })
          .map((result, i) =>
            createConnectionsResult({
              ...result,
              date: now.minusDays(i).toJSON(),
              score: Math.round(i / 2),
            }),
          ),
      );

      const results = await getConnectionsResults({
        userId: user.id,
        orderBy: {
          column: "score",
          dir: "desc",
        },
      });

      expect(results).toHaveLength(3);
      expect(results).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            score: 1,
          }),
          expect.objectContaining({
            score: 1,
          }),
          expect.objectContaining({
            score: 0,
          }),
        ]),
      );
    });
  });

  describe("createConnectionsResult", () => {
    it("creates a new result", async () => {
      const user = await createUser(userFactory.build());
      const result = await createConnectionsResult(
        connectionsResultsFactory.build({
          userId: user.id,
          date: LocalDate.now().toJSON(),
        }),
      );

      expect(result).toEqual(
        expect.objectContaining({
          userId: user.id,
          date: LocalDate.now().toJSON(),
        }),
      );
    });

    it("does not create duplicate results for the same user and date", async () => {
      const user = await createUser(userFactory.build());

      const now = LocalDate.now();
      await createConnectionsResult(
        connectionsResultsFactory.build({
          userId: user.id,
          date: now.toJSON(),
        }),
      );

      await createConnectionsResult(
        connectionsResultsFactory.build({
          userId: user.id,
          date: now.toJSON(),
        }),
      );

      const results = await getConnectionsResults({
        userId: user.id,
      });

      expect(results).toHaveLength(1);
    });
  });
});
