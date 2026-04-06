export interface ProviderOrganizationTypeCatalogEntry {
  code: string;
  label: string;
}

export interface ProviderCapabilityCatalogEntry {
  key: string;
  category: string;
  description: string;
}

export interface ProviderTypeCapabilityDefaultEntry {
  typeCode: string;
  capabilityKey: string;
  enabledDefault: boolean;
}

export const providerOrganizationTypeCatalog: readonly ProviderOrganizationTypeCatalogEntry[] = [
  { code: "clinic", label: "Clinic" },
  { code: "hospital", label: "Hospital" },
  { code: "lab", label: "Laboratory" },
  { code: "pharmacy", label: "Pharmacy" },
];

export const providerCapabilityCatalog: readonly ProviderCapabilityCatalogEntry[] = [
  {
    key: "appointments:book",
    category: "appointments",
    description: "Supports appointment booking by patients",
  },
  {
    key: "appointments:manage",
    category: "appointments",
    description: "Supports provider-side appointment management",
  },
  {
    key: "diagnostics:order",
    category: "diagnostics",
    description: "Supports diagnostic ordering services",
  },
  {
    key: "diagnostics:upload_result",
    category: "diagnostics",
    description: "Supports diagnostic result upload",
  },
  {
    key: "pharmacy:dispense",
    category: "pharmacy",
    description: "Supports pharmacy dispensing operations",
  },
  {
    key: "emergency:accept",
    category: "emergency",
    description: "Supports emergency intake and triage",
  },
];

export const providerTypeCapabilityDefaultsCatalog: readonly ProviderTypeCapabilityDefaultEntry[] = [
  { typeCode: "clinic", capabilityKey: "appointments:book", enabledDefault: true },
  { typeCode: "clinic", capabilityKey: "appointments:manage", enabledDefault: true },
  { typeCode: "hospital", capabilityKey: "appointments:book", enabledDefault: true },
  { typeCode: "hospital", capabilityKey: "appointments:manage", enabledDefault: true },
  { typeCode: "hospital", capabilityKey: "diagnostics:order", enabledDefault: true },
  { typeCode: "hospital", capabilityKey: "diagnostics:upload_result", enabledDefault: true },
  { typeCode: "hospital", capabilityKey: "emergency:accept", enabledDefault: true },
  { typeCode: "lab", capabilityKey: "diagnostics:order", enabledDefault: true },
  { typeCode: "lab", capabilityKey: "diagnostics:upload_result", enabledDefault: true },
  { typeCode: "pharmacy", capabilityKey: "pharmacy:dispense", enabledDefault: true },
];
