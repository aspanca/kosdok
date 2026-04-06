export interface ProviderSpecialtyCatalogEntry {
  id: string;
  code: string;
  name: string;
}

export interface ProviderServiceCatalogEntry {
  id: string;
  code: string;
  name: string;
  category: string;
  specialtyId?: string;
  requiredCapabilities: string[];
}

export const providerSpecialtyCatalog: readonly ProviderSpecialtyCatalogEntry[] = [
  { id: "spec-cardiology", code: "cardiology", name: "Kardiologji" },
  { id: "spec-dermatology", code: "dermatology", name: "Dermatologji" },
  { id: "spec-neurology", code: "neurology", name: "Neurologji" },
  { id: "spec-orthopedics", code: "orthopedics", name: "Ortopedi" },
  { id: "spec-pediatrics", code: "pediatrics", name: "Pediatri" },
  { id: "spec-radiology", code: "radiology", name: "Radiologji" },
  { id: "spec-family-medicine", code: "family_medicine", name: "Medicine Familjare" },
  { id: "spec-emergency", code: "emergency", name: "Medicine Urgjente" },
];

export const providerServiceCatalog: readonly ProviderServiceCatalogEntry[] = [
  {
    id: "svc-cardiology-consult",
    code: "cardiology_consultation",
    name: "Konsulte Kardiologjike",
    category: "specialty",
    specialtyId: "spec-cardiology",
    requiredCapabilities: ["appointments:book"],
  },
  {
    id: "svc-dermatology-consult",
    code: "dermatology_consultation",
    name: "Konsulte Dermatologjike",
    category: "specialty",
    specialtyId: "spec-dermatology",
    requiredCapabilities: ["appointments:book"],
  },
  {
    id: "svc-neurology-consult",
    code: "neurology_consultation",
    name: "Konsulte Neurologjike",
    category: "specialty",
    specialtyId: "spec-neurology",
    requiredCapabilities: ["appointments:book"],
  },
  {
    id: "svc-lab-blood-panel",
    code: "lab_blood_panel",
    name: "Panel Analizash Gjaku",
    category: "diagnostics",
    requiredCapabilities: ["diagnostics:order", "diagnostics:upload_result"],
  },
  {
    id: "svc-radiology-mri-ct",
    code: "radiology_mri_ct",
    name: "MRI dhe CT",
    category: "diagnostics",
    specialtyId: "spec-radiology",
    requiredCapabilities: ["diagnostics:order"],
  },
  {
    id: "svc-ultrasound",
    code: "ultrasound",
    name: "Ultratingull",
    category: "diagnostics",
    specialtyId: "spec-radiology",
    requiredCapabilities: ["diagnostics:order"],
  },
  {
    id: "svc-online-consult",
    code: "online_consultation",
    name: "Konsultie Online",
    category: "remote",
    requiredCapabilities: ["appointments:book"],
  },
  {
    id: "svc-pharmacy-dispense",
    code: "pharmacy_dispense",
    name: "Dispensim Barnash",
    category: "pharmacy",
    requiredCapabilities: ["pharmacy:dispense"],
  },
  {
    id: "svc-emergency-triage",
    code: "emergency_triage",
    name: "Pranim Urgjence",
    category: "emergency",
    specialtyId: "spec-emergency",
    requiredCapabilities: ["emergency:accept"],
  },
];
