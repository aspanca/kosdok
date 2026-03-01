import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("cities", (table) => {
    table.increments("id").primary();
    table.string("name", 100).notNullable().unique();
    table.string("postcode", 10).notNullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("cities");
}
