import { randomUUID } from "node:crypto";

import { Injectable } from "@nestjs/common";
import { and, eq, gt, isNull } from "drizzle-orm";

import { DatabaseService } from "../../../database/database.service";
import { authEmailVerificationTokens } from "../schema/auth-email-verification-token.schema";
import { authPasswordResetTokens } from "../schema/auth-password-reset-token.schema";
import { authRefreshTokens } from "../schema/auth-refresh-token.schema";
import { authUsers } from "../schema/auth.schema";

import type {
  AuthRepo,
  CreateEmailVerificationTokenInput,
  CreatePasswordResetTokenInput,
  CreateRefreshTokenInput,
  StoredEmailVerificationToken,
  StoredPasswordResetToken,
  StoredRefreshToken,
} from "./auth.repo";
import type { StoredUser } from "../types/stored-user.type";

@Injectable()
export class AuthRepository implements AuthRepo {
  private readonly db;

  constructor(databaseService: DatabaseService) {
    this.db = databaseService.connection;
  }

  async findByEmail(email: string): Promise<StoredUser | undefined> {
    const rows = await this.db
      .select()
      .from(authUsers)
      .where(eq(authUsers.email, email.trim().toLowerCase()))
      .limit(1);

    return rows[0] ? this.toDomain(rows[0]) : undefined;
  }

  async findById(userId: string): Promise<StoredUser | undefined> {
    const rows = await this.db.select().from(authUsers).where(eq(authUsers.id, userId)).limit(1);

    return rows[0] ? this.toDomain(rows[0]) : undefined;
  }

  async save(user: StoredUser): Promise<StoredUser> {
    await this.db
      .insert(authUsers)
      .values({
        id: user.id,
        email: user.email,
        passwordHash: user.passwordHash,
        emailVerifiedAt: user.emailVerifiedAt,
        roles: user.roles,
        permissions: user.permissions,
      })
      .onDuplicateKeyUpdate({
        set: {
          email: user.email,
          passwordHash: user.passwordHash,
          emailVerifiedAt: user.emailVerifiedAt,
          roles: user.roles,
          permissions: user.permissions,
          updatedAt: new Date(),
        },
      });

    const persisted = await this.findById(user.id);

    if (!persisted) {
      throw new Error("Failed to persist auth user");
    }

    return persisted;
  }

  async updatePassword(userId: string, passwordHash: string): Promise<void> {
    await this.db
      .update(authUsers)
      .set({
        passwordHash,
        updatedAt: new Date(),
      })
      .where(eq(authUsers.id, userId));
  }

  async markEmailVerified(userId: string): Promise<void> {
    await this.db
      .update(authUsers)
      .set({
        emailVerifiedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(authUsers.id, userId));
  }

  async createRefreshToken(input: CreateRefreshTokenInput): Promise<void> {
    await this.db.insert(authRefreshTokens).values({
      id: randomUUID(),
      userId: input.userId,
      tokenHash: input.tokenHash,
      expiresAt: input.expiresAt,
      userAgent: input.userAgent,
      ipAddress: input.ipAddress,
    });
  }

  async findValidRefreshToken(
    tokenHash: string,
    now: Date,
  ): Promise<StoredRefreshToken | undefined> {
    const rows = await this.db
      .select()
      .from(authRefreshTokens)
      .where(
        and(
          eq(authRefreshTokens.tokenHash, tokenHash),
          isNull(authRefreshTokens.revokedAt),
          gt(authRefreshTokens.expiresAt, now),
        ),
      )
      .limit(1);

    return rows[0] ? this.toStoredRefreshToken(rows[0]) : undefined;
  }

  async findRefreshTokenByHash(tokenHash: string): Promise<StoredRefreshToken | undefined> {
    const rows = await this.db
      .select()
      .from(authRefreshTokens)
      .where(eq(authRefreshTokens.tokenHash, tokenHash))
      .limit(1);

    return rows[0] ? this.toStoredRefreshToken(rows[0]) : undefined;
  }

  async revokeRefreshToken(tokenId: string): Promise<void> {
    await this.db
      .update(authRefreshTokens)
      .set({
        revokedAt: new Date(),
      })
      .where(eq(authRefreshTokens.id, tokenId));
  }

  async revokeRefreshTokenByHash(tokenHash: string): Promise<void> {
    await this.db
      .update(authRefreshTokens)
      .set({
        revokedAt: new Date(),
      })
      .where(eq(authRefreshTokens.tokenHash, tokenHash));
  }

  async revokeAllRefreshTokensForUser(userId: string): Promise<void> {
    await this.db
      .update(authRefreshTokens)
      .set({
        revokedAt: new Date(),
      })
      .where(and(eq(authRefreshTokens.userId, userId), isNull(authRefreshTokens.revokedAt)));
  }

  async createEmailVerificationToken(input: CreateEmailVerificationTokenInput): Promise<void> {
    await this.db.insert(authEmailVerificationTokens).values({
      id: randomUUID(),
      userId: input.userId,
      tokenHash: input.tokenHash,
      expiresAt: input.expiresAt,
    });
  }

  async invalidateEmailVerificationTokensForUser(userId: string): Promise<void> {
    await this.db
      .update(authEmailVerificationTokens)
      .set({
        usedAt: new Date(),
      })
      .where(
        and(
          eq(authEmailVerificationTokens.userId, userId),
          isNull(authEmailVerificationTokens.usedAt),
        ),
      );
  }

  async consumeEmailVerificationToken(
    tokenHash: string,
    now: Date,
  ): Promise<StoredEmailVerificationToken | undefined> {
    const rows = await this.db
      .select()
      .from(authEmailVerificationTokens)
      .where(
        and(
          eq(authEmailVerificationTokens.tokenHash, tokenHash),
          isNull(authEmailVerificationTokens.usedAt),
          gt(authEmailVerificationTokens.expiresAt, now),
        ),
      )
      .limit(1);

    const token = rows[0];

    if (!token) {
      return undefined;
    }

    await this.db
      .update(authEmailVerificationTokens)
      .set({
        usedAt: new Date(),
      })
      .where(eq(authEmailVerificationTokens.id, token.id));

    return this.toStoredEmailVerificationToken(token);
  }

  async createPasswordResetToken(input: CreatePasswordResetTokenInput): Promise<void> {
    await this.db.insert(authPasswordResetTokens).values({
      id: randomUUID(),
      userId: input.userId,
      tokenHash: input.tokenHash,
      expiresAt: input.expiresAt,
    });
  }

  async invalidatePasswordResetTokensForUser(userId: string): Promise<void> {
    await this.db
      .update(authPasswordResetTokens)
      .set({
        usedAt: new Date(),
      })
      .where(
        and(eq(authPasswordResetTokens.userId, userId), isNull(authPasswordResetTokens.usedAt)),
      );
  }

  async consumePasswordResetToken(
    tokenHash: string,
    now: Date,
  ): Promise<StoredPasswordResetToken | undefined> {
    const rows = await this.db
      .select()
      .from(authPasswordResetTokens)
      .where(
        and(
          eq(authPasswordResetTokens.tokenHash, tokenHash),
          isNull(authPasswordResetTokens.usedAt),
          gt(authPasswordResetTokens.expiresAt, now),
        ),
      )
      .limit(1);

    const token = rows[0];

    if (!token) {
      return undefined;
    }

    await this.db
      .update(authPasswordResetTokens)
      .set({
        usedAt: new Date(),
      })
      .where(eq(authPasswordResetTokens.id, token.id));

    return this.toStoredPasswordResetToken(token);
  }

  private toDomain(row: typeof authUsers.$inferSelect): StoredUser {
    return {
      id: row.id,
      email: row.email,
      passwordHash: row.passwordHash,
      emailVerifiedAt: row.emailVerifiedAt,
      roles: row.roles,
      permissions: row.permissions,
    };
  }

  private toStoredRefreshToken(row: typeof authRefreshTokens.$inferSelect): StoredRefreshToken {
    return {
      id: row.id,
      userId: row.userId,
      tokenHash: row.tokenHash,
      expiresAt: row.expiresAt,
      revokedAt: row.revokedAt,
    };
  }

  private toStoredEmailVerificationToken(
    row: typeof authEmailVerificationTokens.$inferSelect,
  ): StoredEmailVerificationToken {
    return {
      id: row.id,
      userId: row.userId,
      tokenHash: row.tokenHash,
      expiresAt: row.expiresAt,
      usedAt: row.usedAt,
    };
  }

  private toStoredPasswordResetToken(
    row: typeof authPasswordResetTokens.$inferSelect,
  ): StoredPasswordResetToken {
    return {
      id: row.id,
      userId: row.userId,
      tokenHash: row.tokenHash,
      expiresAt: row.expiresAt,
      usedAt: row.usedAt,
    };
  }
}
