import knex from "knex";
import fs from "fs";
import path from "path";
import { env } from "./env";

const sslConfig = env.db.sslCa
  ? {
      ssl: {
        ca: fs.readFileSync(path.resolve(env.db.sslCa)),
        rejectUnauthorized: true,
      },
    }
  : {};

export const db = knex({
  client: "mysql2",
  connection: {
    host: env.db.host,
    port: env.db.port,
    user: env.db.user,
    password: env.db.password,
    database: env.db.name,
    ...sslConfig,
  },
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    tableName: "knex_migrations",
    directory: "../db/migrations",
  },
  seeds: {
    directory: "../db/seeds",
  },
});

export async function testConnection(): Promise<void> {
  try {
    await db.raw("SELECT 1");
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
}
