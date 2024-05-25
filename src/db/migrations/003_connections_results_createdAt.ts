import { db } from "..";
import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable("ConnectionsResults")
    .addColumn("createdAt", "timestamp", (col) =>
      col.defaultTo(
        sql`to_char(now(), 'YYYY-MM-DD"T"HH24:MI:SS.MSOF')::timestamp`,
      ),
    )
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable("ConnectionsResults")
    .dropColumn("createdAt")
    .execute();
}

// down(db);
