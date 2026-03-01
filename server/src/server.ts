import { app } from "./app";
import { env, testConnection } from "./config";

async function start() {
  console.log("\n========================================");
  console.log("  KOSDOK API SERVER");
  console.log("========================================\n");

  await testConnection();

  app.listen(env.port, () => {
    console.log(`  Port:        ${env.port}`);
    console.log(`  Environment: ${env.nodeEnv}`);
    console.log(`  URL:         http://localhost:${env.port}`);
    console.log(`  Health:      http://localhost:${env.port}/api/health`);
    console.log(`  Client URL:  ${env.clientUrl}`);
    console.log("\n========================================");
    console.log("  Server is ready");
    console.log("========================================\n");
  });
}

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
