import { Inject, Injectable, NotFoundException } from "@nestjs/common";

import { UpdateMyProfileDto } from "./dto/update-my-profile.dto";
import { USER_PROFILE_REPO } from "./repositories/user-profile.repo";

import type { SaveUserProfileInput, UserProfileRepo } from "./repositories/user-profile.repo";
import type { UserProfile } from "./types/user-profile.type";

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_PROFILE_REPO)
    private readonly userProfileRepo: UserProfileRepo,
  ) {}

  createProfile(input: SaveUserProfileInput): Promise<UserProfile> {
    return this.userProfileRepo.upsert(input);
  }

  upsertProfile(input: SaveUserProfileInput): Promise<UserProfile> {
    return this.userProfileRepo.upsert(input);
  }

  findProfile(userId: string): Promise<UserProfile | undefined> {
    return this.userProfileRepo.findByUserId(userId);
  }

  async getMyProfile(userId: string): Promise<{ data: UserProfile }> {
    const profile = await this.findProfile(userId);

    if (!profile) {
      throw new NotFoundException("Profile not found");
    }

    return {
      data: profile,
    };
  }

  async updateMyProfile(
    userId: string,
    payload: UpdateMyProfileDto,
  ): Promise<{ data: UserProfile }> {
    const existing = await this.findProfile(userId);

    if (!existing) {
      throw new NotFoundException("Profile not found");
    }

    const updated = await this.userProfileRepo.upsert({
      userId,
      fullName: payload.fullName ?? existing.fullName,
      phone: payload.phone ?? existing.phone,
      city: payload.city ?? existing.city,
      locale: payload.locale ?? existing.locale,
      avatarUrl: payload.avatarUrl ?? existing.avatarUrl,
    });

    return {
      data: updated,
    };
  }
}
