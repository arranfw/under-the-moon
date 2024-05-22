import { Pool } from "pg";
import { Kysely, PostgresDialect } from "kysely";
import { Database } from "./types";

export const pool = new Pool({
  host: process.env.DATABASE_HOST || "127.0.0.1",
  user: process.env.DATABASE_USER || "admin",
  password: process.env.DATABASE_PASSWORD || "mysecretpassword",
  database: process.env.DATABASE_NAME || "local",
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  ssl:
    process.env.ENV_LEVEL === "local"
      ? false
      : {
          rejectUnauthorized: false,
          requestCert: true,
        },
});

const dialect = new PostgresDialect({
  pool,
});

export const db = new Kysely<Database>({
  dialect,
});
