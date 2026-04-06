import { mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core";

import { authUsers } from "./auth.schema";

export const authRefreshTokens = mysqlTable("auth_refresh_tokens", {
  id: varchar("id", { length: 36 }).primaryKey(),
  userId: varchar("user_id", { length: 36 })
    .notNull()
    .references(() => authUsers.id, { onDelete: "cascade" }),
  tokenHash: varchar("token_hash", { length: 128 }).notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  revokedAt: timestamp("revoked_at"),
  userAgent: varchar("user_agent", { length: 255 }),
  ipAddress: varchar("ip_address", { length: 64 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
