export interface ProviderServiceCapabilityRequirementEntry {
  serviceCode: string;
  capabilityKeys: string[];
}

export const providerServiceCapabilityRequirementsCatalog: readonly ProviderServiceCapabilityRequirementEntry[] =
  [
    {
      serviceCode: "cardiology_consultation",
      capabilityKeys: ["appointments:book"],
    },
    {
      serviceCode: "dermatology_consultation",
      capabilityKeys: ["appointments:book"],
    },
    {
      serviceCode: "neurology_consultation",
      capabilityKeys: ["appointments:book"],
    },
    {
      serviceCode: "lab_blood_panel",
      capabilityKeys: ["diagnostics:order", "diagnostics:upload_result"],
    },
    {
      serviceCode: "radiology_mri_ct",
      capabilityKeys: ["diagnostics:order"],
    },
    {
      serviceCode: "ultrasound",
      capabilityKeys: ["diagnostics:order"],
    },
    {
      serviceCode: "online_consultation",
      capabilityKeys: ["appointments:book"],
    },
    {
      serviceCode: "pharmacy_dispense",
      capabilityKeys: ["pharmacy:dispense"],
    },
    {
      serviceCode: "emergency_triage",
      capabilityKeys: ["emergency:accept"],
    },
  ];
