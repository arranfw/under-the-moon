import { ZonedDateTime } from "@js-joda/core";
import type { Generated } from "kysely";

export interface Database {
  User: {
    id: Generated<string>;
    name: string | null;
    email: string;
    emailVerified: ZonedDateTime | null;
    image: string | null;
  };
  Account: {
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
  };
  Session: {
    id: Generated<string>;
    userId: string;
    sessionToken: string;
    expires: ZonedDateTime;
  };
  VerificationToken: {
    identifier: string;
    token: string;
    expires: ZonedDateTime;
  };
}
