import type { Generated, Insertable, Selectable, Updateable } from "kysely";

interface UserTable {
  id: Generated<string>;
  name: string | null;
  email: string;
  emailVerified: string | null;
  image: string | null;
}

export type User = Selectable<UserTable>;
export type NewUser = Insertable<UserTable>;
export type UpdateUser = Updateable<UserTable>;

interface AccountTable {
  id: Generated<string>;
  userId: string;
  type: string;
  provider: string;
  providerAccountId: string;
  refresh_token: string | null;
  access_token: string | null;
  expires_at: number | null;
  token_type: string | null;
  scope: string | null;
  id_token: string | null;
  session_state: string | null;
}
interface SessionTable {
  id: Generated<string>;
  userId: string;
  sessionToken: string;
  expires: string;
}
interface VerificationTokenTable {
  identifier: string;
  token: string;
  expires: string;
}
interface ConnectionsResultsTable {
  id: Generated<string>;
  userId: string;
  summary: number[][];
  score: number;
  guessCount: number;
  hintCount: number;
  date: string;
  gameNumber: number;
  createdAt: Generated<string>;
  streak: number | null;
}
export type ConnectionsResults = Selectable<ConnectionsResultsTable>;
export type NewConnectionsResults = Insertable<ConnectionsResultsTable>;
export type ConnectionsResultsUpdate = Updateable<ConnectionsResultsTable>;

interface CirclesTable {
  id: Generated<string>;
  name: string;
  description: string | null;
  createdBy: string;
  isSystem: Generated<boolean>;
  password: string | null;
  createdAt: Generated<string>;
  updatedAt: string | null;
}

export type Circles = Selectable<CirclesTable>;
export type NewCircles = Insertable<CirclesTable>;
export type CirclesUpdate = Updateable<CirclesTable>;

interface CircleUsersTable {
  circleId: string;
  userId: string;
  createdAt: Generated<string>;
}

export type CircleUsers = Selectable<CircleUsersTable>;
export type NewCircleUsers = Insertable<CircleUsersTable>;
export type CircleUsersUpdate = Updateable<CircleUsersTable>;

export interface Database {
  User: UserTable;
  Account: AccountTable;
  Session: SessionTable;
  VerificationToken: VerificationTokenTable;
  ConnectionsResults: ConnectionsResultsTable;
  Circles: CirclesTable;
  CircleUsers: CircleUsersTable;
}
