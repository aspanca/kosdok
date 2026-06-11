import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("appointments", (table) => {
    table.increments("id").primary();
    table.integer("patient_id").unsigned().notNullable().references("id").inTable("patients").onDelete("CASCADE");
    table.enum("provider_type", ["clinic", "doctor"]).notNullable();
    table.integer("provider_id").unsigned().notNullable();
    table.date("date").notNullable();
    table.string("time", 5).notNullable();
    table.string("reason", 50).notNullable();
    table.text("notes").nullable();
    table.enum("status", ["pending", "confirmed", "cancelled", "completed"]).notNullable().defaultTo("pending");
    table.string("cancelled_by", 10).nullable();
    table.string("contact_phone", 30).nullable();
    table.string("contact_email", 255).nullable();
    table.index(["provider_type", "provider_id", "date"]);
    table.index(["patient_id", "status"]);
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("appointments");
}
