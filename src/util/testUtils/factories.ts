import { NewConnectionsResults, NewUser } from "@/db/types";

import { faker } from "@faker-js/faker";
import { ZonedDateTime } from "@js-joda/core";
import { Factory } from "rosie";

export const userFactory = Factory.define<NewUser>("User").attrs({
  id: faker.string.uuid,
  email: faker.internet.email,
  name: faker.person.fullName,
  emailVerified: null,
  image: faker.image.urlPlaceholder,
});

export const circleFactory = Factory.define("Circles").attrs({
  id: faker.string.uuid,
  name: faker.company.name,
  description: faker.company.catchPhrase,
  password: null,
  isSystem: false,
});

export const connectionsResultsFactory = Factory.define<NewConnectionsResults>(
  "ConnectionsResults",
).attrs({
  id: faker.string.uuid,
  userId: faker.string.uuid,
  date: ZonedDateTime.parse(faker.date.recent().toJSON())
    .toLocalDate()
    .toJSON(),
  score: faker.number.int({ min: 0, max: 100 }),
  gameNumber: faker.number.int({ min: 0, max: 100 }),
  guessCount: faker.number.int({ min: 0, max: 7 }),
  hintCount: faker.number.int({ min: 0, max: 4 }),
  summary: [],
});
