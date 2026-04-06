import { Injectable, Logger } from "@nestjs/common";
import { inArray } from "drizzle-orm";

import { DatabaseService } from "../../../database/database.service";
import { services } from "../../catalog/schema/catalog.schema";
import { providerServiceCapabilityRequirementsCatalog } from "../catalog/provider-service-capability-requirements.catalog";
import { capabilities, serviceCapabilityRequirements } from "../schema/provider.schema";

@Injectable()
export class ProviderServiceCapabilityRequirementsSeeder {
  private readonly logger = new Logger(ProviderServiceCapabilityRequirementsSeeder.name);

  constructor(private readonly databaseService: DatabaseService) {}

  async run(): Promise<void> {
    const serviceCodes = providerServiceCapabilityRequirementsCatalog.map(
      (entry) => entry.serviceCode,
    );
    const rows = await this.databaseService.connection
      .select({ id: services.id, code: services.code })
      .from(services)
      .where(inArray(services.code, serviceCodes));
    const servicesByCode = new Map(rows.map((row) => [row.code, row.id]));

    const capabilityKeys = [
      ...new Set(
        providerServiceCapabilityRequirementsCatalog.flatMap((entry) => entry.capabilityKeys),
      ),
    ];
    const capabilityRows = await this.databaseService.connection
      .select({ key: capabilities.key })
      .from(capabilities)
      .where(inArray(capabilities.key, capabilityKeys));
    const capabilitiesSet = new Set(capabilityRows.map((row) => row.key));

    let insertedLinks = 0;

    for (const entry of providerServiceCapabilityRequirementsCatalog) {
      const serviceId = servicesByCode.get(entry.serviceCode);

      if (!serviceId) {
        this.logger.warn(
          `Skipping capability links for service code ${entry.serviceCode} because service is not seeded`,
        );
        continue;
      }

      for (const capabilityKey of entry.capabilityKeys) {
        if (!capabilitiesSet.has(capabilityKey)) {
          this.logger.warn(
            `Skipping capability ${capabilityKey} for service code ${entry.serviceCode} because capability is not seeded`,
          );
          continue;
        }

        await this.databaseService.connection
          .insert(serviceCapabilityRequirements)
          .values({
            serviceId,
            capabilityKey,
          })
          .onDuplicateKeyUpdate({
            set: {
              createdAt: new Date(),
            },
          });

        insertedLinks += 1;
      }
    }

    this.logger.log(`Seeded ${insertedLinks} service capability links`);
  }
}
