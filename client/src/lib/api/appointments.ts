import { api } from "../axios";
import type { ApiResponse } from "../types";
import type { ProviderType } from "./providers";

export type AppointmentStatus = "pending" | "confirmed" | "cancelled" | "completed";

export type Appointment = {
  id: number;
  patientId: number;
  providerType: ProviderType;
  providerId: number;
  date: string;
  time: string;
  reason: string;
  notes: string | null;
  status: AppointmentStatus;
  cancelledBy: "patient" | "clinic" | null;
  createdAt: string;
  providerName: string;
  specialty: string | null;
  image: string | null;
  city: string | null;
  address: string | null;
};

export type ClinicAppointment = {
  id: number;
  patientId: number;
  providerType: ProviderType;
  providerId: number;
  date: string;
  time: string;
  reason: string;
  notes: string | null;
  status: AppointmentStatus;
  cancelledBy: "patient" | "clinic" | null;
  createdAt: string;
  patientName: string;
  patientPhone: string | null;
  patientEmail: string | null;
  patientPicture: string | null;
};

export type ClinicPatient = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  picture: string | null;
  city: string | null;
  appointmentCount: number;
  lastAppointment: string;
};

export type CreateAppointmentPayload = {
  providerType: ProviderType;
  providerId: number;
  date: string;
  time: string;
  reason: string;
  notes?: string;
  contactPhone?: string;
  contactEmail?: string;
};

export async function createAppointment(payload: CreateAppointmentPayload): Promise<Appointment> {
  const { data } = await api.post<ApiResponse<Appointment>>("/appointments", payload);
  return data.data;
}

export async function getMyAppointments(): Promise<Appointment[]> {
  const { data } = await api.get<ApiResponse<Appointment[]>>("/appointments/mine");
  return data.data;
}

export async function cancelAppointment(id: number): Promise<Appointment> {
  const { data } = await api.patch<ApiResponse<Appointment>>(`/appointments/${id}/cancel`);
  return data.data;
}

export async function getClinicAppointments(params?: {
  status?: AppointmentStatus;
  date?: string;
}): Promise<ClinicAppointment[]> {
  const { data } = await api.get<ApiResponse<ClinicAppointment[]>>("/appointments/clinic", { params });
  return data.data;
}

export async function confirmAppointment(id: number): Promise<ClinicAppointment> {
  const { data } = await api.patch<ApiResponse<ClinicAppointment>>(`/appointments/${id}/confirm`);
  return data.data;
}

export async function completeAppointment(id: number): Promise<ClinicAppointment> {
  const { data } = await api.patch<ApiResponse<ClinicAppointment>>(`/appointments/${id}/complete`);
  return data.data;
}

export async function getClinicPatients(): Promise<ClinicPatient[]> {
  const { data } = await api.get<ApiResponse<ClinicPatient[]>>("/appointments/clinic/patients");
  return data.data;
}
