import { Body, Controller, Get, Patch, Post, Query, Req } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from "@nestjs/swagger";

import { AuthService } from "./auth.service";
import { CurrentUser } from "./decorators/current-user.decorator";
import { Public } from "./decorators/public.decorator";
import { ChangePasswordDto } from "./dto/change-password.dto";
import { ForgotPasswordDto } from "./dto/forgot-password.dto";
import { RefreshTokenDto } from "./dto/refresh-token.dto";
import { ResendVerificationDto } from "./dto/resend-verification.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { SignInDto } from "./dto/sign-in.dto";
import { SignUpDto } from "./dto/sign-up.dto";
import { VerifyEmailDto } from "./dto/verify-email.dto";

import type { AuthUser } from "../../common/types/auth-user.type";
import type { Request } from "express";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @ApiOperation({
    summary: "Create patient identity and send verification email",
  })
  @ApiBody({ type: SignUpDto })
  @ApiOkResponse({
    description: "Registration accepted, verification email sent",
  })
  @Post("sign-up")
  signUp(@Body() payload: SignUpDto) {
    return this.authService.signUp(payload);
  }

  @Public()
  @ApiOperation({ summary: "Sign in and receive access/refresh tokens" })
  @ApiBody({ type: SignInDto })
  @ApiOkResponse({ description: "Tokens issued" })
  @Post("sign-in")
  signIn(@Body() payload: SignInDto, @Req() request: Request) {
    return this.authService.signIn(payload, {
      userAgent: request.headers["user-agent"],
      ipAddress: request.ip,
    });
  }

  @Public()
  @ApiOperation({ summary: "Verify email using token query param" })
  @ApiQuery({ name: "token", required: true })
  @ApiOkResponse({ description: "Email verified and tokens issued" })
  @Get("verify-email")
  verifyEmail(@Query() query: VerifyEmailDto, @Req() request: Request) {
    return this.authService.verifyEmail(query.token, {
      userAgent: request.headers["user-agent"],
      ipAddress: request.ip,
    });
  }

  @Public()
  @ApiOperation({ summary: "Refresh access/refresh token pair" })
  @ApiBody({ type: RefreshTokenDto })
  @ApiOkResponse({ description: "Tokens rotated" })
  @Post("refresh")
  refresh(@Body() payload: RefreshTokenDto, @Req() request: Request) {
    return this.authService.refresh(payload, {
      userAgent: request.headers["user-agent"],
      ipAddress: request.ip,
    });
  }

  @Public()
  @ApiOperation({ summary: "Logout current session by revoking refresh token" })
  @ApiBody({ type: RefreshTokenDto })
  @ApiOkResponse({ description: "Logout accepted" })
  @Post("logout")
  logout(@Body() payload: RefreshTokenDto) {
    return this.authService.logout(payload);
  }

  @Public()
  @ApiOperation({ summary: "Resend account verification email" })
  @ApiBody({ type: ResendVerificationDto })
  @ApiOkResponse({ description: "Resend accepted" })
  @Post("resend-verification")
  resendVerification(@Body() payload: ResendVerificationDto, @Req() request: Request) {
    return this.authService.resendVerification(payload, {
      userAgent: request.headers["user-agent"],
      ipAddress: request.ip,
    });
  }

  @Public()
  @ApiOperation({ summary: "Request password reset email" })
  @ApiBody({ type: ForgotPasswordDto })
  @ApiOkResponse({ description: "Request accepted" })
  @Post("forgot-password")
  forgotPassword(@Body() payload: ForgotPasswordDto, @Req() request: Request) {
    return this.authService.forgotPassword(payload, {
      userAgent: request.headers["user-agent"],
      ipAddress: request.ip,
    });
  }

  @Public()
  @ApiOperation({ summary: "Complete password reset with token" })
  @ApiBody({ type: ResetPasswordDto })
  @ApiOkResponse({ description: "Password updated" })
  @Post("reset-password")
  resetPassword(@Body() payload: ResetPasswordDto, @Req() request: Request) {
    return this.authService.resetPassword(payload, {
      userAgent: request.headers["user-agent"],
      ipAddress: request.ip,
    });
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: "Get authenticated user claims" })
  @ApiOkResponse({ description: "Authenticated user claims" })
  @Get("me")
  me(@CurrentUser() user: AuthUser) {
    return this.authService.me(user);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: "Change account password and revoke active sessions",
  })
  @ApiBody({ type: ChangePasswordDto })
  @ApiOkResponse({ description: "Password changed" })
  @Patch("change-password")
  changePassword(@CurrentUser() user: AuthUser, @Body() payload: ChangePasswordDto) {
    return this.authService.changePassword(user.id, payload);
  }
}
