import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("patients", (table) => {
    table.string("city", 100).nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("patients", (table) => {
    table.dropColumn("city");
  });
}
