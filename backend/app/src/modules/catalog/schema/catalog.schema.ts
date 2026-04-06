import { index, mysqlTable, timestamp, uniqueIndex, varchar } from "drizzle-orm/mysql-core";

import { authUsers } from "../../identity/schema/auth.schema";

export const specialties = mysqlTable(
  "specialties",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    code: varchar("code", { length: 100 }).notNull(),
    name: varchar("name", { length: 160 }).notNull(),
    status: varchar("status", { length: 32 }).notNull().default("active"),
    source: varchar("source", { length: 32 }).notNull().default("seed"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("specialties_code_unique").on(table.code),
    index("specialties_status_code_idx").on(table.status, table.code),
  ],
);

export const services = mysqlTable(
  "services",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    code: varchar("code", { length: 120 }).notNull(),
    name: varchar("name", { length: 160 }).notNull(),
    specialtyId: varchar("specialty_id", { length: 36 }).references(() => specialties.id, {
      onDelete: "set null",
    }),
    category: varchar("category", { length: 100 }),
    serviceType: varchar("service_type", { length: 32 }).notNull().default("consultation"),
    status: varchar("status", { length: 32 }).notNull().default("active"),
    source: varchar("source", { length: 32 }).notNull().default("seed"),
    requestedByOrganizationId: varchar("requested_by_organization_id", { length: 36 }),
    requestedByUserId: varchar("requested_by_user_id", { length: 36 }).references(
      () => authUsers.id,
      {
        onDelete: "set null",
      },
    ),
    reviewNote: varchar("review_note", { length: 500 }),
    reviewedByUserId: varchar("reviewed_by_user_id", { length: 36 }).references(
      () => authUsers.id,
      {
        onDelete: "set null",
      },
    ),
    reviewedAt: timestamp("reviewed_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("services_code_unique").on(table.code),
    index("services_specialty_id_idx").on(table.specialtyId),
    index("services_status_service_type_idx").on(table.status, table.serviceType),
    index("services_status_specialty_id_idx").on(table.status, table.specialtyId),
    index("services_status_requested_org_idx").on(table.status, table.requestedByOrganizationId),
  ],
);

export const cities = mysqlTable(
  "cities",
  {
    code: varchar("code", { length: 64 }).primaryKey(),
    countryCode: varchar("country_code", { length: 2 }).notNull(),
    name: varchar("name", { length: 120 }).notNull(),
    normalizedName: varchar("normalized_name", { length: 120 }).notNull(),
    postalCode: varchar("postal_code", { length: 20 }),
    status: varchar("status", { length: 32 }).notNull().default("active"),
    source: varchar("source", { length: 32 }).notNull().default("seed"),
    requestedByOrganizationId: varchar("requested_by_organization_id", { length: 36 }),
    requestedByUserId: varchar("requested_by_user_id", { length: 36 }).references(
      () => authUsers.id,
      {
        onDelete: "set null",
      },
    ),
    reviewNote: varchar("review_note", { length: 500 }),
    reviewedByUserId: varchar("reviewed_by_user_id", { length: 36 }).references(
      () => authUsers.id,
      {
        onDelete: "set null",
      },
    ),
    reviewedAt: timestamp("reviewed_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("cities_country_normalized_name_unique").on(
      table.countryCode,
      table.normalizedName,
    ),
    index("cities_status_country_code_idx").on(table.status, table.countryCode),
    index("cities_status_requested_org_idx").on(table.status, table.requestedByOrganizationId),
  ],
);
