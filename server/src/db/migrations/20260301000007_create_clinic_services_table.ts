import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("clinic_services", (table) => {
    table.increments("id").primary();
    table.integer("clinic_id").unsigned().notNullable().references("id").inTable("users").onDelete("CASCADE");
    table.integer("service_id").unsigned().notNullable().references("id").inTable("services").onDelete("CASCADE");
    table.unique(["clinic_id", "service_id"]);
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("clinic_services");
}
