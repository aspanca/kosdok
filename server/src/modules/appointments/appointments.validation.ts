import { z } from "zod";

export const createAppointmentSchema = z.object({
  providerType: z.enum(["clinic", "doctor"]),
  providerId: z.number().int().positive(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data duhet të jetë në formatin YYYY-MM-DD"),
  time: z.string().regex(/^\d{2}:\d{2}$/, "Ora duhet të jetë në formatin HH:MM"),
  reason: z.string().trim().min(1, "Arsyeja është e detyrueshme").max(50),
  notes: z.string().trim().max(1000).optional(),
  contactPhone: z.string().trim().max(30).optional(),
  contactEmail: z.union([z.string().email("Email-i nuk është valid"), z.literal("")]).optional(),
});

export const clinicAppointmentsQuerySchema = z.object({
  status: z.enum(["pending", "confirmed", "cancelled", "completed"]).optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
});

export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>;
export type ClinicAppointmentsQuery = z.infer<typeof clinicAppointmentsQuerySchema>;
