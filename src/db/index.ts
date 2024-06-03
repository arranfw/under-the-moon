import { Database } from "./types";
import { LocalDate, ZonedDateTime } from "@js-joda/core";
import { Kysely, PostgresDialect } from "kysely";
import { Pool, PoolConfig, types } from "pg";

types.setTypeParser(types.builtins.TIMESTAMP, (val) =>
  ZonedDateTime.parse(val.split(" ").join("T") + "Z").toJSON(),
);

types.setTypeParser(types.builtins.DATE, (val) =>
  LocalDate.parse(val).toJSON(),
);

types.setTypeParser(types.builtins.INT8, (val) => Number(val));

const baseConfig = {
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
};

const connectionConfig: Record<string, PoolConfig> = {
  development: baseConfig,
  production: baseConfig,
  test: {
    ...baseConfig,
    database: "local_test",
    ssl: false,
  },
};

export const pool = new Pool(
  connectionConfig[process.env.NODE_ENV || "development"],
);

const dialect = new PostgresDialect({
  pool,
});

export const db = new Kysely<Database>({
  dialect,
  log: ["error"],
});
