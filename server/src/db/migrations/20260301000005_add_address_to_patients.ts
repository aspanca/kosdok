import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("patients", (table) => {
    table.string("address", 255).nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("patients", (table) => {
    table.dropColumn("address");
  });
}
