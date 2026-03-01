import type { Knex } from "knex";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

dotenv.config({ path: path.resolve(__dirname, ".env") });

const sslCaPath = process.env.DB_SSL_CA_PATH;
const sslConfig = sslCaPath
  ? {
      ssl: {
        ca: fs.readFileSync(path.resolve(sslCaPath)),
        rejectUnauthorized: true,
      },
    }
  : {};

const config: Record<string, Knex.Config> = {
  development: {
    client: "mysql2",
    connection: {
      host: process.env.DB_HOST || "127.0.0.1",
      port: parseInt(process.env.DB_PORT || "3306", 10),
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "kosdok",
      ...sslConfig,
    },
    pool: { min: 2, max: 10 },
    migrations: {
      tableName: "knex_migrations",
      directory: "./src/db/migrations",
      extension: "ts",
    },
    seeds: {
      directory: "./src/db/seeds",
      extension: "ts",
    },
  },

  production: {
    client: "mysql2",
    connection: {
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || "3306", 10),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ...sslConfig,
    },
    pool: { min: 2, max: 10 },
    migrations: {
      tableName: "knex_migrations",
      directory: "./dist/db/migrations",
    },
    seeds: {
      directory: "./dist/db/seeds",
    },
  },
};

export default config;
