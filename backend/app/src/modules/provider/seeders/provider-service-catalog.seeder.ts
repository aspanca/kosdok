import { Injectable, Logger } from "@nestjs/common";

import { DatabaseService } from "../../../database/database.service";
import { providerServiceCatalog, providerSpecialtyCatalog } from "../catalog/provider-services.catalog";
import {
  serviceCapabilityRequirements,
  services,
  specialties,
} from "../schema/provider.schema";

@Injectable()
export class ProviderServiceCatalogSeeder {
  private readonly logger = new Logger(ProviderServiceCatalogSeeder.name);

  constructor(private readonly databaseService: DatabaseService) {}

  async run(): Promise<void> {
    for (const specialty of providerSpecialtyCatalog) {
      await this.databaseService.connection
        .insert(specialties)
        .values({
          id: specialty.id,
          code: specialty.code,
          name: specialty.name,
        })
        .onDuplicateKeyUpdate({
          set: {
            code: specialty.code,
            name: specialty.name,
            updatedAt: new Date(),
          },
        });
    }

    for (const service of providerServiceCatalog) {
      await this.databaseService.connection
        .insert(services)
        .values({
          id: service.id,
          code: service.code,
          name: service.name,
          category: service.category,
          specialtyId: service.specialtyId,
        })
        .onDuplicateKeyUpdate({
          set: {
            code: service.code,
            name: service.name,
            category: service.category,
            specialtyId: service.specialtyId,
            updatedAt: new Date(),
          },
        });

      for (const requiredCapability of service.requiredCapabilities) {
        await this.databaseService.connection
          .insert(serviceCapabilityRequirements)
          .values({
            serviceId: service.id,
            capabilityKey: requiredCapability,
          })
          .onDuplicateKeyUpdate({
            set: {
              createdAt: new Date(),
            },
          });
      }
    }

    this.logger.log(
      `Seeded ${providerSpecialtyCatalog.length} specialties and ${providerServiceCatalog.length} services`,
    );
  }
}
