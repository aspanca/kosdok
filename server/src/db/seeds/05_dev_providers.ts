import type { Knex } from "knex";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 12;

const DEFAULT_SCHEDULE = JSON.stringify({
  monday: { open: "08:00", close: "17:00" },
  tuesday: { open: "08:00", close: "17:00" },
  wednesday: { open: "08:00", close: "17:00" },
  thursday: { open: "08:00", close: "17:00" },
  friday: { open: "08:00", close: "17:00" },
  saturday: { open: "09:00", close: "14:00" },
  sunday: { closed: true },
});

export async function seed(knex: Knex): Promise<void> {
  const existing = await knex("clinics").where("email", "klinika.demo@kosdok.com").first();
  if (existing) return;

  const passwordHash = await bcrypt.hash("klinika123", SALT_ROUNDS);

  await knex("clinics").insert([
    {
      email: "klinika.demo@kosdok.com",
      password_hash: passwordHash,
      name: "Klinika Demo",
      phone: "+383 44 100 100",
      address: "Rr. Nëna Terezë 10",
      city: "Prishtinë",
      description: "Klinikë e përgjithshme me shërbime ambulatore dhe diagnostikë.",
      schedule: DEFAULT_SCHEDULE,
    },
    {
      email: "spitali.demo@kosdok.com",
      password_hash: passwordHash,
      name: "Spitali Demo",
      phone: "+383 44 200 200",
      address: "Rr. Agim Ramadani 5",
      city: "Prizren",
      description: "Spital privat me repart kirurgjie dhe maternitet.",
      schedule: DEFAULT_SCHEDULE,
    },
  ]);

  await knex("doctors").insert([
    {
      email: "alban.gashi@kosdok.com",
      password_hash: passwordHash,
      first_name: "Alban",
      last_name: "Gashi",
      phone: "+383 49 123 456",
      specialty: "Dermatolog",
      address: "Rr. UÇK 22",
      city: "Prishtinë",
      bio: "Dermatolog me 10 vjet përvojë në trajtimin e sëmundjeve të lëkurës.",
    },
    {
      email: "elira.krasniqi@kosdok.com",
      password_hash: passwordHash,
      first_name: "Elira",
      last_name: "Krasniqi",
      phone: "+383 49 654 321",
      specialty: "Kardiologe",
      address: "Rr. Fehmi Agani 8",
      city: "Pejë",
      bio: "Kardiologe e specializuar në ekokardiografi dhe hipertension.",
    },
  ]);
}
