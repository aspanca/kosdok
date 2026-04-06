export const PROVIDER_STAFF_SCOPE_REPO = Symbol("PROVIDER_STAFF_SCOPE_REPO");

export interface StaffScopeCheckInput {
  userId: string;
  organizationId: string;
  siteId?: string;
}

export interface ProviderStaffScopeRepo {
  hasActiveMembership(input: StaffScopeCheckInput): Promise<boolean>;
}
