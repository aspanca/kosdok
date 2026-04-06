import { ForbiddenException } from "@nestjs/common";

import { Permission } from "../../common/constants/permission.constants";

import { ProviderScopeAuthorizationService } from "./provider-scope-authorization.service";

import type { AuthUser } from "../../common/types/auth-user.type";
import type { ProviderStaffScopeRepo } from "./repositories/provider-staff-scope.repo";

class FakeProviderStaffScopeRepo implements ProviderStaffScopeRepo {
  constructor(private readonly responseByKey: Record<string, boolean>) {}

  async hasActiveMembership(input: {
    userId: string;
    organizationId: string;
    siteId?: string;
  }): Promise<boolean> {
    const directKey = [input.userId, input.organizationId, input.siteId ?? "*"].join(":");

    if (this.responseByKey[directKey] !== undefined) {
      return this.responseByKey[directKey];
    }

    const organizationWideKey = [input.userId, input.organizationId, "*"].join(":");
    return this.responseByKey[organizationWideKey] ?? false;
  }
}

const providerAdminUser: AuthUser = {
  id: "user_1",
  email: "clinic.admin@kosdok.local",
  roles: ["clinic_admin"],
  permissions: [Permission.ProviderManageSites],
};

describe("ProviderScopeAuthorizationService", () => {
  it("allows organization-scoped membership to pass site checks", async () => {
    const service = new ProviderScopeAuthorizationService(
      new FakeProviderStaffScopeRepo({
        "user_1:org_1:*": true,
      }),
    );

    await expect(
      service.assertScopedPermission({
        user: providerAdminUser,
        requiredPermission: Permission.ProviderManageSites,
        organizationId: "org_1",
        siteId: "site_a",
      }),
    ).resolves.toBeUndefined();
  });

  it("throws when permission is missing", async () => {
    const service = new ProviderScopeAuthorizationService(
      new FakeProviderStaffScopeRepo({
        "user_1:org_1:*": true,
      }),
    );

    await expect(
      service.assertScopedPermission({
        user: {
          ...providerAdminUser,
          permissions: [],
        },
        requiredPermission: Permission.ProviderManageSites,
        organizationId: "org_1",
      }),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it("throws when user has permission but membership scope is missing", async () => {
    const service = new ProviderScopeAuthorizationService(new FakeProviderStaffScopeRepo({}));

    await expect(
      service.assertScopedPermission({
        user: providerAdminUser,
        requiredPermission: Permission.ProviderManageSites,
        organizationId: "org_1",
      }),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });
});
