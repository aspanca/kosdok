export const CATALOG_SPECIALTY_STATUSES = ["active", "archived"] as const;
export type CatalogSpecialtyStatus = (typeof CATALOG_SPECIALTY_STATUSES)[number];

export const CATALOG_RESOURCE_STATUSES = [
  "active",
  "pending_review",
  "declined",
  "archived",
] as const;
export type CatalogResourceStatus = (typeof CATALOG_RESOURCE_STATUSES)[number];

export const CATALOG_SPECIALTY_SOURCES = ["seed", "platform_admin"] as const;
export type CatalogSpecialtySource = (typeof CATALOG_SPECIALTY_SOURCES)[number];

export const CATALOG_RESOURCE_SOURCES = ["seed", "platform_admin", "organization_request"] as const;
export type CatalogResourceSource = (typeof CATALOG_RESOURCE_SOURCES)[number];

export const CATALOG_SERVICE_TYPES = [
  "consultation",
  "diagnostic",
  "procedure",
  "pharmacy",
  "emergency",
  "administrative",
] as const;
export type CatalogServiceType = (typeof CATALOG_SERVICE_TYPES)[number];
