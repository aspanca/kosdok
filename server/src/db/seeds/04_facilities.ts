import type { Knex } from "knex";

const facilities: { name: string; icon: string; category: string }[] = [
  { name: "Parking", icon: "car", category: "Lehtësira" },
  { name: "Wi-Fi", icon: "wifi", category: "Lehtësira" },
  { name: "Akses për invalidë", icon: "accessibility", category: "Lehtësira" },
  { name: "Pranon sigurim", icon: "shield", category: "Shërbim" },
  { name: "Miqësor për fëmijë", icon: "baby", category: "Lehtësira" },
  { name: "Shërbim urgjence 24/7", icon: "siren", category: "Shërbim" },
  { name: "Kartë krediti", icon: "credit-card", category: "Pagesë" },
  { name: "Konsultim online", icon: "monitor", category: "Shërbim" },
];

export async function seed(knex: Knex): Promise<void> {
  await knex("facilities").del();
  await knex("facilities").insert(facilities);
}
