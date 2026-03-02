import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  const hasPatients = await knex.schema.hasTable("patients");
  const hasClinics = await knex.schema.hasTable("clinics");

  if (hasPatients && !(await knex.schema.hasColumn("patients", "suspended_at"))) {
    await knex.schema.alterTable("patients", (t) => t.timestamp("suspended_at").nullable());
  }
  if (hasClinics && !(await knex.schema.hasColumn("clinics", "suspended_at"))) {
    await knex.schema.alterTable("clinics", (t) => t.timestamp("suspended_at").nullable());
  }
}

export async function down(knex: Knex): Promise<void> {
  if (await knex.schema.hasColumn("patients", "suspended_at")) {
    await knex.schema.alterTable("patients", (t) => t.dropColumn("suspended_at"));
  }
  if (await knex.schema.hasColumn("clinics", "suspended_at")) {
    await knex.schema.alterTable("clinics", (t) => t.dropColumn("suspended_at"));
  }
}
