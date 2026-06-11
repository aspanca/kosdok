import { api } from "../axios";
import type { ApiResponse } from "../types";
import type { ClinicLocation, ScheduleDay } from "./clinic";

export type ProviderType = "clinic" | "doctor";

export type ProviderSummary = {
  id: number;
  type: ProviderType;
  name: string;
  specialty: string | null;
  city: string | null;
  address: string | null;
  phone: string | null;
  image: string | null;
  description: string | null;
  rating: number | null;
  reviewCount: number;
};

export type ReviewsSummary = {
  rating: number | null;
  reviewCount: number;
};

export type ClinicPublicProfile = {
  id: number;
  email: string;
  name: string;
  clinic_name: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  website: string | null;
  description: string | null;
  logo: string | null;
  instagram: string | null;
  facebook: string | null;
  linkedin: string | null;
  pictures: string[];
  schedule: Record<string, ScheduleDay>;
  serviceIds: number[];
  facilityIds: number[];
  locations: ClinicLocation[];
  slotDurationMinutes: number;
  reviewsSummary: ReviewsSummary;
};

export type DoctorPublicProfile = {
  id: number;
  email: string | null;
  first_name: string;
  last_name: string;
  phone: string | null;
  specialty: string | null;
  address: string | null;
  city: string | null;
  avatar: string | null;
  bio: string | null;
  reviewsSummary: ReviewsSummary;
};

export type SearchProvidersParams = {
  type?: ProviderType;
  q?: string;
  city?: string;
  serviceId?: number;
};

export async function searchProviders(params: SearchProvidersParams): Promise<ProviderSummary[]> {
  const { data } = await api.get<ApiResponse<ProviderSummary[]>>("/providers", { params });
  return data.data;
}

export async function getClinicById(id: number): Promise<ClinicPublicProfile> {
  const { data } = await api.get<ApiResponse<ClinicPublicProfile>>(`/providers/clinic/${id}`);
  return data.data;
}

export async function getDoctorById(id: number): Promise<DoctorPublicProfile> {
  const { data } = await api.get<ApiResponse<DoctorPublicProfile>>(`/providers/doctor/${id}`);
  return data.data;
}

export async function getSlots(type: ProviderType, id: number, date: string): Promise<string[]> {
  const { data } = await api.get<ApiResponse<{ date: string; slots: string[] }>>(
    `/providers/${type}/${id}/slots`,
    { params: { date } }
  );
  return data.data.slots;
}
