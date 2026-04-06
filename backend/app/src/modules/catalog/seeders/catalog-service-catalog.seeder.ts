import { Injectable, Logger } from "@nestjs/common";

import { DatabaseService } from "../../../database/database.service";
import { serviceCatalog, specialtyCatalog } from "../catalog/services.catalog";
import { services, specialties } from "../schema/catalog.schema";

@Injectable()
export class CatalogServiceCatalogSeeder {
  private readonly logger = new Logger(CatalogServiceCatalogSeeder.name);

  constructor(private readonly databaseService: DatabaseService) {}

  async run(): Promise<void> {
    for (const specialty of specialtyCatalog) {
      await this.databaseService.connection
        .insert(specialties)
        .values({
          id: specialty.id,
          code: specialty.code,
          name: specialty.name,
          status: "active",
          source: "seed",
        })
        .onDuplicateKeyUpdate({
          set: {
            code: specialty.code,
            name: specialty.name,
            status: "active",
            source: "seed",
            updatedAt: new Date(),
          },
        });
    }

    for (const service of serviceCatalog) {
      await this.databaseService.connection
        .insert(services)
        .values({
          id: service.id,
          code: service.code,
          name: service.name,
          specialtyId: service.specialtyId,
          category: service.serviceType,
          serviceType: service.serviceType,
          status: "active",
          source: "seed",
        })
        .onDuplicateKeyUpdate({
          set: {
            code: service.code,
            name: service.name,
            specialtyId: service.specialtyId,
            category: service.serviceType,
            serviceType: service.serviceType,
            status: "active",
            source: "seed",
            updatedAt: new Date(),
          },
        });
    }

    this.logger.log(
      `Seeded ${specialtyCatalog.length} specialties and ${serviceCatalog.length} services`,
    );
  }
}
