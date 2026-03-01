import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("services", (table) => {
    table.increments("id").primary();
    table.string("name", 255).notNullable();
    table.string("category", 100).nullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("services");
}
