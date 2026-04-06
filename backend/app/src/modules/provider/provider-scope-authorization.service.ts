import { ForbiddenException, Inject, Injectable } from "@nestjs/common";

import { PROVIDER_STAFF_SCOPE_REPO } from "./repositories/provider-staff-scope.repo";

import type { AuthUser } from "../../common/types/auth-user.type";
import type { PermissionKey } from "../../common/constants/permission.constants";
import type { ProviderStaffScopeRepo } from "./repositories/provider-staff-scope.repo";

export interface ScopedPermissionInput {
  user: AuthUser;
  requiredPermission: PermissionKey;
  organizationId: string;
  siteId?: string;
}

@Injectable()
export class ProviderScopeAuthorizationService {
  constructor(
    @Inject(PROVIDER_STAFF_SCOPE_REPO)
    private readonly providerStaffScopeRepo: ProviderStaffScopeRepo,
  ) {}

  async assertScopedPermission(input: ScopedPermissionInput): Promise<void> {
    if (!input.user.permissions.includes(input.requiredPermission)) {
      throw new ForbiddenException("Missing required permission");
    }

    const hasMembership = await this.providerStaffScopeRepo.hasActiveMembership({
      userId: input.user.id,
      organizationId: input.organizationId,
      siteId: input.siteId,
    });

    if (!hasMembership) {
      throw new ForbiddenException("Membership scope does not allow this action");
    }
  }
}
