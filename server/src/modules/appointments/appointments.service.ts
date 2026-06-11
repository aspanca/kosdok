import { db } from "../../config";
import { ApiError } from "../../utils";
import {
  sendBookingRequestEmail,
  sendBookingConfirmedEmail,
  sendBookingCancelledEmail,
} from "../../utils/email";
import {
  getProvider,
  getProviderDisplayName,
  getAvailableSlots,
} from "../providers/providers.service";
import type { CreateAppointmentInput, ClinicAppointmentsQuery } from "./appointments.validation";

const ACTIVE_STATUSES = ["pending", "confirmed"];

function toDateString(value: unknown): string {
  if (value instanceof Date) {
    const y = value.getFullYear();
    const m = String(value.getMonth() + 1).padStart(2, "0");
    const d = String(value.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }
  return String(value).slice(0, 10);
}

function mapAppointment(row: Record<string, unknown>) {
  return {
    id: row.id,
    patientId: row.patient_id,
    providerType: row.provider_type,
    providerId: row.provider_id,
    date: toDateString(row.date),
    time: String(row.time).slice(0, 5),
    reason: row.reason,
    notes: row.notes,
    status: row.status,
    cancelledBy: row.cancelled_by,
    createdAt: row.created_at,
  };
}

async function attachProviderInfo(appointments: Array<Record<string, unknown>>) {
  const clinicIds = [...new Set(appointments.filter((a) => a.provider_type === "clinic").map((a) => Number(a.provider_id)))];
  const doctorIds = [...new Set(appointments.filter((a) => a.provider_type === "doctor").map((a) => Number(a.provider_id)))];

  const clinics = clinicIds.length
    ? await db("clinics").whereIn("id", clinicIds).select("id", "name", "logo", "city", "address")
    : [];
  const doctors = doctorIds.length
    ? await db("doctors").whereIn("id", doctorIds).select("id", "first_name", "last_name", "specialty", "avatar", "city", "address")
    : [];

  const clinicMap = new Map(clinics.map((c) => [c.id, c]));
  const doctorMap = new Map(doctors.map((d) => [d.id, d]));

  return appointments.map((row) => {
    const base = mapAppointment(row);
    if (row.provider_type === "clinic") {
      const clinic = clinicMap.get(Number(row.provider_id));
      return {
        ...base,
        providerName: clinic?.name ?? "Klinikë e panjohur",
        specialty: null,
        image: clinic?.logo ?? null,
        city: clinic?.city ?? null,
        address: clinic?.address ?? null,
      };
    }
    const doctor = doctorMap.get(Number(row.provider_id));
    return {
      ...base,
      providerName: doctor ? `${doctor.first_name} ${doctor.last_name}` : "Doktor i panjohur",
      specialty: doctor?.specialty ?? null,
      image: doctor?.avatar ?? null,
      city: doctor?.city ?? null,
      address: doctor?.address ?? null,
    };
  });
}

export async function createAppointment(patientId: number, input: CreateAppointmentInput) {
  const provider = await getProvider(input.providerType, input.providerId);
  if (!provider) {
    throw ApiError.notFound(input.providerType === "clinic" ? "Klinika nuk u gjet" : "Doktori nuk u gjet");
  }

  const appointmentMoment = new Date(`${input.date}T${input.time}:00`);
  if (Number.isNaN(appointmentMoment.getTime()) || appointmentMoment <= new Date()) {
    throw ApiError.badRequest("Termini duhet të jetë në të ardhmen");
  }

  const slots = await getAvailableSlots(input.providerType, input.providerId, input.date);
  if (!slots.includes(input.time)) {
    throw ApiError.badRequest("Ky termin nuk është i lirë");
  }

  const id = await db.transaction(async (trx) => {
    const existing = await trx("appointments")
      .where({
        provider_type: input.providerType,
        provider_id: input.providerId,
        date: input.date,
        time: input.time,
      })
      .whereIn("status", ACTIVE_STATUSES)
      .forUpdate()
      .first();
    if (existing) throw ApiError.conflict("Ky termin sapo u zu, ju lutemi zgjidhni një tjetër");

    const [insertedId] = await trx("appointments").insert({
      patient_id: patientId,
      provider_type: input.providerType,
      provider_id: input.providerId,
      date: input.date,
      time: input.time,
      reason: input.reason,
      notes: input.notes || null,
      contact_phone: input.contactPhone || null,
      contact_email: input.contactEmail || null,
    });
    return insertedId;
  });

  const patient = await db("patients").where("id", patientId).first();
  const providerName = getProviderDisplayName(input.providerType, provider);
  if (provider.email && patient) {
    sendBookingRequestEmail(
      provider.email,
      providerName,
      `${patient.first_name} ${patient.last_name}`,
      input.date,
      input.time
    ).catch(console.error);
  }

  const row = await db("appointments").where("id", id).first();
  const [appointment] = await attachProviderInfo([row]);
  return appointment;
}

export async function listForPatient(patientId: number) {
  const rows = await db("appointments")
    .where("patient_id", patientId)
    .orderBy("date", "desc")
    .orderBy("time", "desc");
  return attachProviderInfo(rows);
}

export async function listForClinic(clinicId: number, query: ClinicAppointmentsQuery) {
  const builder = db("appointments")
    .join("patients", "patients.id", "appointments.patient_id")
    .where("appointments.provider_type", "clinic")
    .where("appointments.provider_id", clinicId)
    .select(
      "appointments.*",
      "patients.first_name as patient_first_name",
      "patients.last_name as patient_last_name",
      "patients.phone_number as patient_phone",
      "patients.email as patient_email",
      "patients.picture as patient_picture"
    )
    .orderBy("appointments.date", "desc")
    .orderBy("appointments.time", "asc");
  if (query.status) builder.where("appointments.status", query.status);
  if (query.date) builder.where("appointments.date", query.date);

  const rows = await builder;
  return rows.map((row) => ({
    ...mapAppointment(row),
    patientName: `${row.patient_first_name} ${row.patient_last_name}`,
    patientPhone: row.contact_phone || row.patient_phone,
    patientEmail: row.contact_email || row.patient_email,
    patientPicture: row.patient_picture,
  }));
}

export async function listClinicPatients(clinicId: number) {
  const rows = await db("appointments")
    .join("patients", "patients.id", "appointments.patient_id")
    .where("appointments.provider_type", "clinic")
    .where("appointments.provider_id", clinicId)
    .groupBy("patients.id", "patients.first_name", "patients.last_name", "patients.email", "patients.phone_number", "patients.picture", "patients.city")
    .select(
      "patients.id",
      "patients.first_name",
      "patients.last_name",
      "patients.email",
      "patients.phone_number",
      "patients.picture",
      "patients.city"
    )
    .count("appointments.id as appointment_count")
    .max("appointments.date as last_appointment");

  return rows.map((row) => ({
    id: row.id,
    name: `${row.first_name} ${row.last_name}`,
    email: row.email,
    phone: row.phone_number,
    picture: row.picture,
    city: row.city,
    appointmentCount: Number(row.appointment_count),
    lastAppointment: toDateString(row.last_appointment),
  }));
}

async function getAppointmentOrFail(id: number) {
  const appointment = await db("appointments").where("id", id).first();
  if (!appointment) throw ApiError.notFound("Takimi nuk u gjet");
  return appointment;
}

async function notifyPatient(
  appointment: Record<string, unknown>,
  send: (to: string, patientName: string, providerName: string, date: string, time: string) => Promise<void>
) {
  const patient = await db("patients").where("id", Number(appointment.patient_id)).first();
  if (!patient) return;
  const provider = await getProvider(
    appointment.provider_type as "clinic" | "doctor",
    Number(appointment.provider_id)
  );
  const providerName = provider
    ? getProviderDisplayName(appointment.provider_type as "clinic" | "doctor", provider)
    : "Kosdok";
  const to = String(appointment.contact_email || patient.email);
  send(to, `${patient.first_name} ${patient.last_name}`, providerName, toDateString(appointment.date), String(appointment.time).slice(0, 5)).catch(
    console.error
  );
}

export async function cancelAppointment(id: number, user: { id: number; type: string }) {
  const appointment = await getAppointmentOrFail(id);

  if (user.type === "patient") {
    if (appointment.patient_id !== user.id) throw ApiError.forbidden("Nuk keni qasje në këtë takim");
  } else if (user.type === "clinic") {
    if (appointment.provider_type !== "clinic" || appointment.provider_id !== user.id) {
      throw ApiError.forbidden("Nuk keni qasje në këtë takim");
    }
  } else {
    throw ApiError.forbidden("Nuk keni qasje në këtë takim");
  }

  if (!ACTIVE_STATUSES.includes(appointment.status)) {
    throw ApiError.badRequest("Ky takim nuk mund të anulohet");
  }

  await db("appointments").where("id", id).update({ status: "cancelled", cancelled_by: user.type });

  if (user.type === "clinic") {
    await notifyPatient(appointment, sendBookingCancelledEmail);
  }

  return mapAppointment(await getAppointmentOrFail(id));
}

export async function confirmAppointment(id: number, clinicId: number) {
  const appointment = await getAppointmentOrFail(id);
  if (appointment.provider_type !== "clinic" || appointment.provider_id !== clinicId) {
    throw ApiError.forbidden("Nuk keni qasje në këtë takim");
  }
  if (appointment.status !== "pending") {
    throw ApiError.badRequest("Vetëm takimet në pritje mund të konfirmohen");
  }

  await db("appointments").where("id", id).update({ status: "confirmed" });
  await notifyPatient(appointment, sendBookingConfirmedEmail);

  return mapAppointment(await getAppointmentOrFail(id));
}

export async function completeAppointment(id: number, clinicId: number) {
  const appointment = await getAppointmentOrFail(id);
  if (appointment.provider_type !== "clinic" || appointment.provider_id !== clinicId) {
    throw ApiError.forbidden("Nuk keni qasje në këtë takim");
  }
  if (appointment.status !== "confirmed") {
    throw ApiError.badRequest("Vetëm takimet e konfirmuara mund të përfundohen");
  }

  await db("appointments").where("id", id).update({ status: "completed" });
  return mapAppointment(await getAppointmentOrFail(id));
}
