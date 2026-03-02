import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("doctors", (table) => {
    table.increments("id").primary();
    table.string("email", 255).notNullable().unique();
    table.string("password_hash", 255).notNullable();
    table.string("first_name", 100).notNullable();
    table.string("last_name", 100).notNullable();
    table.string("phone", 20).nullable();
    table.string("specialty", 255).nullable();
    table.string("address", 255).nullable();
    table.string("city", 100).nullable();
    table.string("avatar", 500).nullable();
    table.text("bio").nullable();
    table.timestamp("suspended_at").nullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("doctors");
}
