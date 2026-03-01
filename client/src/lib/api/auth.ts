import { api } from "../axios";
import { mapRawUserToUser } from "../user-mapper";
import type {
  ApiResponse,
  RawUser,
  User,
  AuthUserResponse,
  PatientRegisterPayload,
  ClinicRegisterPayload,
  LoginPayload,
  UpdateProfilePayload,
  ChangePasswordPayload,
  AuthTokens,
} from "../types";

export async function registerPatient(payload: PatientRegisterPayload): Promise<AuthUserResponse> {
  const { data } = await api.post<ApiResponse<AuthUserResponse>>("/auth/register/patient", payload);
  return data.data;
}

export async function registerClinic(payload: ClinicRegisterPayload): Promise<AuthUserResponse> {
  const { data } = await api.post<ApiResponse<AuthUserResponse>>("/auth/register/clinic", payload);
  return data.data;
}

export async function login(payload: LoginPayload): Promise<AuthUserResponse> {
  const { data } = await api.post<ApiResponse<AuthUserResponse>>("/auth/login", payload);
  return data.data;
}

export async function verifyEmail(token: string): Promise<AuthUserResponse> {
  const { data } = await api.get<ApiResponse<AuthUserResponse>>(
    `/auth/verify-email?token=${encodeURIComponent(token)}`
  );
  return data.data;
}

export async function getMe(): Promise<User> {
  const { data } = await api.get<ApiResponse<RawUser>>("/auth/me");
  return mapRawUserToUser(data.data);
}

export async function updateProfile(payload: UpdateProfilePayload): Promise<User> {
  const { data } = await api.patch<ApiResponse<RawUser>>("/auth/me", payload);
  return mapRawUserToUser(data.data);
}

export async function uploadProfilePicture(file: File): Promise<User> {
  const formData = new FormData();
  formData.append("picture", file);
  const { data } = await api.post<ApiResponse<RawUser>>("/auth/me/picture", formData);
  return mapRawUserToUser(data.data);
}

export async function changePassword(payload: ChangePasswordPayload): Promise<{ message: string }> {
  const { data } = await api.patch<ApiResponse<{ message: string }>>("/auth/me/password", payload);
  return data.data;
}

export async function refreshTokens(): Promise<AuthTokens> {
  const refreshToken = localStorage.getItem("kosdok_refresh_token");
  if (!refreshToken) throw new Error("No refresh token");
  const { data } = await api.post<ApiResponse<AuthTokens>>("/auth/refresh", { refreshToken });
  return data.data;
}
