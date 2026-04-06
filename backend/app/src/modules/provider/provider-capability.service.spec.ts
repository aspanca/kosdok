import { BadRequestException } from "@nestjs/common";

import {
  OrganizationCapabilityOverride,
  ProviderCapabilityRepo,
  TypeCapabilityDefault,
  UpsertOrganizationServiceInput,
} from "./repositories/provider-capability.repo";
import { ProviderCapabilityService } from "./provider-capability.service";

type FakeRepoState = {
  typeCodesByOrganization: Record<string, string[]>;
  defaultsByType: Record<string, TypeCapabilityDefault[]>;
  overridesByOrganization: Record<string, OrganizationCapabilityOverride[]>;
  requirementsByService: Record<string, string[]>;
  upsertCalls: UpsertOrganizationServiceInput[];
};

class FakeProviderCapabilityRepo implements ProviderCapabilityRepo {
  constructor(private readonly state: FakeRepoState) {}

  async findOrganizationTypeCodes(organizationId: string): Promise<string[]> {
    return this.state.typeCodesByOrganization[organizationId] ?? [];
  }

  async findTypeCapabilityDefaults(typeCodes: string[]): Promise<TypeCapabilityDefault[]> {
    return typeCodes.flatMap((typeCode) => this.state.defaultsByType[typeCode] ?? []);
  }

  async findOrganizationCapabilityOverrides(
    organizationId: string,
  ): Promise<OrganizationCapabilityOverride[]> {
    return this.state.overridesByOrganization[organizationId] ?? [];
  }

  async findServiceCapabilityRequirements(serviceId: string): Promise<string[]> {
    return this.state.requirementsByService[serviceId] ?? [];
  }

  async upsertOrganizationService(input: UpsertOrganizationServiceInput): Promise<void> {
    this.state.upsertCalls.push(input);
  }
}

function buildService(state: Partial<FakeRepoState> = {}): {
  service: ProviderCapabilityService;
  repoState: FakeRepoState;
} {
  const repoState: FakeRepoState = {
    typeCodesByOrganization: state.typeCodesByOrganization ?? {},
    defaultsByType: state.defaultsByType ?? {},
    overridesByOrganization: state.overridesByOrganization ?? {},
    requirementsByService: state.requirementsByService ?? {},
    upsertCalls: [],
  };

  const repository = new FakeProviderCapabilityRepo(repoState);

  return {
    service: new ProviderCapabilityService(repository),
    repoState,
  };
}

describe("ProviderCapabilityService", () => {
  it("resolves effective capabilities from defaults and overrides", async () => {
    const { service } = buildService({
      typeCodesByOrganization: {
        org_1: ["clinic", "lab"],
      },
      defaultsByType: {
        clinic: [
          {
            typeCode: "clinic",
            capabilityKey: "appointments:book",
            enabledDefault: true,
          },
          {
            typeCode: "clinic",
            capabilityKey: "diagnostics:order",
            enabledDefault: false,
          },
        ],
        lab: [
          {
            typeCode: "lab",
            capabilityKey: "diagnostics:order",
            enabledDefault: true,
          },
        ],
      },
      overridesByOrganization: {
        org_1: [
          {
            capabilityKey: "appointments:book",
            enabled: false,
          },
        ],
      },
    });

    const effective = await service.resolveEffectiveCapabilities("org_1");

    expect(effective).toEqual([
      {
        key: "appointments:book",
        enabled: false,
      },
      {
        key: "diagnostics:order",
        enabled: true,
      },
    ]);
  });

  it("returns missing capabilities when service requirements are not satisfied", async () => {
    const { service } = buildService({
      typeCodesByOrganization: {
        org_1: ["clinic"],
      },
      defaultsByType: {
        clinic: [
          {
            typeCode: "clinic",
            capabilityKey: "appointments:book",
            enabledDefault: true,
          },
        ],
      },
      requirementsByService: {
        service_a: ["appointments:book", "pharmacy:dispense"],
      },
    });

    const result = await service.validateServiceEnablement("org_1", "service_a");

    expect(result).toEqual({
      allowed: false,
      missingCapabilities: ["pharmacy:dispense"],
    });
  });

  it("throws when trying to enable service with missing capabilities", async () => {
    const { service } = buildService({
      typeCodesByOrganization: {
        org_1: ["clinic"],
      },
      requirementsByService: {
        service_a: ["appointments:book"],
      },
    });

    await expect(
      service.setOrganizationServiceEnabled({
        organizationId: "org_1",
        serviceId: "service_a",
        enabled: true,
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it("persists disable requests without capability validation", async () => {
    const { service, repoState } = buildService({
      requirementsByService: {
        service_a: ["appointments:book"],
      },
    });

    await service.setOrganizationServiceEnabled({
      organizationId: "org_1",
      serviceId: "service_a",
      enabled: false,
    });

    expect(repoState.upsertCalls).toEqual([
      {
        organizationId: "org_1",
        serviceId: "service_a",
        enabled: false,
      },
    ]);
  });
});
