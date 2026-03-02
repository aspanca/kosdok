import type { Knex } from "knex";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 12;

export async function seed(knex: Knex): Promise<void> {
  const existing = await knex("admins").where("email", "admin@kosdok.com").first();
  if (existing) return;

  const passwordHash = await bcrypt.hash("admin123", SALT_ROUNDS);
  await knex("admins").insert({
    email: "admin@kosdok.com",
    password_hash: passwordHash,
    name: "Admin",
  });
}
