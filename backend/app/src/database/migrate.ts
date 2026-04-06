import { drizzle } from "drizzle-orm/mysql2";
import { migrate } from "drizzle-orm/mysql2/migrator";
import { createPool } from "mysql2/promise";
import { loadEnvironmentFiles } from "@config/environment-files";

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function waitForDatabase(
  pool: ReturnType<typeof createPool>,
  maxAttempts = 30,
  delayMs = 1000,
): Promise<void> {
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      await pool.query("SELECT 1");
      return;
    } catch (error) {
      if (attempt === maxAttempts) {
        throw error;
      }

      await sleep(delayMs);
    }
  }
}

async function runMigrations(): Promise<void> {
  loadEnvironmentFiles(process.env.NODE_ENV);

  const pool = createPool({
    host: process.env.DB_HOST ?? "127.0.0.1",
    port: Number(process.env.DB_PORT ?? 3306),
    user: process.env.DB_USER ?? "kosdok",
    password: process.env.DB_PASSWORD ?? "kosdok",
    database: process.env.DB_NAME ?? "kosdok",
    waitForConnections: true,
    connectionLimit: 5,
  });

  try {
    await waitForDatabase(pool);

    const database = drizzle(pool, { mode: "default" });
    await migrate(database, {
      migrationsFolder: "./src/database/migrations",
    });
  } finally {
    await pool.end();
  }
}

void runMigrations();
