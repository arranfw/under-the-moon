import { NewCircles, NewConnectionsResults, NewUser } from "@/db/types";

import { faker } from "@faker-js/faker";
import { ZonedDateTime } from "@js-joda/core";
import { Factory } from "rosie";

export const userFactory = Factory.define<NewUser>("User").attrs({
  id: faker.string.uuid,
  email: faker.internet.email,
  name: faker.person.fullName,
  emailVerified: null,
  image: () =>
    faker.image.urlPlaceholder({
      text: "",
      height: 20,
      width: 20,
    }),
});

export const circleFactory = Factory.define<NewCircles>("Circles").attrs({
  id: faker.string.uuid,
  name: faker.company.name,
  description: faker.company.catchPhrase,
  password: null,
  isSystem: false,
});

const difficulties = [0, 1, 2, 3];

export const connectionsResultsFactory = Factory.define<NewConnectionsResults>(
  "ConnectionsResults",
).attrs({
  id: faker.string.uuid,
  userId: faker.string.uuid,
  date: () =>
    ZonedDateTime.parse(faker.date.recent().toJSON()).toLocalDate().toJSON(),
  score: () => faker.number.int({ min: 0, max: 100 }),
  gameNumber: () => faker.number.int({ min: 0, max: 100 }),
  guessCount: () => faker.number.int({ min: 0, max: 7 }),
  hintCount: () => faker.number.int({ min: 0, max: 4 }),
  summary: () => [
    faker.helpers.arrayElements(difficulties, 4),
    faker.helpers.arrayElements(difficulties, 4),
    faker.helpers.arrayElements(difficulties, 4),
    faker.helpers.arrayElements(difficulties, 4),
  ],
});
