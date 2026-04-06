import { Injectable } from "@nestjs/common";
import { and, asc, eq, gt, like, or } from "drizzle-orm";

import { DatabaseService } from "../../../database/database.service";
import { cities, services, specialties } from "../schema/catalog.schema";

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
} from "./catalog.repo";

@Injectable()
export class CatalogRepository implements CatalogRepo {
  private readonly db;

  constructor(databaseService: DatabaseService) {
    this.db = databaseService.connection;
  }

  async listSpecialties(input: ListSpecialtiesInput): Promise<CursorPage<CatalogSpecialtyRecord>> {
    const conditions = [eq(specialties.status, input.status ?? "active")];

    if (input.cursor) {
      conditions.push(gt(specialties.code, input.cursor));
    }

    const searchPattern = this.toSearchPattern(input.q);

    if (searchPattern) {
      const searchCondition = or(
        like(specialties.name, searchPattern),
        like(specialties.code, searchPattern),
      );

      if (searchCondition) {
        conditions.push(searchCondition);
      }
    }

    const rows = await this.db
      .select({
        id: specialties.id,
        code: specialties.code,
        name: specialties.name,
        status: specialties.status,
        source: specialties.source,
      })
      .from(specialties)
      .where(and(...conditions))
      .orderBy(asc(specialties.code))
      .limit(input.limit + 1);

    return this.toCursorPage(rows, input.limit);
  }

  async listServices(input: ListServicesInput): Promise<CursorPage<CatalogServiceRecord>> {
    const conditions = [eq(services.status, input.status ?? "active")];

    if (input.cursor) {
      conditions.push(gt(services.code, input.cursor));
    }

    if (input.specialtyId) {
      conditions.push(eq(services.specialtyId, input.specialtyId));
    }

    if (input.serviceType) {
      conditions.push(eq(services.serviceType, input.serviceType));
    }

    const searchPattern = this.toSearchPattern(input.q);

    if (searchPattern) {
      const searchCondition = or(
        like(services.name, searchPattern),
        like(services.code, searchPattern),
      );

      if (searchCondition) {
        conditions.push(searchCondition);
      }
    }

    const rows = await this.db
      .select({
        id: services.id,
        code: services.code,
        name: services.name,
        specialtyId: services.specialtyId,
        serviceType: services.serviceType,
        status: services.status,
        source: services.source,
      })
      .from(services)
      .where(and(...conditions))
      .orderBy(asc(services.code))
      .limit(input.limit + 1);

    return this.toCursorPage(rows, input.limit);
  }

  async listCities(input: ListCitiesInput): Promise<CursorPage<CatalogCityRecord>> {
    const conditions = [eq(cities.status, input.status ?? "active")];

    if (input.cursor) {
      conditions.push(gt(cities.code, input.cursor));
    }

    const searchPattern = this.toSearchPattern(input.q);

    if (searchPattern) {
      const searchCondition = or(
        like(cities.name, searchPattern),
        like(cities.normalizedName, searchPattern),
        like(cities.code, searchPattern),
      );

      if (searchCondition) {
        conditions.push(searchCondition);
      }
    }

    const rows = await this.db
      .select({
        code: cities.code,
        countryCode: cities.countryCode,
        name: cities.name,
        normalizedName: cities.normalizedName,
        postalCode: cities.postalCode,
        status: cities.status,
        source: cities.source,
      })
      .from(cities)
      .where(and(...conditions))
      .orderBy(asc(cities.code))
      .limit(input.limit + 1);

    return this.toCursorPage(rows, input.limit);
  }

  async findSpecialtyById(specialtyId: string): Promise<CatalogSpecialtyRecord | undefined> {
    const rows = await this.db
      .select({
        id: specialties.id,
        code: specialties.code,
        name: specialties.name,
        status: specialties.status,
        source: specialties.source,
      })
      .from(specialties)
      .where(eq(specialties.id, specialtyId))
      .limit(1);

    return rows[0];
  }

  async createSpecialty(input: CreateSpecialtyInput): Promise<CatalogSpecialtyRecord> {
    await this.db.insert(specialties).values(input);

    const created = await this.findSpecialtyById(input.id);

    if (!created) {
      throw new Error("Failed to create specialty");
    }

    return created;
  }

  async updateSpecialty(
    specialtyId: string,
    input: UpdateSpecialtyInput,
  ): Promise<CatalogSpecialtyRecord | undefined> {
    await this.db
      .update(specialties)
      .set({
        ...input,
        updatedAt: new Date(),
      })
      .where(eq(specialties.id, specialtyId));

    return this.findSpecialtyById(specialtyId);
  }

  async findServiceById(serviceId: string): Promise<CatalogServiceRecord | undefined> {
    const rows = await this.db
      .select({
        id: services.id,
        code: services.code,
        name: services.name,
        specialtyId: services.specialtyId,
        serviceType: services.serviceType,
        status: services.status,
        source: services.source,
      })
      .from(services)
      .where(eq(services.id, serviceId))
      .limit(1);

    return rows[0];
  }

  async createService(input: CreateServiceInput): Promise<CatalogServiceRecord> {
    await this.db.insert(services).values({
      id: input.id,
      code: input.code,
      name: input.name,
      specialtyId: input.specialtyId,
      category: input.serviceType,
      serviceType: input.serviceType,
      status: input.status,
      source: input.source,
      requestedByOrganizationId: input.requestedByOrganizationId,
      requestedByUserId: input.requestedByUserId,
    });

    const created = await this.findServiceById(input.id);

    if (!created) {
      throw new Error("Failed to create service");
    }

    return created;
  }

  async updateService(
    serviceId: string,
    input: UpdateServiceInput,
  ): Promise<CatalogServiceRecord | undefined> {
    await this.db
      .update(services)
      .set({
        code: input.code,
        name: input.name,
        specialtyId: input.specialtyId,
        category: input.serviceType,
        serviceType: input.serviceType,
        status: input.status,
        reviewNote: input.reviewNote,
        reviewedByUserId: input.reviewedByUserId,
        reviewedAt: input.reviewedAt,
        updatedAt: new Date(),
      })
      .where(eq(services.id, serviceId));

    return this.findServiceById(serviceId);
  }

  async findCityByCode(cityCode: string): Promise<CatalogCityRecord | undefined> {
    const rows = await this.db
      .select({
        code: cities.code,
        countryCode: cities.countryCode,
        name: cities.name,
        normalizedName: cities.normalizedName,
        postalCode: cities.postalCode,
        status: cities.status,
        source: cities.source,
      })
      .from(cities)
      .where(eq(cities.code, cityCode))
      .limit(1);

    return rows[0];
  }

  async createCity(input: CreateCityInput): Promise<CatalogCityRecord> {
    await this.db.insert(cities).values({
      code: input.code,
      countryCode: input.countryCode,
      name: input.name,
      normalizedName: input.normalizedName,
      postalCode: input.postalCode,
      status: input.status,
      source: input.source,
      requestedByOrganizationId: input.requestedByOrganizationId,
      requestedByUserId: input.requestedByUserId,
    });

    const created = await this.findCityByCode(input.code);

    if (!created) {
      throw new Error("Failed to create city");
    }

    return created;
  }

  async updateCity(
    cityCode: string,
    input: UpdateCityInput,
  ): Promise<CatalogCityRecord | undefined> {
    await this.db
      .update(cities)
      .set({
        countryCode: input.countryCode,
        name: input.name,
        normalizedName: input.normalizedName,
        postalCode: input.postalCode,
        status: input.status,
        reviewNote: input.reviewNote,
        reviewedByUserId: input.reviewedByUserId,
        reviewedAt: input.reviewedAt,
        updatedAt: new Date(),
      })
      .where(eq(cities.code, cityCode));

    return this.findCityByCode(cityCode);
  }

  private toSearchPattern(query: string | undefined): string | undefined {
    const trimmed = query?.trim();

    if (!trimmed) {
      return undefined;
    }

    return `%${trimmed}%`;
  }

  private toCursorPage<T extends { code: string }>(rows: T[], limit: number): CursorPage<T> {
    const hasMore = rows.length > limit;
    const items = hasMore ? rows.slice(0, limit) : rows;

    if (!hasMore || items.length === 0) {
      return {
        items,
        nextCursor: null,
      };
    }

    return {
      items,
      nextCursor: items[items.length - 1].code,
    };
  }
}
