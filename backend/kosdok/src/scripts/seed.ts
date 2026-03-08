import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";

import { AppModule } from "../app.module";
import { AuthUsersSeeder } from "../modules/identity/seeders/auth-users.seeder";
import { UserProfilesSeeder } from "../modules/user/seeders/user-profiles.seeder";

type SeederEntry = {
  key: string;
  run: (app: Awaited<ReturnType<typeof NestFactory.createApplicationContext>>) => Promise<void>;
};

const registry: SeederEntry[] = [
  {
    key: "identity",
    run: async (app) => {
      await app.get(AuthUsersSeeder).run();
    },
  },
  {
    key: "user",
    run: async (app) => {
      await app.get(UserProfilesSeeder).run();
    },
  },
];

async function bootstrap(): Promise<void> {
  const logger = new Logger("SeedRunner");
  const app = await NestFactory.createApplicationContext(AppModule, { logger });
  const target = process.argv[2]?.trim().toLowerCase();

  try {
    const selected = target ? registry.filter((entry) => entry.key === target) : registry;

    if (target && selected.length === 0) {
      const available = registry.map((entry) => entry.key).join(", ");
      throw new Error(`Unknown seed target "${target}". Available: ${available}`);
    }

    for (const entry of selected) {
      logger.log(`Running seed: ${entry.key}`);
      await entry.run(app);
    }
  } finally {
    await app.close();
  }
}

void bootstrap();
