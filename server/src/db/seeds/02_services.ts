import type { Knex } from "knex";

const services: { name: string; category: string; icon: string }[] = [
  { name: "Kardiologji", category: "Specialitet", icon: "heart" },
  { name: "Dermatologji", category: "Specialitet", icon: "activity" },
  { name: "Neurologji", category: "Specialitet", icon: "brain" },
  { name: "Ortopedi", category: "Specialitet", icon: "bone" },
  { name: "Pediatri", category: "Specialitet", icon: "baby" },
  { name: "ORL (Vesh, Hundë, Fyt)", category: "Specialitet", icon: "ear" },
  { name: "Oftalmologji", category: "Specialitet", icon: "eye" },
  { name: "Stomatologji", category: "Specialitet", icon: "stethoscope" },
  { name: "Gjinekologji", category: "Specialitet", icon: "baby" },
  { name: "Urologji", category: "Specialitet", icon: "droplet" },
  { name: "Gastroenterologji", category: "Specialitet", icon: "activity" },
  { name: "Radiologji", category: "Specialitet", icon: "scan-search" },
  { name: "Pulmonologji", category: "Specialitet", icon: "activity" },
  { name: "Endokrinologji", category: "Specialitet", icon: "activity" },
  { name: "Nefrologji", category: "Specialitet", icon: "droplet" },
  { name: "Onkologji", category: "Specialitet", icon: "microscope" },
  { name: "Reumatologji", category: "Specialitet", icon: "bone" },
  { name: "Psikiatri", category: "Specialitet", icon: "brain" },
  { name: "Anesteziologji", category: "Specialitet", icon: "syringe" },
  { name: "Kirurgji e përgjithshme", category: "Specialitet", icon: "scissors" },
  { name: "Kirurgji ortopedike", category: "Specialitet", icon: "bone" },
  { name: "Kirurgji plastike", category: "Specialitet", icon: "scissors" },
  { name: "Medicinë e brendshme", category: "Specialitet", icon: "stethoscope" },
  { name: "Medicinë familjare", category: "Specialitet", icon: "stethoscope" },
  { name: "Medicinë urgjente", category: "Specialitet", icon: "ambulance" },
  { name: "Fizioterapi", category: "Shërbim", icon: "activity" },
  { name: "Laborator analiza", category: "Shërbim", icon: "microscope" },
  { name: "Imagjinë diagnostike (MRI, CT)", category: "Shërbim", icon: "scan-search" },
  { name: "Ekokardiografi", category: "Shërbim", icon: "heart" },
  { name: "Elektrokardiografi (EKG)", category: "Shërbim", icon: "activity" },
  { name: "Ultrashikim", category: "Shërbim", icon: "scan-search" },
  { name: "Rentgen", category: "Shërbim", icon: "x" },
  { name: "Vaksinim", category: "Shërbim", icon: "syringe" },
  { name: "Konsultim online", category: "Shërbim", icon: "video" },
  { name: "Kontroll vjetor", category: "Shërbim", icon: "calendar" },
  { name: "Dhurim gjak", category: "Shërbim", icon: "droplet" },
  { name: "Barnatore", category: "Shërbim", icon: "pill" },
  { name: "Shërbim urgjence 24/7", category: "Shërbim", icon: "ambulance" },
  { name: "Ambulancë", category: "Shërbim", icon: "ambulance" },
  { name: "Spitalizim", category: "Shërbim", icon: "building-2" },
  { name: "Operacione", category: "Shërbim", icon: "scissors" },
];

export async function seed(knex: Knex): Promise<void> {
  await knex("clinic_services").del();
  await knex("services").del();
  await knex("services").insert(services);
}
