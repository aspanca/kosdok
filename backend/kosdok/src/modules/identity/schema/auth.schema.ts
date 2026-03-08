import { json, mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core";

import { PermissionKey, RoleKey } from "../../../common/constants/permission.constants";

export const authUsers = mysqlTable("auth_users", {
  id: varchar("id", { length: 36 }).primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  emailVerifiedAt: timestamp("email_verified_at"),
  roles: json("roles").$type<RoleKey[]>().notNull(),
  permissions: json("permissions").$type<PermissionKey[]>().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
