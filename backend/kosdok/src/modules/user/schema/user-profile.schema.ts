import { mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core";

import { authUsers } from "../../identity/schema/auth.schema";

export const userProfiles = mysqlTable("user_profiles", {
  userId: varchar("user_id", { length: 36 })
    .primaryKey()
    .references(() => authUsers.id, { onDelete: "cascade" }),
  fullName: varchar("full_name", { length: 120 }).notNull(),
  phone: varchar("phone", { length: 30 }),
  city: varchar("city", { length: 100 }),
  locale: varchar("locale", { length: 10 }).default("sq").notNull(),
  avatarUrl: varchar("avatar_url", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
