import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("services", (table) => {
    table.string("icon", 50).nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("services", (table) => {
    table.dropColumn("icon");
  });
}
