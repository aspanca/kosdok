import { db } from "../../config";
import { ApiError } from "../../utils";
import { getClinicProfile } from "../clinic/clinic.service";
import type { ProviderType, SearchQuery } from "./providers.validation";

const DAY_KEYS = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

const DOCTOR_DEFAULT = { open: "08:00", close: "17:00", slotMinutes: 60 };

type ScheduleDay = { open?: string; close?: string; closed?: boolean };

function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function parseSchedule(schedule: unknown): Record<string, ScheduleDay> {
  if (schedule && typeof schedule === "object") return schedule as Record<string, ScheduleDay>;
  if (typeof schedule === "string") {
    try {
      return JSON.parse(schedule || "{}");
    } catch {
      return {};
    }
  }
  return {};
}

async function getReviewSummaries(type: ProviderType, ids: number[]) {
  if (ids.length === 0) return new Map<number, { rating: number; reviewCount: number }>();
  const rows = await db("reviews")
    .where("provider_type", type)
    .whereIn("provider_id", ids)
    .groupBy("provider_id")
    .select("provider_id")
    .avg("rating as avg_rating")
    .count("* as review_count");
  return new Map(
    rows.map((r) => [
      Number(r.provider_id),
      { rating: Math.round(Number(r.avg_rating) * 10) / 10, reviewCount: Number(r.review_count) },
    ])
  );
}

export async function searchProviders(query: SearchQuery) {
  const { type, q, city, serviceId } = query;
  const results: Array<Record<string, unknown>> = [];

  if (!type || type === "clinic") {
    const clinicQuery = db("clinics")
      .whereNull("suspended_at")
      .select("id", "name", "city", "address", "phone", "logo", "description")
      .orderBy("name")
      .limit(50);
    if (city) clinicQuery.where("city", city);
    if (serviceId) {
      clinicQuery.whereIn("id", db("clinic_services").where("service_id", serviceId).select("clinic_id"));
    }
    if (q) {
      clinicQuery.where((builder) => {
        builder
          .where("name", "like", `%${q}%`)
          .orWhereIn(
            "clinics.id",
            db("clinic_services")
              .join("services", "services.id", "clinic_services.service_id")
              .where("services.name", "like", `%${q}%`)
              .select("clinic_services.clinic_id")
          );
      });
    }
    const clinics = await clinicQuery;
    const summaries = await getReviewSummaries("clinic", clinics.map((c) => c.id));
    for (const clinic of clinics) {
      results.push({
        id: clinic.id,
        type: "clinic",
        name: clinic.name,
        specialty: null,
        city: clinic.city,
        address: clinic.address,
        phone: clinic.phone,
        image: clinic.logo,
        description: clinic.description,
        rating: summaries.get(clinic.id)?.rating ?? null,
        reviewCount: summaries.get(clinic.id)?.reviewCount ?? 0,
      });
    }
  }

  if ((!type || type === "doctor") && !serviceId) {
    const doctorQuery = db("doctors")
      .whereNull("suspended_at")
      .select("id", "first_name", "last_name", "specialty", "city", "address", "phone", "avatar", "bio")
      .orderBy("last_name")
      .limit(50);
    if (city) doctorQuery.where("city", city);
    if (q) {
      doctorQuery.where((builder) => {
        builder
          .where("first_name", "like", `%${q}%`)
          .orWhere("last_name", "like", `%${q}%`)
          .orWhere("specialty", "like", `%${q}%`)
          .orWhereRaw("CONCAT(first_name, ' ', last_name) LIKE ?", [`%${q}%`]);
      });
    }
    const doctors = await doctorQuery;
    const summaries = await getReviewSummaries("doctor", doctors.map((d) => d.id));
    for (const doctor of doctors) {
      results.push({
        id: doctor.id,
        type: "doctor",
        name: `${doctor.first_name} ${doctor.last_name}`,
        specialty: doctor.specialty,
        city: doctor.city,
        address: doctor.address,
        phone: doctor.phone,
        image: doctor.avatar,
        description: doctor.bio,
        rating: summaries.get(doctor.id)?.rating ?? null,
        reviewCount: summaries.get(doctor.id)?.reviewCount ?? 0,
      });
    }
  }

  return results.slice(0, 50);
}

export async function getClinicPublicProfile(clinicId: number) {
  const clinic = await db("clinics").where("id", clinicId).whereNull("suspended_at").first();
  if (!clinic) throw ApiError.notFound("Klinika nuk u gjet");

  const profile = await getClinicProfile(clinicId);
  const summaries = await getReviewSummaries("clinic", [clinicId]);
  return {
    ...profile,
    slotDurationMinutes: clinic.slot_duration_minutes || 60,
    reviewsSummary: summaries.get(clinicId) ?? { rating: null, reviewCount: 0 },
  };
}

export async function getDoctorPublicProfile(doctorId: number) {
  const doctor = await db("doctors").where("id", doctorId).whereNull("suspended_at").first();
  if (!doctor) throw ApiError.notFound("Doktori nuk u gjet");

  const { password_hash, ...safe } = doctor;
  const summaries = await getReviewSummaries("doctor", [doctorId]);
  return {
    ...safe,
    reviewsSummary: summaries.get(doctorId) ?? { rating: null, reviewCount: 0 },
  };
}

export async function getProvider(type: ProviderType, id: number) {
  const table = type === "clinic" ? "clinics" : "doctors";
  return db(table).where("id", id).whereNull("suspended_at").first();
}

export function getProviderDisplayName(type: ProviderType, provider: Record<string, unknown>): string {
  return type === "clinic"
    ? String(provider.name ?? "")
    : `${provider.first_name} ${provider.last_name}`;
}

export async function getAvailableSlots(type: ProviderType, id: number, date: string): Promise<string[]> {
  const provider = await getProvider(type, id);
  if (!provider) {
    throw ApiError.notFound(type === "clinic" ? "Klinika nuk u gjet" : "Doktori nuk u gjet");
  }

  const dayKey = DAY_KEYS[new Date(`${date}T00:00:00`).getDay()];

  let open: string | undefined;
  let close: string | undefined;
  let slotMinutes: number;

  if (type === "clinic") {
    const day = parseSchedule(provider.schedule)[dayKey];
    if (!day || day.closed || !day.open || !day.close) return [];
    open = day.open;
    close = day.close;
    slotMinutes = Number(provider.slot_duration_minutes) || 60;
  } else {
    if (dayKey === "sunday") return [];
    open = DOCTOR_DEFAULT.open;
    close = DOCTOR_DEFAULT.close;
    slotMinutes = DOCTOR_DEFAULT.slotMinutes;
  }

  const openMin = timeToMinutes(open);
  const closeMin = timeToMinutes(close);
  if (!Number.isFinite(openMin) || !Number.isFinite(closeMin) || closeMin <= openMin) return [];

  const slots: string[] = [];
  for (let m = openMin; m + slotMinutes <= closeMin; m += slotMinutes) {
    slots.push(minutesToTime(m));
  }

  const booked = await db("appointments")
    .where({ provider_type: type, provider_id: id, date })
    .whereIn("status", ["pending", "confirmed"])
    .select("time");
  const taken = new Set(booked.map((b) => String(b.time).slice(0, 5)));

  const now = new Date();
  const isToday = date === now.toISOString().slice(0, 10);
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  return slots.filter((slot) => !taken.has(slot) && (!isToday || timeToMinutes(slot) > nowMinutes));
}
