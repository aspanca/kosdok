import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("clinic_facilities", (table) => {
    table.increments("id").primary();
    table.integer("clinic_id").unsigned().notNullable().references("id").inTable("clinics").onDelete("CASCADE");
    table.integer("facility_id").unsigned().notNullable().references("id").inTable("facilities").onDelete("CASCADE");
    table.unique(["clinic_id", "facility_id"]);
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("clinic_facilities");
}
