import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("clinics", (table) => {
    table.integer("slot_duration_minutes").unsigned().notNullable().defaultTo(60);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("clinics", (table) => {
    table.dropColumn("slot_duration_minutes");
  });
}
