import { Module } from "@nestjs/common";

import { DatabaseModule } from "../../database/database.module";

import { USER_PROFILE_REPO } from "./repositories/user-profile.repo";
import { UserProfileRepository } from "./repositories/user-profile.repository";
import { UserProfilesSeeder } from "./seeders/user-profiles.seeder";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";

@Module({
  imports: [DatabaseModule],
  controllers: [UserController],
  providers: [
    {
      provide: USER_PROFILE_REPO,
      useExisting: UserProfileRepository,
    },
    UserProfileRepository,
    UserProfilesSeeder,
    UserService,
  ],
  exports: [UserProfilesSeeder, UserService],
})
export class UserModule {}
