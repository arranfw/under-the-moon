import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("Circles")
    .addColumn("id", "uuid", (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`),
    )
    .addColumn("name", "text", (col) => col.notNull())
    .addColumn("description", "text")
    .addColumn("isSystem", "boolean", (col) => col.defaultTo(false))
    .addColumn("createdBy", "uuid", (col) => col.references("User.id"))
    .addColumn("createdAt", "timestamp", (col) =>
      col
        .notNull()
        .defaultTo(
          sql`to_char(now(), 'YYYY-MM-DD"T"HH24:MI:SS.MSOF')::timestamp`,
        ),
    )
    .addColumn("updatedAt", "timestamp")
    .execute();

  await db
    .insertInto("Circles")
    .values({
      name: "Global",
      description: "Share with everyone!",
      isSystem: true,
    })
    .execute();

  await db.schema
    .createTable("CircleUsers")
    .addColumn("circleId", "uuid", (col) =>
      col.references("Circles.id").notNull(),
    )
    .addColumn("userId", "uuid", (col) => col.references("User.id").notNull())
    .addColumn("createdAt", "timestamp", (col) =>
      col
        .notNull()
        .defaultTo(
          sql`to_char(now(), 'YYYY-MM-DD"T"HH24:MI:SS.MSOF')::timestamp`,
        ),
    )
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("Circles").ifExists().execute();
  await db.schema.dropTable("CircleUsers").ifExists().execute();
}
