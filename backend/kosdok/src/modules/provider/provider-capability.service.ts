import { BadRequestException, Inject, Injectable } from "@nestjs/common";

import { PROVIDER_CAPABILITY_REPO } from "./repositories/provider-capability.repo";

import type {
  ProviderCapabilityRepo,
  UpsertOrganizationServiceInput,
} from "./repositories/provider-capability.repo";

export interface EffectiveCapability {
  key: string;
  enabled: boolean;
}

export interface ServiceEnablementResult {
  allowed: boolean;
  missingCapabilities: string[];
}

@Injectable()
export class ProviderCapabilityService {
  constructor(
    @Inject(PROVIDER_CAPABILITY_REPO)
    private readonly providerCapabilityRepo: ProviderCapabilityRepo,
  ) {}

  async resolveEffectiveCapabilities(organizationId: string): Promise<EffectiveCapability[]> {
    const effective = await this.resolveEffectiveCapabilityMap(organizationId);

    return [...effective.entries()]
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, enabled]) => ({ key, enabled }));
  }

  async validateServiceEnablement(
    organizationId: string,
    serviceId: string,
  ): Promise<ServiceEnablementResult> {
    const requiredCapabilities = await this.providerCapabilityRepo.findServiceCapabilityRequirements(
      serviceId,
    );

    if (requiredCapabilities.length === 0) {
      return {
        allowed: true,
        missingCapabilities: [],
      };
    }

    const effective = await this.resolveEffectiveCapabilityMap(organizationId);
    const missingCapabilities = requiredCapabilities.filter(
      (capabilityKey) => !effective.get(capabilityKey),
    );

    return {
      allowed: missingCapabilities.length === 0,
      missingCapabilities,
    };
  }

  async setOrganizationServiceEnabled(input: UpsertOrganizationServiceInput): Promise<void> {
    if (input.enabled) {
      const validation = await this.validateServiceEnablement(input.organizationId, input.serviceId);

      if (!validation.allowed) {
        throw new BadRequestException(
          `Service cannot be enabled. Missing capabilities: ${validation.missingCapabilities.join(", ")}`,
        );
      }
    }

    await this.providerCapabilityRepo.upsertOrganizationService(input);
  }

  private async resolveEffectiveCapabilityMap(organizationId: string): Promise<Map<string, boolean>> {
    const typeCodes = await this.providerCapabilityRepo.findOrganizationTypeCodes(organizationId);
    const defaults = await this.providerCapabilityRepo.findTypeCapabilityDefaults(typeCodes);
    const overrides = await this.providerCapabilityRepo.findOrganizationCapabilityOverrides(
      organizationId,
    );

    const effective = new Map<string, boolean>();

    for (const capabilityDefault of defaults) {
      const existing = effective.get(capabilityDefault.capabilityKey) ?? false;
      effective.set(capabilityDefault.capabilityKey, existing || capabilityDefault.enabledDefault);
    }

    for (const override of overrides) {
      effective.set(override.capabilityKey, override.enabled);
    }

    return effective;
  }
}
