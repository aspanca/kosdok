import { Injectable } from "@nestjs/common";
import { and, eq, isNull, or } from "drizzle-orm";

import { DatabaseService } from "../../../database/database.service";
import { organizationStaff } from "../schema/provider.schema";

import type { ProviderStaffScopeRepo, StaffScopeCheckInput } from "./provider-staff-scope.repo";

@Injectable()
export class ProviderStaffScopeRepository implements ProviderStaffScopeRepo {
  private readonly db;

  constructor(databaseService: DatabaseService) {
    this.db = databaseService.connection;
  }

  async hasActiveMembership(input: StaffScopeCheckInput): Promise<boolean> {
    const conditions = [
      eq(organizationStaff.userId, input.userId),
      eq(organizationStaff.organizationId, input.organizationId),
      eq(organizationStaff.status, "active"),
    ];

    if (input.siteId) {
      const siteScopeCondition = or(
        isNull(organizationStaff.siteId),
        eq(organizationStaff.siteId, input.siteId),
      );

      if (siteScopeCondition) {
        conditions.push(siteScopeCondition);
      }
    }

    const rows = await this.db
      .select({ id: organizationStaff.id })
      .from(organizationStaff)
      .where(and(...conditions))
      .limit(1);

    return rows.length > 0;
  }
}
