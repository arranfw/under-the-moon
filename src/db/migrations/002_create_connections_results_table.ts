import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("ConnectionsResults")
    .addColumn("id", "uuid", (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`),
    )
    .addColumn("userId", "uuid", (col) =>
      col.references("User.id").onDelete("cascade").notNull(),
    )
    .addColumn("summary", sql`text[][]`)
    .addColumn("score", "integer")
    .addColumn("guessCount", "integer")
    .addColumn("hintCount", "integer")
    .addColumn("date", "date")
    .addColumn("gameNumber", "integer")
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("ConnectionsResults").ifExists().execute();
}
