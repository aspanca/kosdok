export const Permission = {
  AppointmentsBook: "appointments:book",
  AppointmentsManage: "appointments:manage",
  DiagnosticsOrder: "diagnostics:order",
  DiagnosticsUploadResult: "diagnostics:upload_result",
  PharmacyDispense: "pharmacy:dispense",
  EmergencyAccept: "emergency:accept",
  ProviderRead: "provider:read",
  ProviderManageSites: "provider:manage_sites",
  ProviderManageStaff: "provider:manage_staff",
  ProviderManageCapabilities: "provider:manage_capabilities",
} as const;

export type PermissionKey = (typeof Permission)[keyof typeof Permission];

export const Role = {
  Patient: "patient",
  Doctor: "doctor",
  Secretary: "secretary",
  ClinicAdmin: "clinic_admin",
  LabStaff: "lab_staff",
  PlatformAdmin: "platform_admin",
} as const;

export type RoleKey = (typeof Role)[keyof typeof Role];

export const ROLE_PERMISSIONS: Record<RoleKey, readonly PermissionKey[]> = {
  patient: [Permission.AppointmentsBook],
  doctor: [Permission.AppointmentsManage, Permission.ProviderRead],
  secretary: [Permission.AppointmentsManage, Permission.ProviderRead],
  clinic_admin: [
    Permission.ProviderRead,
    Permission.ProviderManageSites,
    Permission.ProviderManageStaff,
    Permission.ProviderManageCapabilities,
    Permission.AppointmentsManage,
  ],
  lab_staff: [Permission.DiagnosticsOrder, Permission.DiagnosticsUploadResult],
  platform_admin: Object.values(Permission),
};

export const CAPABILITY_KEYS: readonly PermissionKey[] = Object.values(Permission);
