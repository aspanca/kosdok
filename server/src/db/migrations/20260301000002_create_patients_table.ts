import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("patients", (table) => {
    table.increments("id").primary();
    table.string("first_name", 100).notNullable();
    table.string("last_name", 100).notNullable();
    table.string("email", 255).notNullable().unique();
    table.string("password_hash", 255).notNullable();
    table.string("phone_number", 20).nullable();
    table.date("date_of_birth").nullable();
    table.enum("gender", ["male", "female", "other"]).nullable();
    table.string("picture", 500).nullable();
    table.timestamp("email_verified_at").nullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("patients");
}
