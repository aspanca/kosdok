import { Module } from "@nestjs/common";

import { DatabaseModule } from "../../database/database.module";
import { ProviderModule } from "../provider/provider.module";

import { CatalogController } from "./catalog.controller";
import { CatalogService } from "./catalog.service";
import { CATALOG_REPO } from "./repositories/catalog.repo";
import { CatalogRepository } from "./repositories/catalog.repository";
import { CatalogCitiesSeeder } from "./seeders/catalog-cities.seeder";
import { CatalogServiceCatalogSeeder } from "./seeders/catalog-service-catalog.seeder";

@Module({
  imports: [DatabaseModule, ProviderModule],
  controllers: [CatalogController],
  providers: [
    {
      provide: CATALOG_REPO,
      useExisting: CatalogRepository,
    },
    CatalogRepository,
    CatalogService,
    CatalogCitiesSeeder,
    CatalogServiceCatalogSeeder,
  ],
  exports: [CatalogCitiesSeeder, CatalogService, CatalogServiceCatalogSeeder],
})
export class CatalogModule {}
