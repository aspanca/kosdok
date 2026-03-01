import type { Knex } from "knex";

/**
 * Migrate clinic data from users to clinics.
 * Update clinic_services and clinic_locations to reference clinics.
 * Remove clinic rows from users.
 */
export async function up(knex: Knex): Promise<void> {
  const hasUsers = await knex.schema.hasTable("users");
  const hasClinics = await knex.schema.hasTable("clinics");

  if (!hasClinics) return;

  if (hasUsers) {
    await knex.raw(`
      INSERT INTO clinics (id, email, password_hash, name, phone, address, city, website, description, logo, instagram, facebook, linkedin, pictures, schedule, created_at, updated_at)
      SELECT id, email, password_hash, COALESCE(clinic_name, email), phone, address, city, website, description, logo, instagram, facebook, linkedin, pictures, schedule, created_at, updated_at
      FROM users WHERE type = 'clinic'
    `).catch(() => {});

    await knex.raw("SET FOREIGN_KEY_CHECKS = 0");
    try {
      await knex.schema.alterTable("clinic_services", (table) => {
        table.dropForeign(["clinic_id"]);
      });
    } catch {}
    try {
      await knex.schema.alterTable("clinic_locations", (table) => {
        table.dropForeign(["clinic_id"]);
      });
    } catch {}
    await knex.raw("SET FOREIGN_KEY_CHECKS = 1");
  }

  if (await knex.schema.hasTable("clinic_services")) {
    try {
      await knex.schema.alterTable("clinic_services", (table) => {
        table.foreign("clinic_id").references("id").inTable("clinics").onDelete("CASCADE");
      });
    } catch {}
  }
  if (await knex.schema.hasTable("clinic_locations")) {
    try {
      await knex.schema.alterTable("clinic_locations", (table) => {
        table.foreign("clinic_id").references("id").inTable("clinics").onDelete("CASCADE");
      });
    } catch {}
  }

  if (hasUsers) {
    await knex("users").where("type", "clinic").del();
  }
}

export async function down(knex: Knex): Promise<void> {
  // Reverse: migrate clinics back to users, restore FKs to users
  const clinics = await knex("clinics").select("*");
  const hasUsers = await knex.schema.hasTable("users");

  if (hasUsers && clinics.length > 0) {
    await knex.raw("SET FOREIGN_KEY_CHECKS = 0");
    if (await knex.schema.hasTable("clinic_services")) {
      await knex.schema.alterTable("clinic_services", (table) => {
        table.dropForeign(["clinic_id"]);
      });
      await knex.schema.alterTable("clinic_services", (table) => {
        table.foreign("clinic_id").references("id").inTable("users").onDelete("CASCADE");
      });
    }
    if (await knex.schema.hasTable("clinic_locations")) {
      await knex.schema.alterTable("clinic_locations", (table) => {
        table.dropForeign(["clinic_id"]);
      });
      await knex.schema.alterTable("clinic_locations", (table) => {
        table.foreign("clinic_id").references("id").inTable("users").onDelete("CASCADE");
      });
    }
    await knex.raw("SET FOREIGN_KEY_CHECKS = 1");

    for (const c of clinics) {
      await knex("users").insert({
        id: c.id,
        email: c.email,
        password_hash: c.password_hash,
        type: "clinic",
        clinic_name: c.name,
        phone: c.phone,
        address: c.address,
        city: c.city,
        website: c.website,
        description: c.description,
        logo: c.logo,
        instagram: c.instagram,
        facebook: c.facebook,
        linkedin: c.linkedin,
        pictures: c.pictures,
        schedule: c.schedule,
        created_at: c.created_at,
        updated_at: c.updated_at,
      });
    }
  }

  await knex("clinics").del();
}
