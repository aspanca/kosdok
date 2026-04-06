import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";

import { AppModule } from "../app.module";
import { CatalogCitiesSeeder } from "../modules/catalog/seeders/catalog-cities.seeder";
import { CatalogServiceCatalogSeeder } from "../modules/catalog/seeders/catalog-service-catalog.seeder";
import { AuthUsersSeeder } from "../modules/identity/seeders/auth-users.seeder";
import { ProviderCapabilityCatalogSeeder } from "../modules/provider/seeders/provider-capability-catalog.seeder";
import { ProviderServiceCapabilityRequirementsSeeder } from "../modules/provider/seeders/provider-service-capability-requirements.seeder";
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
  {
    key: "catalog",
    run: async (app) => {
      await app.get(CatalogCitiesSeeder).run();
      await app.get(CatalogServiceCatalogSeeder).run();
    },
  },
  {
    key: "provider",
    run: async (app) => {
      await app.get(ProviderCapabilityCatalogSeeder).run();
      await app.get(ProviderServiceCapabilityRequirementsSeeder).run();
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
