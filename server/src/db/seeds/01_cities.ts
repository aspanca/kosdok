import type { Knex } from "knex";

// Kosovo municipalities/cities with postal codes (based on Posta e Kosovës regional structure)
// Prishtina: 10xxx, Prizren: 20xxx, Peja: 30xxx, Mitrovica: 40xxx, Gjakova: 50xxx, Gjilan: 60xxx, Ferizaj: 70xxx
const cities: { name: string; postcode: string }[] = [
  // Prishtina district (10xxx)
  { name: "Prishtinë", postcode: "10000" },
  { name: "Fushë Kosova", postcode: "10080" },
  { name: "Lipjan", postcode: "14050" },
  { name: "Podujevë", postcode: "11000" },
  { name: "Obiliq", postcode: "11050" },
  { name: "Graçanicë", postcode: "10500" },
  { name: "Drenas", postcode: "12050" },
  { name: "Novobërda", postcode: "16050" },
  // Prizren district (20xxx)
  { name: "Prizren", postcode: "20000" },
  { name: "Dragash", postcode: "22000" },
  { name: "Suhareka", postcode: "23000" },
  { name: "Malisheva", postcode: "24000" },
  // Peja district (30xxx)
  { name: "Peja", postcode: "30000" },
  { name: "Istog", postcode: "31000" },
  { name: "Klinë", postcode: "32000" },
  { name: "Deçan", postcode: "33000" },
  { name: "Junik", postcode: "33050" },
  { name: "Rahovec", postcode: "34000" },
  // Mitrovica district (40xxx)
  { name: "Mitrovicë", postcode: "40000" },
  { name: "Mitrovica e Veriut", postcode: "40000" },
  { name: "Skenderaj", postcode: "41000" },
  { name: "Vushtrri", postcode: "42000" },
  { name: "Zubin Potoku", postcode: "43000" },
  { name: "Leposaviq", postcode: "44000" },
  { name: "Zveçan", postcode: "45000" },
  // Gjakova district (50xxx)
  { name: "Gjakovë", postcode: "50000" },
  // Gjilan district (60xxx)
  { name: "Gjilan", postcode: "60000" },
  { name: "Kamenicë", postcode: "61000" },
  { name: "Vitia", postcode: "62000" },
  { name: "Kllokot", postcode: "63000" },
  { name: "Partesh", postcode: "64000" },
  { name: "Ranillug", postcode: "65000" },
  // Ferizaj district (70xxx)
  { name: "Ferizaj", postcode: "70000" },
  { name: "Shtime", postcode: "71000" },
  { name: "Kaçanik", postcode: "72000" },
  { name: "Hani i Elezit", postcode: "73000" },
  { name: "Shtërpca", postcode: "74000" },
  { name: "Mamusha", postcode: "75000" },
];

export async function seed(knex: Knex): Promise<void> {
  await knex("cities").del();
  await knex("cities").insert(cities.map((c) => ({ name: c.name, postcode: c.postcode })));
}
