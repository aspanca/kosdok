import { randomUUID } from "node:crypto";

import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import { Permission, Role } from "../../common/constants/permission.constants";
import { ProviderScopeAuthorizationService } from "../provider/provider-scope-authorization.service";

import { CATALOG_REPO } from "./repositories/catalog.repo";

import { CATALOG_RESOURCE_STATUSES, CATALOG_SPECIALTY_STATUSES } from "./catalog.constants";
import { CreateCityDto } from "./dto/create-city.dto";
import { CreateServiceDto } from "./dto/create-service.dto";
import { CreateSpecialtyDto } from "./dto/create-specialty.dto";
import type {
  ListCatalogQueryDto,
  ListCatalogServicesQueryDto,
} from "./dto/list-catalog.query.dto";
import { PatchCityDto } from "./dto/patch-city.dto";
import { PatchServiceDto } from "./dto/patch-service.dto";
import { PatchSpecialtyDto } from "./dto/patch-specialty.dto";
import type { CatalogRepo } from "./repositories/catalog.repo";
import type { AuthUser } from "../../common/types/auth-user.type";

const DEFAULT_LIMIT = 20;

@Injectable()
export class CatalogService {
  constructor(
    @Inject(CATALOG_REPO)
    private readonly catalogRepo: CatalogRepo,
    private readonly providerScopeAuthorizationService: ProviderScopeAuthorizationService,
  ) {}

  async listSpecialties(query: ListCatalogQueryDto, user?: AuthUser) {
    const status = this.resolveListStatus(query.status, user, CATALOG_SPECIALTY_STATUSES);
    const limit = query.limit ?? DEFAULT_LIMIT;
    const result = await this.catalogRepo.listSpecialties({
      cursor: query.cursor,
      limit,
      q: query.q,
      status,
    });

    return {
      data: result.items,
      meta: {
        limit,
        nextCursor: result.nextCursor,
      },
    };
  }

  async listServices(query: ListCatalogServicesQueryDto, user?: AuthUser) {
    const status = this.resolveListStatus(query.status, user, CATALOG_RESOURCE_STATUSES);
    const limit = query.limit ?? DEFAULT_LIMIT;
    const result = await this.catalogRepo.listServices({
      cursor: query.cursor,
      limit,
      q: query.q,
      status,
      specialtyId: query.specialtyId,
      serviceType: query.serviceType,
    });

    return {
      data: result.items,
      meta: {
        limit,
        nextCursor: result.nextCursor,
      },
    };
  }

  async listCities(query: ListCatalogQueryDto, user?: AuthUser) {
    const status = this.resolveListStatus(query.status, user, CATALOG_RESOURCE_STATUSES);
    const limit = query.limit ?? DEFAULT_LIMIT;
    const result = await this.catalogRepo.listCities({
      cursor: query.cursor,
      limit,
      q: query.q,
      status,
    });

    return {
      data: result.items,
      meta: {
        limit,
        nextCursor: result.nextCursor,
      },
    };
  }

  async listServicesBySpecialty(specialtyId: string, query: ListCatalogQueryDto, user?: AuthUser) {
    const status = this.resolveListStatus(query.status, user, CATALOG_RESOURCE_STATUSES);
    const limit = query.limit ?? DEFAULT_LIMIT;
    const result = await this.catalogRepo.listServices({
      cursor: query.cursor,
      limit,
      q: query.q,
      status,
      specialtyId,
    });

    return {
      data: result.items,
      meta: {
        limit,
        nextCursor: result.nextCursor,
      },
    };
  }

  async createSpecialty(user: AuthUser, payload: CreateSpecialtyDto) {
    this.assertPlatformAdmin(user);

    const created = await this.catalogRepo.createSpecialty({
      id: randomUUID(),
      code: payload.code,
      name: payload.name,
      status: "active",
      source: "platform_admin",
    });

    return { data: created };
  }

  async patchSpecialty(user: AuthUser, specialtyId: string, payload: PatchSpecialtyDto) {
    this.assertPlatformAdmin(user);

    const existing = await this.catalogRepo.findSpecialtyById(specialtyId);

    if (!existing) {
      throw new NotFoundException("Specialty not found");
    }

    const nextStatus = payload.status ?? existing.status;
    this.assertSpecialtyTransition(existing.status, nextStatus);

    const updated = await this.catalogRepo.updateSpecialty(specialtyId, {
      code: payload.code,
      name: payload.name,
      status: payload.status,
    });

    if (!updated) {
      throw new NotFoundException("Specialty not found");
    }

    return { data: updated };
  }

  async createService(user: AuthUser, payload: CreateServiceDto, organizationId?: string) {
    if (payload.specialtyId) {
      await this.assertSpecialtyExists(payload.specialtyId);
    }

    const isAdmin = this.isPlatformAdmin(user);

    if (!isAdmin && !organizationId) {
      throw new BadRequestException(
        "x-organization-id header is required for organization proposals",
      );
    }

    if (!isAdmin && organizationId) {
      await this.providerScopeAuthorizationService.assertScopedPermission({
        user,
        requiredPermission: Permission.ProviderRead,
        organizationId,
      });
    }

    const created = await this.catalogRepo.createService({
      id: randomUUID(),
      code: payload.code,
      name: payload.name,
      specialtyId: payload.specialtyId,
      serviceType: payload.serviceType,
      status: isAdmin ? "active" : "pending_review",
      source: isAdmin ? "platform_admin" : "organization_request",
      requestedByOrganizationId: isAdmin ? undefined : organizationId,
      requestedByUserId: isAdmin ? undefined : user.id,
    });

    return { data: created };
  }

  async patchService(user: AuthUser, serviceId: string, payload: PatchServiceDto) {
    this.assertPlatformAdmin(user);

    const existing = await this.catalogRepo.findServiceById(serviceId);

    if (!existing) {
      throw new NotFoundException("Service not found");
    }

    if (payload.specialtyId) {
      await this.assertSpecialtyExists(payload.specialtyId);
    }

    const nextStatus = payload.status ?? existing.status;
    this.assertResourceTransition(existing.status, nextStatus, "service");

    const reviewedAt =
      payload.status && payload.status !== existing.status ? new Date() : undefined;

    const updated = await this.catalogRepo.updateService(serviceId, {
      code: payload.code,
      name: payload.name,
      specialtyId: payload.specialtyId,
      serviceType: payload.serviceType,
      status: payload.status,
      reviewNote: payload.reviewNote,
      reviewedByUserId: reviewedAt || payload.reviewNote ? user.id : undefined,
      reviewedAt,
    });

    if (!updated) {
      throw new NotFoundException("Service not found");
    }

    return { data: updated };
  }

  async createCity(user: AuthUser, payload: CreateCityDto, organizationId?: string) {
    const isAdmin = this.isPlatformAdmin(user);

    if (!isAdmin && !organizationId) {
      throw new BadRequestException(
        "x-organization-id header is required for organization proposals",
      );
    }

    if (!isAdmin && organizationId) {
      await this.providerScopeAuthorizationService.assertScopedPermission({
        user,
        requiredPermission: Permission.ProviderRead,
        organizationId,
      });
    }

    const created = await this.catalogRepo.createCity({
      code: payload.code,
      countryCode: payload.countryCode,
      name: payload.name,
      normalizedName: payload.normalizedName,
      postalCode: payload.postalCode,
      status: isAdmin ? "active" : "pending_review",
      source: isAdmin ? "platform_admin" : "organization_request",
      requestedByOrganizationId: isAdmin ? undefined : organizationId,
      requestedByUserId: isAdmin ? undefined : user.id,
    });

    return { data: created };
  }

  async patchCity(user: AuthUser, cityCode: string, payload: PatchCityDto) {
    this.assertPlatformAdmin(user);

    const existing = await this.catalogRepo.findCityByCode(cityCode);

    if (!existing) {
      throw new NotFoundException("City not found");
    }

    const nextStatus = payload.status ?? existing.status;
    this.assertResourceTransition(existing.status, nextStatus, "city");

    const reviewedAt =
      payload.status && payload.status !== existing.status ? new Date() : undefined;

    const updated = await this.catalogRepo.updateCity(cityCode, {
      countryCode: payload.countryCode,
      name: payload.name,
      normalizedName: payload.normalizedName,
      postalCode: payload.postalCode,
      status: payload.status,
      reviewNote: payload.reviewNote,
      reviewedByUserId: reviewedAt || payload.reviewNote ? user.id : undefined,
      reviewedAt,
    });

    if (!updated) {
      throw new NotFoundException("City not found");
    }

    return { data: updated };
  }

  private resolveListStatus(
    requestedStatus: string | undefined,
    user: AuthUser | undefined,
    allowedStatuses: readonly string[],
  ): string {
    if (!requestedStatus || !this.isPlatformAdmin(user)) {
      return "active";
    }

    if (!allowedStatuses.includes(requestedStatus)) {
      throw new BadRequestException("Invalid status filter");
    }

    return requestedStatus;
  }

  private async assertSpecialtyExists(specialtyId: string): Promise<void> {
    const specialty = await this.catalogRepo.findSpecialtyById(specialtyId);

    if (!specialty) {
      throw new BadRequestException("specialty_id does not exist");
    }
  }

  private assertSpecialtyTransition(fromStatus: string, toStatus: string): void {
    const allowedTransitions: Record<string, string[]> = {
      active: ["archived"],
      archived: ["active"],
    };

    this.assertTransition(fromStatus, toStatus, allowedTransitions, "specialty");
  }

  private assertResourceTransition(fromStatus: string, toStatus: string, resource: string): void {
    const allowedTransitions: Record<string, string[]> = {
      pending_review: ["active", "declined"],
      active: ["archived"],
      declined: ["pending_review"],
      archived: [],
    };

    this.assertTransition(fromStatus, toStatus, allowedTransitions, resource);
  }

  private assertTransition(
    fromStatus: string,
    toStatus: string,
    allowedTransitions: Record<string, string[]>,
    resource: string,
  ): void {
    if (fromStatus === toStatus) {
      return;
    }

    if (!allowedTransitions[fromStatus]?.includes(toStatus)) {
      throw new ConflictException(
        `Invalid ${resource} status transition from ${fromStatus} to ${toStatus}`,
      );
    }
  }

  private assertPlatformAdmin(user: AuthUser): void {
    if (!this.isPlatformAdmin(user)) {
      throw new ForbiddenException("Platform admin role required");
    }
  }

  private isPlatformAdmin(user: AuthUser | undefined): boolean {
    if (!user) {
      return false;
    }

    return user.roles.includes(Role.PlatformAdmin);
  }
}
