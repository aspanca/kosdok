import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("reviews", (table) => {
    table.increments("id").primary();
    table.integer("patient_id").unsigned().notNullable().references("id").inTable("patients").onDelete("CASCADE");
    table.enum("provider_type", ["clinic", "doctor"]).notNullable();
    table.integer("provider_id").unsigned().notNullable();
    table.tinyint("rating").unsigned().notNullable();
    table.text("comment").notNullable();
    table.unique(["patient_id", "provider_type", "provider_id"]);
    table.index(["provider_type", "provider_id"]);
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("reviews");
}
