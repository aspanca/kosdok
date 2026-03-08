import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { resolveEnvironmentFilePaths } from "@config/environment-files";

import { AppController } from "./app.controller";
import { validateEnvironment } from "./config/environment.validation";
import { DatabaseModule } from "./database/database.module";
import { AppointmentsModule } from "./modules/appointments/appointments.module";
import { ClinicModule } from "./modules/clinic/clinic.module";
import { JwtAuthGuard } from "./modules/identity/guards/jwt-auth.guard";
import { PermissionsGuard } from "./modules/identity/guards/permissions.guard";
import { IdentityModule } from "./modules/identity/identity.module";
import { MailModule } from "./modules/mail/mail.module";
import { ProviderModule } from "./modules/provider/provider.module";
import { UserModule } from "./modules/user/user.module";

@Module({
  imports: [
    AppointmentsModule,
    ClinicModule,
    ConfigModule.forRoot({
      envFilePath: resolveEnvironmentFilePaths(process.env.NODE_ENV),
      isGlobal: true,
      validate: validateEnvironment,
    }),
    DatabaseModule,
    IdentityModule,
    MailModule,
    ProviderModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
  ],
})
export class AppModule {}
