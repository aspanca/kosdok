import { z } from "zod";

export const createReviewSchema = z.object({
  providerType: z.enum(["clinic", "doctor"]),
  providerId: z.number().int().positive(),
  rating: z.number().int().min(1, "Vlerësimi duhet të jetë 1-5").max(5, "Vlerësimi duhet të jetë 1-5"),
  comment: z.string().trim().min(1, "Komenti është i detyrueshëm").max(2000),
});

export const updateReviewSchema = z.object({
  rating: z.number().int().min(1).max(5).optional(),
  comment: z.string().trim().min(1).max(2000).optional(),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type UpdateReviewInput = z.infer<typeof updateReviewSchema>;
