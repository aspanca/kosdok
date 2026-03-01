import type { Knex } from "knex";

/**
 * Clinics as a separate entity (not users).
 * Used for clinic/hospital/pharmacy/lab registration and auth.
 */
export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("clinics", (table) => {
    table.increments("id").primary();
    table.string("email", 255).notNullable().unique();
    table.string("password_hash", 255).notNullable();
    table.string("name", 255).notNullable();
    table.string("phone", 20).nullable();
    table.string("address", 255).nullable();
    table.string("city", 100).nullable();
    table.string("website", 255).nullable();
    table.text("description").nullable();
    table.string("logo", 500).nullable();
    table.string("instagram", 255).nullable();
    table.string("facebook", 255).nullable();
    table.string("linkedin", 255).nullable();
    table.text("pictures").nullable();
    table.text("schedule").nullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("clinics");
}
