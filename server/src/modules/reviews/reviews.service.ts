import { db } from "../../config";
import { ApiError } from "../../utils";
import { getProvider } from "../providers/providers.service";
import type { CreateReviewInput, UpdateReviewInput } from "./reviews.validation";

type ProviderType = "clinic" | "doctor";

function displayName(firstName: string, lastName: string): string {
  return lastName ? `${firstName} ${lastName.charAt(0)}.` : firstName;
}

function mapReview(row: Record<string, unknown>) {
  return {
    id: row.id,
    providerType: row.provider_type,
    providerId: row.provider_id,
    rating: Number(row.rating),
    comment: row.comment,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function listForProvider(providerType: ProviderType, providerId: number) {
  const rows = await db("reviews")
    .join("patients", "patients.id", "reviews.patient_id")
    .where("reviews.provider_type", providerType)
    .where("reviews.provider_id", providerId)
    .select(
      "reviews.*",
      "patients.first_name as patient_first_name",
      "patients.last_name as patient_last_name",
      "patients.picture as patient_picture"
    )
    .orderBy("reviews.created_at", "desc");

  const reviews = rows.map((row) => ({
    ...mapReview(row),
    patientName: displayName(row.patient_first_name, row.patient_last_name),
    patientPicture: row.patient_picture,
  }));

  const count = reviews.length;
  const avg = count ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / count) * 10) / 10 : null;

  return { reviews, summary: { rating: avg, reviewCount: count } };
}

export async function createReview(patientId: number, input: CreateReviewInput) {
  const provider = await getProvider(input.providerType, input.providerId);
  if (!provider) {
    throw ApiError.notFound(input.providerType === "clinic" ? "Klinika nuk u gjet" : "Doktori nuk u gjet");
  }

  const existing = await db("reviews")
    .where({ patient_id: patientId, provider_type: input.providerType, provider_id: input.providerId })
    .first();
  if (existing) throw ApiError.conflict("Ju keni lënë tashmë një vlerësim për këtë ofrues");

  const [id] = await db("reviews").insert({
    patient_id: patientId,
    provider_type: input.providerType,
    provider_id: input.providerId,
    rating: input.rating,
    comment: input.comment,
  });

  const row = await db("reviews").where("id", id).first();
  return mapReview(row);
}

export async function listForPatient(patientId: number) {
  const rows = await db("reviews").where("patient_id", patientId).orderBy("created_at", "desc");

  const clinicIds = [...new Set(rows.filter((r) => r.provider_type === "clinic").map((r) => r.provider_id))];
  const doctorIds = [...new Set(rows.filter((r) => r.provider_type === "doctor").map((r) => r.provider_id))];

  const clinics = clinicIds.length ? await db("clinics").whereIn("id", clinicIds).select("id", "name", "logo") : [];
  const doctors = doctorIds.length
    ? await db("doctors").whereIn("id", doctorIds).select("id", "first_name", "last_name", "specialty", "avatar")
    : [];

  const clinicMap = new Map(clinics.map((c) => [c.id, c]));
  const doctorMap = new Map(doctors.map((d) => [d.id, d]));

  return rows.map((row) => {
    const base = mapReview(row);
    if (row.provider_type === "clinic") {
      const clinic = clinicMap.get(row.provider_id);
      return {
        ...base,
        providerName: clinic?.name ?? "Klinikë e panjohur",
        specialty: null,
        image: clinic?.logo ?? null,
      };
    }
    const doctor = doctorMap.get(row.provider_id);
    return {
      ...base,
      providerName: doctor ? `${doctor.first_name} ${doctor.last_name}` : "Doktor i panjohur",
      specialty: doctor?.specialty ?? null,
      image: doctor?.avatar ?? null,
    };
  });
}

async function getOwnReviewOrFail(id: number, patientId: number) {
  const review = await db("reviews").where("id", id).first();
  if (!review) throw ApiError.notFound("Vlerësimi nuk u gjet");
  if (review.patient_id !== patientId) throw ApiError.forbidden("Nuk keni qasje në këtë vlerësim");
  return review;
}

export async function updateReview(id: number, patientId: number, input: UpdateReviewInput) {
  await getOwnReviewOrFail(id, patientId);

  const updates: Record<string, unknown> = {};
  if (input.rating !== undefined) updates.rating = input.rating;
  if (input.comment !== undefined) updates.comment = input.comment;
  if (Object.keys(updates).length > 0) {
    await db("reviews").where("id", id).update(updates);
  }

  return mapReview(await db("reviews").where("id", id).first());
}

export async function deleteReview(id: number, patientId: number) {
  await getOwnReviewOrFail(id, patientId);
  await db("reviews").where("id", id).del();
}
