import { api } from "./axios";

type ApiResponse<T> = { success: boolean; data: T };

// Auth
export async function adminLogin(email: string, password: string) {
  const { data } = await api.post<ApiResponse<{ user: unknown; accessToken: string; refreshToken: string }>>(
    "/admin/auth/login",
    { email, password }
  );
  return data.data;
}

export async function adminGetMe() {
  const { data } = await api.get<ApiResponse<unknown>>("/admin/auth/me");
  return data.data;
}

// Cities
export async function getCities() {
  const { data } = await api.get<ApiResponse<unknown[]>>("/admin/cities");
  return data.data;
}

export async function createCity(payload: { name: string; postcode: string }) {
  const { data } = await api.post<ApiResponse<unknown>>("/admin/cities", payload);
  return data.data;
}

export async function updateCity(id: number, payload: { name?: string; postcode?: string }) {
  const { data } = await api.patch<ApiResponse<unknown>>(`/admin/cities/${id}`, payload);
  return data.data;
}

export async function deleteCity(id: number) {
  const { data } = await api.delete<ApiResponse<unknown>>(`/admin/cities/${id}`);
  return data.data;
}

// Services
export async function getServices() {
  const { data } = await api.get<ApiResponse<unknown[]>>("/admin/services");
  return data.data;
}

export async function createService(payload: { name: string; category?: string; icon?: string }) {
  const { data } = await api.post<ApiResponse<unknown>>("/admin/services", payload);
  return data.data;
}

export async function updateService(id: number, payload: { name?: string; category?: string; icon?: string }) {
  const { data } = await api.patch<ApiResponse<unknown>>(`/admin/services/${id}`, payload);
  return data.data;
}

export async function deleteService(id: number) {
  const { data } = await api.delete<ApiResponse<unknown>>(`/admin/services/${id}`);
  return data.data;
}

// Facilities
export async function getFacilities() {
  const { data } = await api.get<ApiResponse<unknown[]>>("/admin/facilities");
  return data.data;
}

export async function createFacility(payload: { name: string; icon?: string; category?: string }) {
  const { data } = await api.post<ApiResponse<unknown>>("/admin/facilities", payload);
  return data.data;
}

export async function updateFacility(id: number, payload: { name?: string; icon?: string; category?: string }) {
  const { data } = await api.patch<ApiResponse<unknown>>(`/admin/facilities/${id}`, payload);
  return data.data;
}

export async function deleteFacility(id: number) {
  const { data } = await api.delete<ApiResponse<unknown>>(`/admin/facilities/${id}`);
  return data.data;
}

// List entities
export async function getPatients() {
  const { data } = await api.get<ApiResponse<unknown[]>>("/admin/patients");
  return data.data;
}

export async function getClinics() {
  const { data } = await api.get<ApiResponse<unknown[]>>("/admin/clinics");
  return data.data;
}

export async function getLabs() {
  const { data } = await api.get<ApiResponse<unknown[]>>("/admin/labs");
  return data.data;
}

export async function getPharmacies() {
  const { data } = await api.get<ApiResponse<unknown[]>>("/admin/pharmacies");
  return data.data;
}

export async function getDoctors() {
  const { data } = await api.get<ApiResponse<unknown[]>>("/admin/doctors");
  return data.data;
}

// Suspend
export async function suspendPatient(id: number) {
  const { data } = await api.post<ApiResponse<unknown>>(`/admin/patients/${id}/suspend`);
  return data.data;
}

export async function unsuspendPatient(id: number) {
  const { data } = await api.post<ApiResponse<unknown>>(`/admin/patients/${id}/unsuspend`);
  return data.data;
}

export async function suspendClinic(id: number) {
  const { data } = await api.post<ApiResponse<unknown>>(`/admin/clinics/${id}/suspend`);
  return data.data;
}

export async function unsuspendClinic(id: number) {
  const { data } = await api.post<ApiResponse<unknown>>(`/admin/clinics/${id}/unsuspend`);
  return data.data;
}

export async function suspendLab(id: number) {
  const { data } = await api.post<ApiResponse<unknown>>(`/admin/labs/${id}/suspend`);
  return data.data;
}

export async function unsuspendLab(id: number) {
  const { data } = await api.post<ApiResponse<unknown>>(`/admin/labs/${id}/unsuspend`);
  return data.data;
}

export async function suspendPharmacy(id: number) {
  const { data } = await api.post<ApiResponse<unknown>>(`/admin/pharmacies/${id}/suspend`);
  return data.data;
}

export async function unsuspendPharmacy(id: number) {
  const { data } = await api.post<ApiResponse<unknown>>(`/admin/pharmacies/${id}/unsuspend`);
  return data.data;
}

export async function suspendDoctor(id: number) {
  const { data } = await api.post<ApiResponse<unknown>>(`/admin/doctors/${id}/suspend`);
  return data.data;
}

export async function unsuspendDoctor(id: number) {
  const { data } = await api.post<ApiResponse<unknown>>(`/admin/doctors/${id}/unsuspend`);
  return data.data;
}
