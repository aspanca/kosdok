import { BadRequestException, ConflictException } from "@nestjs/common";

import { Permission, Role } from "../../common/constants/permission.constants";

import { CatalogService } from "./catalog.service";

import type {
  CatalogCityRecord,
  CatalogRepo,
  CatalogServiceRecord,
  CatalogSpecialtyRecord,
  CreateCityInput,
  CreateServiceInput,
  CreateSpecialtyInput,
  CursorPage,
  ListCitiesInput,
  ListServicesInput,
  ListSpecialtiesInput,
  UpdateCityInput,
  UpdateServiceInput,
  UpdateSpecialtyInput,
} from "./repositories/catalog.repo";

class FakeCatalogRepo implements CatalogRepo {
  readonly specialties = new Map<string, CatalogSpecialtyRecord>();
  readonly services = new Map<string, CatalogServiceRecord>();
  readonly cities = new Map<string, CatalogCityRecord>();

  async listSpecialties(_input: ListSpecialtiesInput): Promise<CursorPage<CatalogSpecialtyRecord>> {
    return {
      items: [...this.specialties.values()],
      nextCursor: null,
    };
  }

  async listServices(_input: ListServicesInput): Promise<CursorPage<CatalogServiceRecord>> {
    return {
      items: [...this.services.values()],
      nextCursor: null,
    };
  }

  async listCities(_input: ListCitiesInput): Promise<CursorPage<CatalogCityRecord>> {
    return {
      items: [...this.cities.values()],
      nextCursor: null,
    };
  }

  async findSpecialtyById(specialtyId: string): Promise<CatalogSpecialtyRecord | undefined> {
    return this.specialties.get(specialtyId);
  }

  async createSpecialty(input: CreateSpecialtyInput): Promise<CatalogSpecialtyRecord> {
    const record: CatalogSpecialtyRecord = {
      id: input.id,
      code: input.code,
      name: input.name,
      status: input.status,
      source: input.source,
    };
    this.specialties.set(record.id, record);
    return record;
  }

  async updateSpecialty(
    specialtyId: string,
    input: UpdateSpecialtyInput,
  ): Promise<CatalogSpecialtyRecord | undefined> {
    const existing = this.specialties.get(specialtyId);

    if (!existing) {
      return undefined;
    }

    const updated: CatalogSpecialtyRecord = {
      ...existing,
      ...input,
    };
    this.specialties.set(specialtyId, updated);
    return updated;
  }

  async findServiceById(serviceId: string): Promise<CatalogServiceRecord | undefined> {
    return this.services.get(serviceId);
  }

  async createService(input: CreateServiceInput): Promise<CatalogServiceRecord> {
    const record: CatalogServiceRecord = {
      id: input.id,
      code: input.code,
      name: input.name,
      specialtyId: input.specialtyId ?? null,
      serviceType: input.serviceType,
      status: input.status,
      source: input.source,
    };
    this.services.set(record.id, record);
    return record;
  }

  async updateService(
    serviceId: string,
    input: UpdateServiceInput,
  ): Promise<CatalogServiceRecord | undefined> {
    const existing = this.services.get(serviceId);

    if (!existing) {
      return undefined;
    }

    const updated: CatalogServiceRecord = {
      ...existing,
      code: input.code ?? existing.code,
      name: input.name ?? existing.name,
      specialtyId: input.specialtyId ?? existing.specialtyId,
      serviceType: input.serviceType ?? existing.serviceType,
      status: input.status ?? existing.status,
    };
    this.services.set(serviceId, updated);
    return updated;
  }

  async findCityByCode(cityCode: string): Promise<CatalogCityRecord | undefined> {
    return this.cities.get(cityCode);
  }

  async createCity(input: CreateCityInput): Promise<CatalogCityRecord> {
    const record: CatalogCityRecord = {
      code: input.code,
      countryCode: input.countryCode,
      name: input.name,
      normalizedName: input.normalizedName,
      postalCode: input.postalCode ?? null,
      status: input.status,
      source: input.source,
    };
    this.cities.set(record.code, record);
    return record;
  }

  async updateCity(
    cityCode: string,
    input: UpdateCityInput,
  ): Promise<CatalogCityRecord | undefined> {
    const existing = this.cities.get(cityCode);

    if (!existing) {
      return undefined;
    }

    const updated: CatalogCityRecord = {
      ...existing,
      countryCode: input.countryCode ?? existing.countryCode,
      name: input.name ?? existing.name,
      normalizedName: input.normalizedName ?? existing.normalizedName,
      postalCode: input.postalCode ?? existing.postalCode,
      status: input.status ?? existing.status,
    };
    this.cities.set(cityCode, updated);
    return updated;
  }
}

class FakeProviderScopeAuthorizationService {
  readonly calls: Array<{ userId: string; organizationId: string }> = [];

  async assertScopedPermission(input: {
    user: { id: string };
    requiredPermission: string;
    organizationId: string;
    siteId?: string;
  }): Promise<void> {
    this.calls.push({ userId: input.user.id, organizationId: input.organizationId });
  }
}

describe("CatalogService", () => {
  const platformAdminUser = {
    id: "admin_1",
    email: "platform@kosdok.local",
    roles: [Role.PlatformAdmin],
    permissions: [Permission.ProviderRead],
  };

  const organizationStaffUser = {
    id: "staff_1",
    email: "staff@kosdok.local",
    roles: [Role.ClinicAdmin],
    permissions: [Permission.ProviderRead],
  };

  it("requires organization scope for non-admin service proposals", async () => {
    const repo = new FakeCatalogRepo();
    const scopeAuth = new FakeProviderScopeAuthorizationService();
    const service = new CatalogService(repo, scopeAuth as never);

    await expect(
      service.createService(organizationStaffUser, {
        code: "new_service",
        name: "New Service",
        serviceType: "consultation",
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it("creates organization service proposal as pending_review", async () => {
    const repo = new FakeCatalogRepo();
    const scopeAuth = new FakeProviderScopeAuthorizationService();
    const service = new CatalogService(repo, scopeAuth as never);

    const response = await service.createService(
      organizationStaffUser,
      {
        code: "new_service",
        name: "New Service",
        serviceType: "consultation",
      },
      "org_1",
    );

    expect(response.data.status).toBe("pending_review");
    expect(response.data.source).toBe("organization_request");
    expect(scopeAuth.calls).toEqual([{ userId: "staff_1", organizationId: "org_1" }]);
  });

  it("rejects invalid service status transitions", async () => {
    const repo = new FakeCatalogRepo();
    const scopeAuth = new FakeProviderScopeAuthorizationService();
    const service = new CatalogService(repo, scopeAuth as never);

    repo.services.set("svc_1", {
      id: "svc_1",
      code: "existing_service",
      name: "Existing Service",
      specialtyId: null,
      serviceType: "consultation",
      status: "active",
      source: "platform_admin",
    });

    await expect(
      service.patchService(platformAdminUser, "svc_1", {
        status: "pending_review",
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });
});
