import type { RawPatient, RawClinic, PatientUser, ClinicUser, User } from "./types";

function isRawClinic(raw: RawPatient | RawClinic): raw is RawClinic {
  return "type" in raw && raw.type === "clinic";
}

function mapRawPatient(raw: RawPatient): PatientUser {
  return {
    id: String(raw.id),
    type: "patient",
    email: raw.email,
    firstName: raw.first_name,
    lastName: raw.last_name,
    picture: raw.picture ?? undefined,
    phoneNumber: raw.phone_number ?? undefined,
    dateOfBirth: raw.date_of_birth ?? undefined,
    gender: raw.gender ?? undefined,
    address: raw.address ?? undefined,
    city: raw.city ?? undefined,
  };
}

function parseJson<T>(val: unknown): T | undefined {
  if (val == null) return undefined;
  if (typeof val === "string") {
    try {
      return JSON.parse(val) as T;
    } catch {
      return undefined;
    }
  }
  return val as T;
}

function mapRawClinic(raw: RawClinic): ClinicUser {
  return {
    id: String(raw.id),
    type: "clinic",
    email: raw.email,
    clinicName: raw.clinic_name ?? "",
    avatar: raw.avatar ?? raw.logo ?? undefined,
    logo: raw.logo ?? undefined,
    website: raw.website ?? undefined,
    description: raw.description ?? undefined,
    phone: raw.phone ?? undefined,
    address: raw.address ?? undefined,
    city: raw.city ?? undefined,
    instagram: raw.instagram ?? undefined,
    facebook: raw.facebook ?? undefined,
    linkedin: raw.linkedin ?? undefined,
    pictures: parseJson<string[]>(raw.pictures),
    schedule: parseJson<Record<string, { open?: string; close?: string; closed?: boolean }>>(raw.schedule),
  };
}

export function mapRawUserToUser(raw: RawPatient | RawClinic): User {
  if (isRawClinic(raw)) {
    return mapRawClinic(raw);
  }
  return mapRawPatient(raw);
}
