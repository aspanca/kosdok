import { z } from "zod";

export const providerTypeSchema = z.enum(["clinic", "doctor"]);

export const searchQuerySchema = z.object({
  type: providerTypeSchema.optional(),
  q: z.string().trim().max(100).optional(),
  city: z.string().trim().max(100).optional(),
  serviceId: z.coerce.number().int().positive().optional(),
});

export const slotsQuerySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data duhet të jetë në formatin YYYY-MM-DD"),
});

export type ProviderType = z.infer<typeof providerTypeSchema>;
export type SearchQuery = z.infer<typeof searchQuerySchema>;
