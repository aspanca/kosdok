import type { Knex } from "knex";

const services: { name: string; category: string }[] = [
  { name: "Kardiologji", category: "Specialitet" },
  { name: "Dermatologji", category: "Specialitet" },
  { name: "Neurologji", category: "Specialitet" },
  { name: "Ortopedi", category: "Specialitet" },
  { name: "Pediatri", category: "Specialitet" },
  { name: "ORL (Vesh, Hundë, Fyt)", category: "Specialitet" },
  { name: "Oftalmologji", category: "Specialitet" },
  { name: "Stomatologji", category: "Specialitet" },
  { name: "Gjinekologji", category: "Specialitet" },
  { name: "Urologji", category: "Specialitet" },
  { name: "Gastroenterologji", category: "Specialitet" },
  { name: "Radiologji", category: "Specialitet" },
  { name: "Pulmonologji", category: "Specialitet" },
  { name: "Endokrinologji", category: "Specialitet" },
  { name: "Nefrologji", category: "Specialitet" },
  { name: "Onkologji", category: "Specialitet" },
  { name: "Reumatologji", category: "Specialitet" },
  { name: "Psikiatri", category: "Specialitet" },
  { name: "Anesteziologji", category: "Specialitet" },
  { name: "Kirurgji e përgjithshme", category: "Specialitet" },
  { name: "Kirurgji ortopedike", category: "Specialitet" },
  { name: "Kirurgji plastike", category: "Specialitet" },
  { name: "Medicinë e brendshme", category: "Specialitet" },
  { name: "Medicinë familjare", category: "Specialitet" },
  { name: "Medicinë urgjente", category: "Specialitet" },
  { name: "Fizioterapi", category: "Shërbim" },
  { name: "Laborator analiza", category: "Shërbim" },
  { name: "Imagjinë diagnostike (MRI, CT)", category: "Shërbim" },
  { name: "Ekokardiografi", category: "Shërbim" },
  { name: "Elektrokardiografi (EKG)", category: "Shërbim" },
  { name: "Ultrashikim", category: "Shërbim" },
  { name: "Rentgen", category: "Shërbim" },
  { name: "Vaksinim", category: "Shërbim" },
  { name: "Konsultim online", category: "Shërbim" },
  { name: "Kontroll vjetor", category: "Shërbim" },
  { name: "Dhurim gjak", category: "Shërbim" },
  { name: "Barnatore", category: "Shërbim" },
  { name: "Shërbim urgjence 24/7", category: "Shërbim" },
  { name: "Ambulancë", category: "Shërbim" },
  { name: "Spitalizim", category: "Shërbim" },
  { name: "Operacione", category: "Shërbim" },
];

export async function seed(knex: Knex): Promise<void> {
  await knex("clinic_services").del();
  await knex("services").del();
  await knex("services").insert(services);
}
