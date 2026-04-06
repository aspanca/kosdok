import { defineConfig } from "drizzle-kit";
import { loadEnvironmentFiles } from "./src/config/environment-files";

loadEnvironmentFiles(process.env.NODE_ENV);

export default defineConfig({
  schema: "./src/modules/**/schema/*.ts",
  out: "./src/database/migrations",
  dialect: "mysql",
  dbCredentials: {
    host: process.env.DB_HOST ?? "127.0.0.1",
    port: Number(process.env.DB_PORT ?? 3306),
    user: process.env.DB_USER ?? "kosdok",
    password: process.env.DB_PASSWORD ?? "kosdok",
    database: process.env.DB_NAME ?? "kosdok",
  },
  verbose: true,
  strict: true,
});
