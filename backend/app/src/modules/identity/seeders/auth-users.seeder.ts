import { ConflictException, Injectable, Logger } from "@nestjs/common";

import { Role } from "../../../common/constants/permission.constants";
import { AuthUsersService } from "../auth-users.service";

@Injectable()
export class AuthUsersSeeder {
  private readonly logger = new Logger(AuthUsersSeeder.name);

  constructor(private readonly authUsersService: AuthUsersService) {}

  async run(): Promise<void> {
    const seedUsers = [
      {
        email: "patient@kosdok.local",
        password: "Patient123!",
        roles: [Role.Patient],
        emailVerified: true,
      },
      {
        email: "clinic.admin@kosdok.local",
        password: "ClinicAdmin123!",
        roles: [Role.ClinicAdmin],
        emailVerified: true,
      },
      {
        email: "platform.admin@kosdok.local",
        password: "PlatformAdmin123!",
        roles: [Role.PlatformAdmin],
        emailVerified: true,
      },
    ];

    for (const user of seedUsers) {
      try {
        await this.authUsersService.createUser(user);
      } catch (error) {
        if (error instanceof ConflictException) {
          this.logger.debug(`Skipping existing seeded user ${user.email}`);
          continue;
        }

        throw error;
      }
    }

    this.logger.log("Auth users seeded successfully");
  }
}
