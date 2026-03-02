import { api } from "../axios";
import type { ApiResponse } from "../types";

export type Service = {
  id: number;
  name: string;
  category: string | null;
  icon?: string | null;
};

export type Facility = {
  id: number;
  name: string;
  icon: string | null;
  category: string | null;
};

export type ClinicLocation = {
  id?: number;
  name?: string;
  address?: string;
  city?: string;
  lat?: number | null;
  lng?: number | null;
  phone?: string;
};

export type ScheduleDay = {
  open?: string;
  close?: string;
  closed?: boolean;
};

export type ClinicProfile = {
  id: number;
  email: string;
  type: string;
  clinic_name: string | null;
  logo: string | null;
  website: string | null;
  description: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  instagram: string | null;
  facebook: string | null;
  linkedin: string | null;
  pictures: string[];
  schedule: Record<string, ScheduleDay>;
  serviceIds: number[];
  facilityIds: number[];
  locations: ClinicLocation[];
};

export type ClinicProfileUpdate = {
  clinicName?: string;
  email?: string;
  phone?: string;
  website?: string;
  address?: string;
  city?: string;
  description?: string;
  instagram?: string;
  facebook?: string;
  linkedin?: string;
  pictures?: string[];
  schedule?: Record<string, ScheduleDay>;
  serviceIds?: number[];
  facilityIds?: number[];
  locations?: ClinicLocation[];
};

export async function getServices(): Promise<Service[]> {
  const { data } = await api.get<ApiResponse<Service[]>>("/clinic/services");
  return data.data;
}

export async function getFacilities(): Promise<Facility[]> {
  const { data } = await api.get<ApiResponse<Facility[]>>("/clinic/facilities");
  return data.data;
}

export async function getClinicProfile(): Promise<ClinicProfile> {
  const { data } = await api.get<ApiResponse<ClinicProfile>>("/clinic/me");
  return data.data;
}

export async function updateClinicProfile(payload: ClinicProfileUpdate): Promise<ClinicProfile> {
  const { data } = await api.patch<ApiResponse<ClinicProfile>>("/clinic/me", payload);
  return data.data;
}

export async function uploadClinicPicture(file: File): Promise<ClinicProfile> {
  const formData = new FormData();
  formData.append("picture", file);
  const { data } = await api.post<ApiResponse<ClinicProfile>>("/clinic/me/pictures", formData);
  return data.data;
}

export async function uploadClinicLogo(file: File): Promise<ClinicProfile> {
  const formData = new FormData();
  formData.append("logo", file);
  const { data } = await api.post<ApiResponse<ClinicProfile>>("/clinic/me/logo", formData);
  return data.data;
}
