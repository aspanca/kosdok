import { createHash, randomBytes } from "node:crypto";

import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";

import { Role } from "../../common/constants/permission.constants";
import { MailService } from "../mail/mail.service";
import { UserService } from "../user/user.service";

import { AuthUsersService } from "./auth-users.service";
import { ChangePasswordDto } from "./dto/change-password.dto";
import { ForgotPasswordDto } from "./dto/forgot-password.dto";
import { RefreshTokenDto } from "./dto/refresh-token.dto";
import { ResendVerificationDto } from "./dto/resend-verification.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { SignInDto } from "./dto/sign-in.dto";
import { SignUpDto } from "./dto/sign-up.dto";
import { AuthRateLimitService } from "./security/auth-rate-limit.service";

import type { JwtPayload } from "./types/jwt-payload.type";
import type { StoredUser } from "./types/stored-user.type";
import type { AuthUser } from "../../common/types/auth-user.type";
import type { SignOptions } from "jsonwebtoken";

type AuthContext = {
  userAgent?: string;
  ipAddress?: string;
};

type AuthResponse = {
  data: {
    accessToken: string;
    refreshToken: string;
    tokenType: "Bearer";
    expiresIn: string;
    refreshExpiresIn: string;
    user: AuthUser;
  };
};

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly authUsersService: AuthUsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
    private readonly userService: UserService,
    private readonly authRateLimitService: AuthRateLimitService,
  ) {}

  async signUp(
    payload: SignUpDto,
  ): Promise<{ data: { accepted: boolean; email: string; message: string } }> {
    const user = await this.authUsersService.createUser({
      email: payload.email,
      password: payload.password,
      roles: [Role.Patient],
    });

    await this.userService.createProfile({
      userId: user.id,
      fullName: payload.fullName,
    });

    const rawToken = randomBytes(32).toString("hex");
    const tokenHash = this.hashToken(rawToken);
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const verifyUrl = this.buildVerifyUrl(rawToken);

    await this.authUsersService.createEmailVerificationToken({
      userId: user.id,
      tokenHash,
      expiresAt,
    });

    await this.mailService.sendTemplate({
      to: user.email,
      subject: "Verify your Kosdok account",
      template:
        '<p>Hello {{fullName}}, please verify your email: <a href="{{verifyUrl}}">Verify account</a></p>',
      variables: {
        fullName: payload.fullName,
        verifyUrl,
      },
    });

    return {
      data: {
        accepted: true,
        email: user.email,
        message: "Registration completed. Please verify your email before sign-in.",
      },
    };
  }

  async verifyEmail(token: string, context: AuthContext): Promise<AuthResponse> {
    const tokenHash = this.hashToken(token);
    const tokenRecord = await this.authUsersService.consumeEmailVerificationToken(
      tokenHash,
      new Date(),
    );

    if (!tokenRecord) {
      throw new BadRequestException("Invalid or expired verification token");
    }

    await this.authUsersService.markEmailVerified(tokenRecord.userId);
    const user = await this.authUsersService.findById(tokenRecord.userId);

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return this.buildAuthResponse(user, context);
  }

  async signIn(payload: SignInDto, context: AuthContext): Promise<AuthResponse> {
    const signInRateKey = this.buildEmailRateKey(context.ipAddress, payload.email);
    this.authRateLimitService.assertAllowed("sign_in", signInRateKey);

    const user = await this.authUsersService.validateUser(payload.email, payload.password);

    if (!user) {
      this.authRateLimitService.recordFailure("sign_in", signInRateKey);
      throw new UnauthorizedException("Invalid email or password");
    }

    if (!user.emailVerifiedAt) {
      this.authRateLimitService.recordFailure("sign_in", signInRateKey);
      throw new UnauthorizedException("Please verify your email before signing in");
    }

    this.authRateLimitService.recordSuccess("sign_in", signInRateKey);

    return this.buildAuthResponse(user, context);
  }

  async refresh(payload: RefreshTokenDto, context: AuthContext): Promise<AuthResponse> {
    const refreshRateKey = this.buildIpRateKey(context.ipAddress);
    this.authRateLimitService.assertAllowed("refresh", refreshRateKey);

    const refreshSecret = this.configService.getOrThrow<string>("JWT_REFRESH_SECRET");
    let jwtPayload: JwtPayload;

    try {
      jwtPayload = this.jwtService.verify<JwtPayload>(payload.refreshToken, {
        secret: refreshSecret,
      });
    } catch {
      this.authRateLimitService.recordFailure("refresh", refreshRateKey);
      throw new UnauthorizedException("Invalid or expired refresh token");
    }

    if (jwtPayload.tokenType !== "refresh") {
      this.authRateLimitService.recordFailure("refresh", refreshRateKey);
      throw new UnauthorizedException("Invalid refresh token type");
    }

    const tokenHash = this.hashToken(payload.refreshToken);
    const storedToken = await this.authUsersService.findValidRefreshToken(tokenHash, new Date());

    if (!storedToken || storedToken.userId !== jwtPayload.sub) {
      this.authRateLimitService.recordFailure("refresh", refreshRateKey);
      throw new UnauthorizedException("Refresh token has been revoked");
    }

    const user = await this.authUsersService.findById(jwtPayload.sub);

    if (!user) {
      this.authRateLimitService.recordFailure("refresh", refreshRateKey);
      throw new UnauthorizedException("User not found");
    }

    await this.authUsersService.revokeRefreshToken(storedToken.id);
    this.authRateLimitService.recordSuccess("refresh", refreshRateKey);
    return this.buildAuthResponse(user, context);
  }

  async logout(payload: RefreshTokenDto): Promise<{ data: { loggedOut: boolean } }> {
    const refreshSecret = this.configService.getOrThrow<string>("JWT_REFRESH_SECRET");

    try {
      const jwtPayload = this.jwtService.verify<JwtPayload>(payload.refreshToken, {
        secret: refreshSecret,
      });

      if (jwtPayload.tokenType !== "refresh") {
        return {
          data: {
            loggedOut: true,
          },
        };
      }

      await this.authUsersService.revokeRefreshTokenByHash(this.hashToken(payload.refreshToken));
    } catch {
      return {
        data: {
          loggedOut: true,
        },
      };
    }

    return {
      data: {
        loggedOut: true,
      },
    };
  }

  async resendVerification(
    payload: ResendVerificationDto,
    context: AuthContext,
  ): Promise<{ data: { accepted: boolean } }> {
    const rateKey = this.buildEmailRateKey(context.ipAddress, payload.email);
    this.authRateLimitService.assertAllowed("resend_verification", rateKey);

    const user = await this.authUsersService.findByEmail(payload.email);

    if (!user || user.emailVerifiedAt) {
      this.authRateLimitService.recordSuccess("resend_verification", rateKey);
      return {
        data: {
          accepted: true,
        },
      };
    }

    const profile = await this.userService.findProfile(user.id);
    const rawToken = randomBytes(32).toString("hex");
    const tokenHash = this.hashToken(rawToken);
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const verifyUrl = this.buildVerifyUrl(rawToken);

    await this.authUsersService.invalidateEmailVerificationTokensForUser(user.id);
    await this.authUsersService.createEmailVerificationToken({
      userId: user.id,
      tokenHash,
      expiresAt,
    });

    await this.mailService.sendTemplate({
      to: user.email,
      subject: "Verify your Kosdok account",
      template:
        '<p>Hello {{fullName}}, please verify your email: <a href="{{verifyUrl}}">Verify account</a></p>',
      variables: {
        fullName: profile?.fullName ?? "there",
        verifyUrl,
      },
    });

    this.authRateLimitService.recordSuccess("resend_verification", rateKey);

    return {
      data: {
        accepted: true,
      },
    };
  }

  async changePassword(
    userId: string,
    payload: ChangePasswordDto,
  ): Promise<{ data: { changed: boolean } }> {
    if (payload.newPassword !== payload.confirmPassword) {
      throw new BadRequestException("Password confirmation does not match");
    }

    const user = await this.authUsersService.findById(userId);

    if (!user) {
      throw new NotFoundException("User not found");
    }

    const passwordMatches = await bcrypt.compare(payload.currentPassword, user.passwordHash);

    if (!passwordMatches) {
      throw new UnauthorizedException("Current password is incorrect");
    }

    if (payload.currentPassword === payload.newPassword) {
      throw new BadRequestException("New password must be different from current password");
    }

    const newPasswordHash = await bcrypt.hash(payload.newPassword, 10);
    await this.authUsersService.updatePassword(userId, newPasswordHash);
    await this.authUsersService.revokeAllRefreshTokensForUser(userId);

    return {
      data: {
        changed: true,
      },
    };
  }

  async forgotPassword(
    payload: ForgotPasswordDto,
    context: AuthContext,
  ): Promise<{ data: { accepted: boolean } }> {
    const rateKey = this.buildEmailRateKey(context.ipAddress, payload.email);
    this.authRateLimitService.assertAllowed("forgot_password", rateKey);

    const existingUser = await this.authUsersService.findByEmail(payload.email);

    if (existingUser) {
      const rawToken = randomBytes(32).toString("hex");
      const tokenHash = this.hashToken(rawToken);
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
      const profile = await this.userService.findProfile(existingUser.id);
      const resetUrl = this.buildResetPasswordUrl(rawToken);

      await this.authUsersService.invalidatePasswordResetTokensForUser(existingUser.id);
      await this.authUsersService.createPasswordResetToken({
        userId: existingUser.id,
        tokenHash,
        expiresAt,
      });

      await this.mailService.sendTemplate({
        to: existingUser.email,
        subject: "Kosdok password reset request",
        template:
          '<p>Hello {{fullName}}, reset your password using this link: <a href="{{resetUrl}}">Reset password</a></p>',
        variables: {
          fullName: profile?.fullName ?? "there",
          resetUrl,
        },
      });
    }

    this.authRateLimitService.recordSuccess("forgot_password", rateKey);

    return {
      data: {
        accepted: true,
      },
    };
  }

  async resetPassword(
    payload: ResetPasswordDto,
    context: AuthContext,
  ): Promise<{ data: { changed: boolean } }> {
    const rateKey = this.buildIpRateKey(context.ipAddress);
    this.authRateLimitService.assertAllowed("reset_password", rateKey);

    if (payload.newPassword !== payload.confirmPassword) {
      this.authRateLimitService.recordFailure("reset_password", rateKey);
      throw new BadRequestException("Password confirmation does not match");
    }

    const tokenHash = this.hashToken(payload.token);
    const tokenRecord = await this.authUsersService.consumePasswordResetToken(
      tokenHash,
      new Date(),
    );

    if (!tokenRecord) {
      this.authRateLimitService.recordFailure("reset_password", rateKey);
      throw new BadRequestException("Invalid or expired password reset token");
    }

    const user = await this.authUsersService.findById(tokenRecord.userId);

    if (!user) {
      this.authRateLimitService.recordFailure("reset_password", rateKey);
      throw new NotFoundException("User not found");
    }

    const newPasswordHash = await bcrypt.hash(payload.newPassword, 10);
    await this.authUsersService.updatePassword(user.id, newPasswordHash);
    await this.authUsersService.revokeAllRefreshTokensForUser(user.id);

    this.authRateLimitService.recordSuccess("reset_password", rateKey);

    return {
      data: {
        changed: true,
      },
    };
  }

  me(user: AuthUser): { data: AuthUser } {
    return {
      data: user,
    };
  }

  private async buildAuthResponse(user: StoredUser, context: AuthContext): Promise<AuthResponse> {
    const authUser = this.toAuthUser(user);
    const accessExpiresIn = this.configService.get<string>("JWT_ACCESS_EXPIRES_IN") ?? "15m";
    const refreshExpiresIn = this.configService.get<string>("JWT_REFRESH_EXPIRES_IN") ?? "7d";
    const refreshSecret = this.configService.getOrThrow<string>("JWT_REFRESH_SECRET");

    const accessPayload: JwtPayload = {
      sub: authUser.id,
      email: authUser.email,
      roles: authUser.roles,
      permissions: authUser.permissions,
      tokenType: "access",
    };

    const refreshPayload: JwtPayload = {
      ...accessPayload,
      tokenType: "refresh",
    };

    const accessToken = this.jwtService.sign(accessPayload);
    const refreshToken = this.jwtService.sign(refreshPayload, {
      secret: refreshSecret,
      expiresIn: refreshExpiresIn as SignOptions["expiresIn"],
    });

    const refreshExpiryDate = this.resolveExpiryDate(refreshExpiresIn);
    await this.authUsersService.createRefreshToken({
      userId: user.id,
      tokenHash: this.hashToken(refreshToken),
      expiresAt: refreshExpiryDate,
      userAgent: context.userAgent,
      ipAddress: context.ipAddress,
    });

    this.logger.debug(`Issued auth tokens for user ${authUser.email}`);

    return {
      data: {
        accessToken,
        refreshToken,
        tokenType: "Bearer",
        expiresIn: accessExpiresIn,
        refreshExpiresIn,
        user: authUser,
      },
    };
  }

  private toAuthUser(user: StoredUser): AuthUser {
    return {
      id: user.id,
      email: user.email,
      roles: user.roles,
      permissions: user.permissions,
    };
  }

  private hashToken(token: string): string {
    return createHash("sha256").update(token).digest("hex");
  }

  private buildVerifyUrl(token: string): string {
    const appUrl = this.configService.get<string>("APP_PUBLIC_URL") ?? "http://localhost:3000";
    const base = appUrl.replace(/\/$/, "");
    return `${base}/v1/auth/verify-email?token=${token}`;
  }

  private buildResetPasswordUrl(token: string): string {
    const appUrl = this.configService.get<string>("APP_PUBLIC_URL") ?? "http://localhost:3000";
    const base = appUrl.replace(/\/$/, "");
    return `${base}/reset-password?token=${token}`;
  }

  private buildEmailRateKey(ipAddress: string | undefined, email: string): string {
    return `${ipAddress ?? "unknown"}:${email.trim().toLowerCase()}`;
  }

  private buildIpRateKey(ipAddress: string | undefined): string {
    return ipAddress ?? "unknown";
  }

  private resolveExpiryDate(expiresIn: string): Date {
    const matcher = /^(\d+)([smhd])$/.exec(expiresIn.trim());

    if (!matcher) {
      return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    }

    const value = Number(matcher[1]);
    const unit = matcher[2];
    const multipliers: Record<string, number> = {
      s: 1000,
      m: 60 * 1000,
      h: 60 * 60 * 1000,
      d: 24 * 60 * 60 * 1000,
    };

    return new Date(Date.now() + value * multipliers[unit]);
  }
}
