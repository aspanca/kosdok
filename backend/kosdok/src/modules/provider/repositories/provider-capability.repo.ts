export const PROVIDER_CAPABILITY_REPO = Symbol("PROVIDER_CAPABILITY_REPO");

export interface TypeCapabilityDefault {
  typeCode: string;
  capabilityKey: string;
  enabledDefault: boolean;
}

export interface OrganizationCapabilityOverride {
  capabilityKey: string;
  enabled: boolean;
}

export interface UpsertOrganizationServiceInput {
  organizationId: string;
  serviceId: string;
  enabled: boolean;
}

export interface ProviderCapabilityRepo {
  findOrganizationTypeCodes(organizationId: string): Promise<string[]>;
  findTypeCapabilityDefaults(typeCodes: string[]): Promise<TypeCapabilityDefault[]>;
  findOrganizationCapabilityOverrides(
    organizationId: string,
  ): Promise<OrganizationCapabilityOverride[]>;
  findServiceCapabilityRequirements(serviceId: string): Promise<string[]>;
  upsertOrganizationService(input: UpsertOrganizationServiceInput): Promise<void>;
}
