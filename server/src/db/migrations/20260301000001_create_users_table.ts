import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("users", (table) => {
    table.increments("id").primary();
    table.string("email", 255).notNullable().unique();
    table.string("password_hash", 255).notNullable();
    table.enum("type", ["patient", "clinic"]).notNullable();

    // Patient fields
    table.string("first_name", 100).nullable();
    table.string("last_name", 100).nullable();
    table.string("avatar", 500).nullable();
    table.date("date_of_birth").nullable();
    table.enum("gender", ["male", "female", "other"]).nullable();

    // Clinic fields (also used for hospitals, labs, pharmacies)
    table.string("clinic_name", 255).nullable();
    table.string("logo", 500).nullable();
    table.string("website", 255).nullable();
    table.text("description").nullable();

    // Shared fields
    table.string("phone", 20).nullable();
    table.string("address", 255).nullable();
    table.string("city", 100).nullable();

    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("users");
}
