import { z } from "zod";

export const patientRegisterSchema = z.object({
  firstName: z.string().min(2, "Emri duhet të ketë të paktën 2 karaktere"),
  lastName: z.string().min(2, "Mbiemri duhet të ketë të paktën 2 karaktere"),
  email: z.string().email("Email-i nuk është valid"),
  phone: z.string().min(9, "Numri i telefonit nuk është valid").optional().or(z.literal("")),
  city: z.string().min(2, "Qyteti është i detyrueshëm").optional().or(z.literal("")),
  dateOfBirth: z.string().optional().or(z.literal("")),
  gender: z.enum(["male", "female", "other"]).optional(),
  password: z.string().min(8, "Fjalëkalimi duhet të ketë të paktën 8 karaktere"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Fjalëkalimet nuk përputhen",
  path: ["confirmPassword"],
});

export const clinicRegisterSchema = z.object({
  clinicName: z.string().min(2, "Emri i klinikës duhet të ketë të paktën 2 karaktere"),
  email: z.string().email("Email-i nuk është valid"),
  phone: z.string().min(9, "Numri i telefonit nuk është valid"),
  city: z.string().min(2, "Qyteti është i detyrueshëm"),
  password: z.string().min(8, "Fjalëkalimi duhet të ketë të paktën 8 karaktere"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Fjalëkalimet nuk përputhen",
  path: ["confirmPassword"],
});

export const loginSchema = z.object({
  email: z.string().email("Email-i nuk është valid"),
  password: z.string().min(1, "Fjalëkalimi është i detyrueshëm"),
});

export const updateProfileSchema = z.object({
  firstName: z.string().min(2).optional(),
  lastName: z.string().min(2).optional(),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.enum(["male", "female"]).optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  picture: z.union([z.string().url(), z.literal("")]).optional(),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Fjalëkalimi aktual është i detyrueshëm"),
    newPassword: z.string().min(8, "Fjalëkalimi i ri duhet të ketë të paktën 8 karaktere"),
    confirmPassword: z.string().min(1, "Përsëritni fjalëkalimin e ri"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Fjalëkalimet e rinj nuk përputhen",
    path: ["confirmPassword"],
  });

export type PatientRegisterInput = z.infer<typeof patientRegisterSchema>;
export type ClinicRegisterInput = z.infer<typeof clinicRegisterSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
