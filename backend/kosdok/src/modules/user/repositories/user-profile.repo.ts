import type { UserProfile } from "../types/user-profile.type";

export const USER_PROFILE_REPO = Symbol("USER_PROFILE_REPO");

export interface SaveUserProfileInput {
  userId: string;
  fullName: string;
  phone?: string | null;
  city?: string | null;
  locale?: string;
  avatarUrl?: string | null;
}

export interface UserProfileRepo {
  findByUserId(userId: string): Promise<UserProfile | undefined>;
  upsert(input: SaveUserProfileInput): Promise<UserProfile>;
}
