import { Injectable } from "@nestjs/common";
import { eq, inArray } from "drizzle-orm";

import { DatabaseService } from "../../../database/database.service";
import {
  organizationCapabilities,
  organizationServices,
  organizationTypeCapabilityDefaults,
  organizationTypeLinks,
  serviceCapabilityRequirements,
} from "../schema/provider.schema";

import type {
  OrganizationCapabilityOverride,
  ProviderCapabilityRepo,
  TypeCapabilityDefault,
  UpsertOrganizationServiceInput,
} from "./provider-capability.repo";

@Injectable()
export class ProviderCapabilityRepository implements ProviderCapabilityRepo {
  private readonly db;

  constructor(databaseService: DatabaseService) {
    this.db = databaseService.connection;
  }

  async findOrganizationTypeCodes(organizationId: string): Promise<string[]> {
    const rows = await this.db
      .select({ typeCode: organizationTypeLinks.typeCode })
      .from(organizationTypeLinks)
      .where(eq(organizationTypeLinks.organizationId, organizationId));

    return rows.map((row) => row.typeCode);
  }

  async findTypeCapabilityDefaults(typeCodes: string[]): Promise<TypeCapabilityDefault[]> {
    if (typeCodes.length === 0) {
      return [];
    }

    const rows = await this.db
      .select({
        typeCode: organizationTypeCapabilityDefaults.typeCode,
        capabilityKey: organizationTypeCapabilityDefaults.capabilityKey,
        enabledDefault: organizationTypeCapabilityDefaults.enabledDefault,
      })
      .from(organizationTypeCapabilityDefaults)
      .where(inArray(organizationTypeCapabilityDefaults.typeCode, typeCodes));

    return rows;
  }

  async findOrganizationCapabilityOverrides(
    organizationId: string,
  ): Promise<OrganizationCapabilityOverride[]> {
    const rows = await this.db
      .select({
        capabilityKey: organizationCapabilities.capabilityKey,
        enabled: organizationCapabilities.enabled,
      })
      .from(organizationCapabilities)
      .where(eq(organizationCapabilities.organizationId, organizationId));

    return rows;
  }

  async findServiceCapabilityRequirements(serviceId: string): Promise<string[]> {
    const rows = await this.db
      .select({ capabilityKey: serviceCapabilityRequirements.capabilityKey })
      .from(serviceCapabilityRequirements)
      .where(eq(serviceCapabilityRequirements.serviceId, serviceId));

    return rows.map((row) => row.capabilityKey);
  }

  async upsertOrganizationService(input: UpsertOrganizationServiceInput): Promise<void> {
    await this.db
      .insert(organizationServices)
      .values({
        organizationId: input.organizationId,
        serviceId: input.serviceId,
        enabled: input.enabled,
      })
      .onDuplicateKeyUpdate({
        set: {
          enabled: input.enabled,
          updatedAt: new Date(),
        },
      });
  }
}
