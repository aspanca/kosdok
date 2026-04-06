import { mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core";

import { authUsers } from "./auth.schema";

export const authPasswordResetTokens = mysqlTable("auth_password_reset_tokens", {
  id: varchar("id", { length: 36 }).primaryKey(),
  userId: varchar("user_id", { length: 36 })
    .notNull()
    .references(() => authUsers.id, { onDelete: "cascade" }),
  tokenHash: varchar("token_hash", { length: 128 }).notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  usedAt: timestamp("used_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
