import { z } from "zod";

const scheduleDaySchema = z.object({
  open: z.string().optional(),
  close: z.string().optional(),
  closed: z.boolean().optional(),
});

const locationSchema = z.object({
  id: z.number().optional(),
  name: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  lat: z.number().nullable().optional(),
  lng: z.number().nullable().optional(),
  phone: z.string().optional(),
});

export const clinicProfileSchema = z
  .object({
    clinicName: z.string().min(2).optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    website: z.union([z.string().url(), z.literal("")]).optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    description: z.string().optional(),
    instagram: z.string().optional(),
    facebook: z.string().optional(),
    linkedin: z.string().optional(),
    pictures: z.array(z.string().url()).optional(),
    schedule: z.record(z.string(), scheduleDaySchema).optional(),
    serviceIds: z.array(z.number()).optional(),
    facilityIds: z.array(z.number()).optional(),
    locations: z.array(locationSchema).optional(),
  });

export type ClinicProfileInput = z.infer<typeof clinicProfileSchema>;
