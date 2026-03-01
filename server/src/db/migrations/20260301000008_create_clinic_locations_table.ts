import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("clinic_locations", (table) => {
    table.increments("id").primary();
    table.integer("clinic_id").unsigned().notNullable().references("id").inTable("users").onDelete("CASCADE");
    table.string("name", 255).nullable();
    table.string("address", 500).nullable();
    table.string("city", 100).nullable();
    table.decimal("lat", 10, 7).nullable();
    table.decimal("lng", 10, 7).nullable();
    table.string("phone", 20).nullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("clinic_locations");
}
