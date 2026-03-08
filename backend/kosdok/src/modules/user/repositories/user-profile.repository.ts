import { Injectable } from "@nestjs/common";
import { eq } from "drizzle-orm";

import { DatabaseService } from "../../../database/database.service";
import { userProfiles } from "../schema/user-profile.schema";

import type { SaveUserProfileInput, UserProfileRepo } from "./user-profile.repo";
import type { UserProfile } from "../types/user-profile.type";

@Injectable()
export class UserProfileRepository implements UserProfileRepo {
  private readonly db;

  constructor(databaseService: DatabaseService) {
    this.db = databaseService.connection;
  }

  async findByUserId(userId: string): Promise<UserProfile | undefined> {
    const rows = await this.db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, userId))
      .limit(1);

    return rows[0] ? this.toDomain(rows[0]) : undefined;
  }

  async upsert(input: SaveUserProfileInput): Promise<UserProfile> {
    await this.db
      .insert(userProfiles)
      .values({
        userId: input.userId,
        fullName: input.fullName,
        phone: input.phone ?? null,
        city: input.city ?? null,
        locale: input.locale ?? "sq",
        avatarUrl: input.avatarUrl ?? null,
      })
      .onDuplicateKeyUpdate({
        set: {
          fullName: input.fullName,
          phone: input.phone ?? null,
          city: input.city ?? null,
          locale: input.locale ?? "sq",
          avatarUrl: input.avatarUrl ?? null,
          updatedAt: new Date(),
        },
      });

    const profile = await this.findByUserId(input.userId);

    if (!profile) {
      throw new Error("Failed to persist user profile");
    }

    return profile;
  }

  private toDomain(row: typeof userProfiles.$inferSelect): UserProfile {
    return {
      userId: row.userId,
      fullName: row.fullName,
      phone: row.phone,
      city: row.city,
      locale: row.locale,
      avatarUrl: row.avatarUrl,
    };
  }
}
