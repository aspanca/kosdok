import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("users", (table) => {
    table.string("instagram", 255).nullable();
    table.string("facebook", 255).nullable();
    table.string("linkedin", 255).nullable();
    table.text("pictures").nullable();
    table.text("schedule").nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("users", (table) => {
    table.dropColumn("instagram");
    table.dropColumn("facebook");
    table.dropColumn("linkedin");
    table.dropColumn("pictures");
    table.dropColumn("schedule");
  });
}
