import type { CatalogServiceType } from "../catalog.constants";

export interface CatalogSpecialtyEntry {
  id: string;
  code: string;
  name: string;
}

export interface CatalogServiceEntry {
  id: string;
  code: string;
  name: string;
  serviceType: CatalogServiceType;
  specialtyId?: string;
}

export const specialtyCatalog: readonly CatalogSpecialtyEntry[] = [
  { id: "spec-cardiology", code: "cardiology", name: "Kardiologji" },
  { id: "spec-dermatology", code: "dermatology", name: "Dermatologji" },
  { id: "spec-neurology", code: "neurology", name: "Neurologji" },
  { id: "spec-orthopedics", code: "orthopedics", name: "Ortopedi" },
  { id: "spec-pediatrics", code: "pediatrics", name: "Pediatri" },
  { id: "spec-radiology", code: "radiology", name: "Radiologji" },
  { id: "spec-family-medicine", code: "family_medicine", name: "Medicine Familjare" },
  { id: "spec-emergency", code: "emergency", name: "Medicine Urgjente" },
];

export const serviceCatalog: readonly CatalogServiceEntry[] = [
  {
    id: "svc-cardiology-consult",
    code: "cardiology_consultation",
    name: "Konsulte Kardiologjike",
    serviceType: "consultation",
    specialtyId: "spec-cardiology",
  },
  {
    id: "svc-dermatology-consult",
    code: "dermatology_consultation",
    name: "Konsulte Dermatologjike",
    serviceType: "consultation",
    specialtyId: "spec-dermatology",
  },
  {
    id: "svc-neurology-consult",
    code: "neurology_consultation",
    name: "Konsulte Neurologjike",
    serviceType: "consultation",
    specialtyId: "spec-neurology",
  },
  {
    id: "svc-lab-blood-panel",
    code: "lab_blood_panel",
    name: "Panel Analizash Gjaku",
    serviceType: "diagnostic",
  },
  {
    id: "svc-radiology-mri-ct",
    code: "radiology_mri_ct",
    name: "MRI dhe CT",
    serviceType: "diagnostic",
    specialtyId: "spec-radiology",
  },
  {
    id: "svc-ultrasound",
    code: "ultrasound",
    name: "Ultratingull",
    serviceType: "diagnostic",
    specialtyId: "spec-radiology",
  },
  {
    id: "svc-online-consult",
    code: "online_consultation",
    name: "Konsultie Online",
    serviceType: "consultation",
  },
  {
    id: "svc-pharmacy-dispense",
    code: "pharmacy_dispense",
    name: "Dispensim Barnash",
    serviceType: "pharmacy",
  },
  {
    id: "svc-emergency-triage",
    code: "emergency_triage",
    name: "Pranim Urgjence",
    serviceType: "emergency",
    specialtyId: "spec-emergency",
  },
];
