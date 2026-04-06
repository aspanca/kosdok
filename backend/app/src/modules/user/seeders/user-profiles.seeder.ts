import { Injectable, Logger } from "@nestjs/common";
import { inArray } from "drizzle-orm";

import { DatabaseService } from "../../../database/database.service";
import { authUsers } from "../../identity/schema/auth.schema";
import { UserService } from "../user.service";

@Injectable()
export class UserProfilesSeeder {
  private readonly logger = new Logger(UserProfilesSeeder.name);

  constructor(
    private readonly databaseService: DatabaseService,
    private readonly userService: UserService,
  ) {}

  async run(): Promise<void> {
    const seeds = [
      { email: "patient@kosdok.local", fullName: "Demo Patient" },
      { email: "clinic.admin@kosdok.local", fullName: "Demo Clinic Admin" },
      { email: "platform.admin@kosdok.local", fullName: "Demo Platform Admin" },
    ];

    const emails = seeds.map((seed) => seed.email);
    const rows = await this.databaseService.connection
      .select({ id: authUsers.id, email: authUsers.email })
      .from(authUsers)
      .where(inArray(authUsers.email, emails));

    const userIdByEmail = new Map(rows.map((row) => [row.email, row.id]));

    for (const seed of seeds) {
      const userId = userIdByEmail.get(seed.email);

      if (!userId) {
        this.logger.warn(`Skipping profile seed for missing identity ${seed.email}`);
        continue;
      }

      await this.userService.upsertProfile({
        userId,
        fullName: seed.fullName,
      });
    }

    this.logger.log("User profiles seeded successfully");
  }
}
