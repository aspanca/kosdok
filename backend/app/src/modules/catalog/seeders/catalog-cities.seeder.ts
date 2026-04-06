import { Injectable, Logger } from "@nestjs/common";

import { DatabaseService } from "../../../database/database.service";
import { cityCatalog } from "../catalog/cities.catalog";
import { cities } from "../schema/catalog.schema";

@Injectable()
export class CatalogCitiesSeeder {
  private readonly logger = new Logger(CatalogCitiesSeeder.name);

  constructor(private readonly databaseService: DatabaseService) {}

  async run(): Promise<void> {
    for (const city of cityCatalog) {
      await this.databaseService.connection
        .insert(cities)
        .values({
          code: city.code,
          countryCode: city.countryCode,
          name: city.name,
          normalizedName: city.normalizedName,
          postalCode: city.postalCode,
          status: "active",
          source: "seed",
        })
        .onDuplicateKeyUpdate({
          set: {
            name: city.name,
            normalizedName: city.normalizedName,
            postalCode: city.postalCode,
            status: "active",
            source: "seed",
            updatedAt: new Date(),
          },
        });
    }

    this.logger.log(`Seeded ${cityCatalog.length} cities`);
  }
}
