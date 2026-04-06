import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";

import { DatabaseModule } from "../../database/database.module";
import { MailModule } from "../mail/mail.module";
import { UserModule } from "../user/user.module";

import { AuthUsersService } from "./auth-users.service";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { AUTH_REPO } from "./repositories/auth.repo";
import { AuthRepository } from "./repositories/auth.repository";
import { AuthRateLimitService } from "./security/auth-rate-limit.service";
import { AuthUsersSeeder } from "./seeders/auth-users.seeder";
import { JwtStrategy } from "./strategy/jwt.strategy";

import type { SignOptions } from "jsonwebtoken";

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const expiresIn = (configService.get<string>("JWT_ACCESS_EXPIRES_IN") ??
          "15m") as SignOptions["expiresIn"];

        return {
          secret: configService.getOrThrow<string>("JWT_ACCESS_SECRET"),
          signOptions: {
            expiresIn,
          },
        };
      },
    }),
    MailModule,
    PassportModule.register({
      defaultStrategy: "jwt",
    }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: AUTH_REPO,
      useExisting: AuthRepository,
    },
    AuthRateLimitService,
    AuthRepository,
    AuthService,
    AuthUsersSeeder,
    AuthUsersService,
    JwtStrategy,
  ],
  exports: [AuthService, AuthUsersSeeder, AuthUsersService],
})
export class IdentityModule {}
