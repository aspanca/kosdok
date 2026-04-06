import { randomUUID } from "node:crypto";

import { ConflictException, Inject, Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";

import {
  PermissionKey,
  ROLE_PERMISSIONS,
  Role,
  RoleKey,
} from "../../common/constants/permission.constants";

import { CreateUserDto } from "./dto/create-user.dto";
import { AUTH_REPO } from "./repositories/auth.repo";
import { StoredUser } from "./types/stored-user.type";

import type {
  AuthRepo,
  CreateEmailVerificationTokenInput,
  CreatePasswordResetTokenInput,
  CreateRefreshTokenInput,
  StoredEmailVerificationToken,
  StoredPasswordResetToken,
  StoredRefreshToken,
} from "./repositories/auth.repo";

@Injectable()
export class AuthUsersService {
  constructor(
    @Inject(AUTH_REPO)
    private readonly authRepo: AuthRepo,
  ) {}

  async validateUser(email: string, password: string): Promise<StoredUser | null> {
    const user = await this.findByEmail(email);

    if (!user) {
      return null;
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);
    return passwordMatches ? user : null;
  }

  findByEmail(email: string): Promise<StoredUser | undefined> {
    return this.authRepo.findByEmail(email);
  }

  findById(userId: string): Promise<StoredUser | undefined> {
    return this.authRepo.findById(userId);
  }

  async createUser(input: CreateUserDto): Promise<StoredUser> {
    const normalizedEmail = input.email.trim().toLowerCase();
    const existing = await this.findByEmail(normalizedEmail);

    if (existing) {
      throw new ConflictException("A user with this email already exists");
    }

    const roles = input.roles?.length ? input.roles : [Role.Patient];
    const permissions = this.resolvePermissions(roles, input.permissions ?? []);
    const passwordHash = await bcrypt.hash(input.password, 10);

    return this.authRepo.save({
      id: randomUUID(),
      email: normalizedEmail,
      passwordHash,
      emailVerifiedAt: input.emailVerified ? new Date() : null,
      roles,
      permissions,
    });
  }

  updatePassword(userId: string, passwordHash: string): Promise<void> {
    return this.authRepo.updatePassword(userId, passwordHash);
  }

  markEmailVerified(userId: string): Promise<void> {
    return this.authRepo.markEmailVerified(userId);
  }

  createRefreshToken(input: CreateRefreshTokenInput): Promise<void> {
    return this.authRepo.createRefreshToken(input);
  }

  findValidRefreshToken(tokenHash: string, now: Date): Promise<StoredRefreshToken | undefined> {
    return this.authRepo.findValidRefreshToken(tokenHash, now);
  }

  findRefreshTokenByHash(tokenHash: string): Promise<StoredRefreshToken | undefined> {
    return this.authRepo.findRefreshTokenByHash(tokenHash);
  }

  revokeRefreshToken(tokenId: string): Promise<void> {
    return this.authRepo.revokeRefreshToken(tokenId);
  }

  revokeRefreshTokenByHash(tokenHash: string): Promise<void> {
    return this.authRepo.revokeRefreshTokenByHash(tokenHash);
  }

  revokeAllRefreshTokensForUser(userId: string): Promise<void> {
    return this.authRepo.revokeAllRefreshTokensForUser(userId);
  }

  createEmailVerificationToken(input: CreateEmailVerificationTokenInput): Promise<void> {
    return this.authRepo.createEmailVerificationToken(input);
  }

  invalidateEmailVerificationTokensForUser(userId: string): Promise<void> {
    return this.authRepo.invalidateEmailVerificationTokensForUser(userId);
  }

  consumeEmailVerificationToken(
    tokenHash: string,
    now: Date,
  ): Promise<StoredEmailVerificationToken | undefined> {
    return this.authRepo.consumeEmailVerificationToken(tokenHash, now);
  }

  createPasswordResetToken(input: CreatePasswordResetTokenInput): Promise<void> {
    return this.authRepo.createPasswordResetToken(input);
  }

  invalidatePasswordResetTokensForUser(userId: string): Promise<void> {
    return this.authRepo.invalidatePasswordResetTokensForUser(userId);
  }

  consumePasswordResetToken(
    tokenHash: string,
    now: Date,
  ): Promise<StoredPasswordResetToken | undefined> {
    return this.authRepo.consumePasswordResetToken(tokenHash, now);
  }

  private resolvePermissions(
    roles: RoleKey[],
    extraPermissions: PermissionKey[] = [],
  ): PermissionKey[] {
    const rolePermissions = roles.flatMap((role) => ROLE_PERMISSIONS[role] ?? []);
    return [...new Set([...rolePermissions, ...extraPermissions])];
  }
}
