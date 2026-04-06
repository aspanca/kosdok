import {
  boolean,
  decimal,
  index,
  json,
  mysqlTable,
  primaryKey,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";

import { cities, services } from "../../catalog/schema/catalog.schema";
import { authUsers } from "../../identity/schema/auth.schema";

export { cities, services, specialties } from "../../catalog/schema/catalog.schema";

export const organizations = mysqlTable(
  "organizations",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    name: varchar("name", { length: 160 }).notNull(),
    slug: varchar("slug", { length: 160 }).notNull(),
    legalName: varchar("legal_name", { length: 255 }),
    status: varchar("status", { length: 32 }).notNull().default("active"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [uniqueIndex("organizations_slug_unique").on(table.slug)],
);

export const organizationTypes = mysqlTable("organization_types", {
  code: varchar("code", { length: 64 }).primaryKey(),
  label: varchar("label", { length: 120 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const capabilities = mysqlTable("capabilities", {
  key: varchar("key", { length: 120 }).primaryKey(),
  category: varchar("category", { length: 64 }).notNull(),
  description: varchar("description", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const organizationTypeLinks = mysqlTable(
  "organization_type_links",
  {
    organizationId: varchar("organization_id", { length: 36 })
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    typeCode: varchar("type_code", { length: 64 })
      .notNull()
      .references(() => organizationTypes.code, { onDelete: "restrict" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.organizationId, table.typeCode] }),
    index("organization_type_links_type_org_idx").on(table.typeCode, table.organizationId),
  ],
);

export const organizationSites = mysqlTable(
  "organization_sites",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    organizationId: varchar("organization_id", { length: 36 })
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    cityCode: varchar("city_code", { length: 64 })
      .notNull()
      .references(() => cities.code, { onDelete: "restrict" }),
    label: varchar("label", { length: 160 }).notNull(),
    addressLine1: varchar("address_line1", { length: 255 }),
    postalCode: varchar("postal_code", { length: 20 }),
    latitude: decimal("latitude", { precision: 10, scale: 7 }),
    longitude: decimal("longitude", { precision: 10, scale: 7 }),
    timezone: varchar("timezone", { length: 64 }).notNull().default("UTC"),
    status: varchar("status", { length: 32 }).notNull().default("active"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("organization_sites_city_status_org_idx").on(
      table.cityCode,
      table.status,
      table.organizationId,
    ),
    index("organization_sites_coordinates_idx").on(table.latitude, table.longitude),
  ],
);

export const organizationTypeCapabilityDefaults = mysqlTable(
  "organization_type_capability_defaults",
  {
    typeCode: varchar("type_code", { length: 64 })
      .notNull()
      .references(() => organizationTypes.code, { onDelete: "cascade" }),
    capabilityKey: varchar("capability_key", { length: 120 })
      .notNull()
      .references(() => capabilities.key, { onDelete: "cascade" }),
    enabledDefault: boolean("enabled_default").notNull().default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.typeCode, table.capabilityKey] }),
    index("organization_type_capability_defaults_cap_type_idx").on(
      table.capabilityKey,
      table.typeCode,
    ),
  ],
);

export const organizationCapabilities = mysqlTable(
  "organization_capabilities",
  {
    organizationId: varchar("organization_id", { length: 36 })
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    capabilityKey: varchar("capability_key", { length: 120 })
      .notNull()
      .references(() => capabilities.key, { onDelete: "cascade" }),
    enabled: boolean("enabled").notNull(),
    configJson: json("config_json").$type<Record<string, unknown> | null>(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [primaryKey({ columns: [table.organizationId, table.capabilityKey] })],
);

export const serviceCapabilityRequirements = mysqlTable(
  "service_capability_requirements",
  {
    serviceId: varchar("service_id", { length: 36 })
      .notNull()
      .references(() => services.id, { onDelete: "cascade" }),
    capabilityKey: varchar("capability_key", { length: 120 })
      .notNull()
      .references(() => capabilities.key, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [primaryKey({ columns: [table.serviceId, table.capabilityKey] })],
);

export const organizationServices = mysqlTable(
  "organization_services",
  {
    organizationId: varchar("organization_id", { length: 36 })
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    serviceId: varchar("service_id", { length: 36 })
      .notNull()
      .references(() => services.id, { onDelete: "cascade" }),
    enabled: boolean("enabled").notNull().default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.organizationId, table.serviceId] }),
    index("organization_services_service_org_enabled_idx").on(
      table.serviceId,
      table.organizationId,
      table.enabled,
    ),
  ],
);

export const organizationStaff = mysqlTable(
  "organization_staff",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    organizationId: varchar("organization_id", { length: 36 })
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    siteId: varchar("site_id", { length: 36 }).references(() => organizationSites.id, {
      onDelete: "set null",
    }),
    userId: varchar("user_id", { length: 36 })
      .notNull()
      .references(() => authUsers.id, { onDelete: "cascade" }),
    role: varchar("role", { length: 64 }).notNull(),
    status: varchar("status", { length: 32 }).notNull().default("active"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("organization_staff_org_user_idx").on(table.organizationId, table.userId),
    index("organization_staff_org_site_user_idx").on(
      table.organizationId,
      table.siteId,
      table.userId,
    ),
  ],
);

export const organizationServiceAreas = mysqlTable(
  "organization_service_areas",
  {
    organizationId: varchar("organization_id", { length: 36 })
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    cityCode: varchar("city_code", { length: 64 })
      .notNull()
      .references(() => cities.code, { onDelete: "cascade" }),
    coverageType: varchar("coverage_type", { length: 64 }).notNull().default("city"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [primaryKey({ columns: [table.organizationId, table.cityCode] })],
);
