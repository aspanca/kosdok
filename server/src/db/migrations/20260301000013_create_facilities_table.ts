import type { Knex } from "knex";

/**
 * Facilities = amenities (parking, wifi, etc.) that clinics can offer.
 */
export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("facilities", (table) => {
    table.increments("id").primary();
    table.string("name", 255).notNullable();
    table.string("icon", 50).nullable();
    table.string("category", 100).nullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("facilities");
}
