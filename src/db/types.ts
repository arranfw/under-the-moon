import type { Generated, Insertable, Selectable, Updateable } from "kysely";
import { Nullable } from "kysely/dist/cjs/util/type-utils";

interface UserTable {
  id: Generated<string>;
  name: string | null;
  email: string;
  emailVerified: string | null;
  image: string | null;
}
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
  createdAt: string | null;
}
export type ConnectionsResults = Selectable<ConnectionsResultsTable>;
export type NewConnectionsResults = Insertable<ConnectionsResultsTable>;
export type ConnectionsResultsUpdate = Updateable<ConnectionsResultsTable>;

export interface Database {
  User: UserTable;
  Account: AccountTable;
  Session: SessionTable;
  VerificationToken: VerificationTokenTable;
  ConnectionsResults: ConnectionsResultsTable;
}
