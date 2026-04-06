export const CATALOG_REPO = Symbol("CATALOG_REPO");

export interface CursorPaginationInput {
  cursor?: string;
  limit: number;
  q?: string;
  status?: string;
}

export interface ListSpecialtiesInput extends CursorPaginationInput {}

export interface ListServicesInput extends CursorPaginationInput {
  specialtyId?: string;
  serviceType?: string;
}

export interface ListCitiesInput extends CursorPaginationInput {}

export interface CreateSpecialtyInput {
  id: string;
  code: string;
  name: string;
  status: string;
  source: string;
}

export interface UpdateSpecialtyInput {
  code?: string;
  name?: string;
  status?: string;
}

export interface CreateServiceInput {
  id: string;
  code: string;
  name: string;
  specialtyId?: string;
  serviceType: string;
  status: string;
  source: string;
  requestedByOrganizationId?: string;
  requestedByUserId?: string;
}

export interface UpdateServiceInput {
  code?: string;
  name?: string;
  specialtyId?: string;
  serviceType?: string;
  status?: string;
  reviewNote?: string;
  reviewedByUserId?: string;
  reviewedAt?: Date;
}

export interface CreateCityInput {
  code: string;
  countryCode: string;
  name: string;
  normalizedName: string;
  postalCode?: string;
  status: string;
  source: string;
  requestedByOrganizationId?: string;
  requestedByUserId?: string;
}

export interface UpdateCityInput {
  countryCode?: string;
  name?: string;
  normalizedName?: string;
  postalCode?: string;
  status?: string;
  reviewNote?: string;
  reviewedByUserId?: string;
  reviewedAt?: Date;
}

export interface CatalogSpecialtyRecord {
  id: string;
  code: string;
  name: string;
  status: string;
  source: string;
}

export interface CatalogServiceRecord {
  id: string;
  code: string;
  name: string;
  specialtyId: string | null;
  serviceType: string;
  status: string;
  source: string;
}

export interface CatalogCityRecord {
  code: string;
  countryCode: string;
  name: string;
  normalizedName: string;
  postalCode: string | null;
  status: string;
  source: string;
}

export interface CursorPage<T> {
  items: T[];
  nextCursor: string | null;
}

export interface CatalogRepo {
  listSpecialties(input: ListSpecialtiesInput): Promise<CursorPage<CatalogSpecialtyRecord>>;
  listServices(input: ListServicesInput): Promise<CursorPage<CatalogServiceRecord>>;
  listCities(input: ListCitiesInput): Promise<CursorPage<CatalogCityRecord>>;
  findSpecialtyById(specialtyId: string): Promise<CatalogSpecialtyRecord | undefined>;
  createSpecialty(input: CreateSpecialtyInput): Promise<CatalogSpecialtyRecord>;
  updateSpecialty(
    specialtyId: string,
    input: UpdateSpecialtyInput,
  ): Promise<CatalogSpecialtyRecord | undefined>;
  findServiceById(serviceId: string): Promise<CatalogServiceRecord | undefined>;
  createService(input: CreateServiceInput): Promise<CatalogServiceRecord>;
  updateService(
    serviceId: string,
    input: UpdateServiceInput,
  ): Promise<CatalogServiceRecord | undefined>;
  findCityByCode(cityCode: string): Promise<CatalogCityRecord | undefined>;
  createCity(input: CreateCityInput): Promise<CatalogCityRecord>;
  updateCity(cityCode: string, input: UpdateCityInput): Promise<CatalogCityRecord | undefined>;
}
