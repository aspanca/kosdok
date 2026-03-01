// API response wrapper
export type ApiResponse<T> = {
  success: boolean;
  data: T;
};

export type ApiError = {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
};

// Cities
export type City = {
  id: number;
  name: string;
  postcode: string;
};

// Raw API responses (snake_case from backend)
export type RawPatient = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  picture?: string | null;
  phone_number?: string | null;
  date_of_birth?: string | null;
  gender?: string | null;
  address?: string | null;
  city?: string | null;
  email_verified_at?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type RawClinic = {
  id: number;
  email: string;
  type: "clinic";
  clinic_name: string;
  logo?: string | null;
  avatar?: string | null;
  website?: string | null;
  description?: string | null;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  instagram?: string | null;
  facebook?: string | null;
  linkedin?: string | null;
  pictures?: string[] | string | null;
  schedule?: Record<string, { open?: string; close?: string; closed?: boolean }> | string | null;
  created_at?: string;
  updated_at?: string;
};

export type RawUser = RawPatient | RawClinic;

// Mapped user types (camelCase for frontend)
export type UserType = "patient" | "clinic";

export type PatientUser = {
  id: string;
  type: "patient";
  email: string;
  firstName: string;
  lastName: string;
  picture?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  city?: string;
};

export type ClinicUser = {
  id: string;
  type: "clinic";
  email: string;
  clinicName: string;
  avatar?: string;
  logo?: string;
  website?: string;
  description?: string;
  phone?: string;
  address?: string;
  city?: string;
  instagram?: string;
  facebook?: string;
  linkedin?: string;
  pictures?: string[];
  schedule?: Record<string, { open?: string; close?: string; closed?: boolean }>;
};

export type User = PatientUser | ClinicUser;

// Auth payloads
export type PatientRegisterPayload = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  city?: string;
  dateOfBirth?: string;
  gender?: "male" | "female" | "other";
  password: string;
  confirmPassword: string;
};

export type ClinicRegisterPayload = {
  clinicName: string;
  email: string;
  phone: string;
  city: string;
  password: string;
  confirmPassword: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type UpdateProfilePayload = {
  firstName?: string;
  lastName?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: "male" | "female";
  address?: string;
  city?: string;
  picture?: string;
};

export type ChangePasswordPayload = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

// Auth API responses
export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export type AuthUserResponse = {
  user: RawUser;
  message?: string;
} & Partial<AuthTokens>;
