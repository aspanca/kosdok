import type { StoredUser } from "../types/stored-user.type";

export const AUTH_REPO = Symbol("AUTH_REPO");

export interface CreateRefreshTokenInput {
  userId: string;
  tokenHash: string;
  expiresAt: Date;
  userAgent?: string;
  ipAddress?: string;
}

export interface StoredRefreshToken {
  id: string;
  userId: string;
  tokenHash: string;
  expiresAt: Date;
  revokedAt: Date | null;
}

export interface CreateEmailVerificationTokenInput {
  userId: string;
  tokenHash: string;
  expiresAt: Date;
}

export interface StoredEmailVerificationToken {
  id: string;
  userId: string;
  tokenHash: string;
  expiresAt: Date;
  usedAt: Date | null;
}

export interface CreatePasswordResetTokenInput {
  userId: string;
  tokenHash: string;
  expiresAt: Date;
}

export interface StoredPasswordResetToken {
  id: string;
  userId: string;
  tokenHash: string;
  expiresAt: Date;
  usedAt: Date | null;
}

export interface AuthRepo {
  findByEmail(email: string): Promise<StoredUser | undefined>;
  findById(userId: string): Promise<StoredUser | undefined>;
  save(user: StoredUser): Promise<StoredUser>;
  updatePassword(userId: string, passwordHash: string): Promise<void>;
  markEmailVerified(userId: string): Promise<void>;
  createRefreshToken(input: CreateRefreshTokenInput): Promise<void>;
  findValidRefreshToken(tokenHash: string, now: Date): Promise<StoredRefreshToken | undefined>;
  findRefreshTokenByHash(tokenHash: string): Promise<StoredRefreshToken | undefined>;
  revokeRefreshToken(tokenId: string): Promise<void>;
  revokeRefreshTokenByHash(tokenHash: string): Promise<void>;
  revokeAllRefreshTokensForUser(userId: string): Promise<void>;
  createEmailVerificationToken(input: CreateEmailVerificationTokenInput): Promise<void>;
  invalidateEmailVerificationTokensForUser(userId: string): Promise<void>;
  consumeEmailVerificationToken(
    tokenHash: string,
    now: Date,
  ): Promise<StoredEmailVerificationToken | undefined>;
  createPasswordResetToken(input: CreatePasswordResetTokenInput): Promise<void>;
  invalidatePasswordResetTokensForUser(userId: string): Promise<void>;
  consumePasswordResetToken(
    tokenHash: string,
    now: Date,
  ): Promise<StoredPasswordResetToken | undefined>;
}
