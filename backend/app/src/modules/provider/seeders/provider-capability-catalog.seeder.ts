import { Injectable, Logger } from "@nestjs/common";

import { DatabaseService } from "../../../database/database.service";
import {
  providerCapabilityCatalog,
  providerOrganizationTypeCatalog,
  providerTypeCapabilityDefaultsCatalog,
} from "../catalog/provider-capabilities.catalog";
import {
  capabilities,
  organizationTypeCapabilityDefaults,
  organizationTypes,
} from "../schema/provider.schema";

@Injectable()
export class ProviderCapabilityCatalogSeeder {
  private readonly logger = new Logger(ProviderCapabilityCatalogSeeder.name);

  constructor(private readonly databaseService: DatabaseService) {}

  async run(): Promise<void> {
    for (const organizationType of providerOrganizationTypeCatalog) {
      await this.databaseService.connection
        .insert(organizationTypes)
        .values({
          code: organizationType.code,
          label: organizationType.label,
        })
        .onDuplicateKeyUpdate({
          set: {
            label: organizationType.label,
            updatedAt: new Date(),
          },
        });
    }

    for (const capability of providerCapabilityCatalog) {
      await this.databaseService.connection
        .insert(capabilities)
        .values({
          key: capability.key,
          category: capability.category,
          description: capability.description,
        })
        .onDuplicateKeyUpdate({
          set: {
            category: capability.category,
            description: capability.description,
            updatedAt: new Date(),
          },
        });
    }

    for (const capabilityDefault of providerTypeCapabilityDefaultsCatalog) {
      await this.databaseService.connection
        .insert(organizationTypeCapabilityDefaults)
        .values({
          typeCode: capabilityDefault.typeCode,
          capabilityKey: capabilityDefault.capabilityKey,
          enabledDefault: capabilityDefault.enabledDefault,
        })
        .onDuplicateKeyUpdate({
          set: {
            enabledDefault: capabilityDefault.enabledDefault,
            updatedAt: new Date(),
          },
        });
    }

    this.logger.log(
      `Seeded ${providerOrganizationTypeCatalog.length} organization types, ${providerCapabilityCatalog.length} capabilities, ${providerTypeCapabilityDefaultsCatalog.length} defaults`,
    );
  }
}
