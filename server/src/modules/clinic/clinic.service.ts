import { db } from "../../config";
import { ApiError } from "../../utils";

function sanitizeClinic(user: Record<string, unknown>) {
  const { password_hash, ...safe } = user;
  return safe;
}

export async function getServices() {
  const rows = await db("services").select("id", "name", "category", "icon").orderBy("category").orderBy("name");
  return rows;
}

export async function getFacilities() {
  const rows = await db("facilities").select("id", "name", "icon", "category").orderBy("category").orderBy("name");
  return rows;
}

export async function getClinicProfile(clinicId: number) {
  const clinic = await db("clinics").where("id", clinicId).first();
  if (!clinic) throw ApiError.notFound("Clinic not found");

  const serviceIds = await db("clinic_services")
    .where("clinic_id", clinicId)
    .select("service_id")
    .then((rows) => rows.map((r) => r.service_id));

  const facilityIds = await db("clinic_facilities")
    .where("clinic_id", clinicId)
    .select("facility_id")
    .then((rows) => rows.map((r) => r.facility_id));

  const locations = await db("clinic_locations")
    .where("clinic_id", clinicId)
    .select("id", "name", "address", "city", "lat", "lng", "phone");

  const profile = sanitizeClinic(clinic) as Record<string, unknown>;
  profile.clinic_name = clinic.name;
  profile.pictures = parsePictures(clinic.pictures);
  profile.schedule =
    typeof clinic.schedule === "string"
      ? (() => {
          try {
            return JSON.parse(clinic.schedule || "{}");
          } catch {
            return {};
          }
        })()
      : clinic.schedule || {};
  return {
    ...profile,
    serviceIds,
    facilityIds,
    locations: locations.map((loc) => ({
      ...loc,
      lat: loc.lat != null ? Number(loc.lat) : null,
      lng: loc.lng != null ? Number(loc.lng) : null,
    })),
  };
}

export async function updateClinicProfile(clinicId: number, input: Record<string, unknown>) {
  const clinic = await db("clinics").where("id", clinicId).first();
  if (!clinic) throw ApiError.notFound("Clinic not found");

  const updates: Record<string, unknown> = {};
  if (input.clinicName !== undefined) updates.name = input.clinicName;
  if (input.email !== undefined) updates.email = input.email;
  if (input.phone !== undefined) updates.phone = input.phone;
  if (input.website !== undefined) updates.website = input.website === "" ? null : input.website;
  if (input.address !== undefined) updates.address = input.address;
  if (input.city !== undefined) updates.city = input.city;
  if (input.description !== undefined) updates.description = input.description;
  if (input.instagram !== undefined) updates.instagram = input.instagram === "" ? null : input.instagram;
  if (input.facebook !== undefined) updates.facebook = input.facebook === "" ? null : input.facebook;
  if (input.linkedin !== undefined) updates.linkedin = input.linkedin === "" ? null : input.linkedin;
  if (input.pictures !== undefined) updates.pictures = JSON.stringify(input.pictures);
  if (input.schedule !== undefined) updates.schedule = JSON.stringify(input.schedule);

  if (Object.keys(updates).length > 0) {
    await db("clinics").where("id", clinicId).update(updates);
  }

  if (Array.isArray(input.serviceIds)) {
    await db("clinic_services").where("clinic_id", clinicId).del();
    if (input.serviceIds.length > 0) {
      const ids = [...new Set((input.serviceIds as number[]).map(Number).filter((id) => id > 0))];
      const validIds = await db("services").whereIn("id", ids).select("id").then((rows) => rows.map((r) => r.id));
      if (validIds.length > 0) {
        await db("clinic_services").insert(
          validIds.map((serviceId) => ({
            clinic_id: clinicId,
            service_id: serviceId,
          }))
        );
      }
    }
  }

  if (Array.isArray(input.facilityIds)) {
    await db("clinic_facilities").where("clinic_id", clinicId).del();
    if (input.facilityIds.length > 0) {
      const ids = [...new Set((input.facilityIds as number[]).map(Number).filter((id) => id > 0))];
      const validIds = await db("facilities").whereIn("id", ids).select("id").then((rows) => rows.map((r) => r.id));
      if (validIds.length > 0) {
        await db("clinic_facilities").insert(
          validIds.map((facilityId) => ({
            clinic_id: clinicId,
            facility_id: facilityId,
          }))
        );
      }
    }
  }

  if (Array.isArray(input.locations)) {
    await db("clinic_locations").where("clinic_id", clinicId).del();
    for (const loc of input.locations as Array<Record<string, unknown>>) {
      if (loc.address || loc.name || loc.city) {
        await db("clinic_locations").insert({
          clinic_id: clinicId,
          name: loc.name || null,
          address: loc.address || null,
          city: loc.city || null,
          lat: loc.lat ?? null,
          lng: loc.lng ?? null,
          phone: loc.phone || null,
        });
      }
    }
  }

  return getClinicProfile(clinicId);
}

function parsePictures(pictures: unknown): string[] {
  if (Array.isArray(pictures)) return pictures.filter((p) => typeof p === "string");
  if (typeof pictures === "string") {
    try {
      const parsed = JSON.parse(pictures);
      return Array.isArray(parsed) ? parsed.filter((p: unknown) => typeof p === "string") : [];
    } catch {
      return [];
    }
  }
  return [];
}

export async function uploadClinicPicture(clinicId: number, url: string) {
  const clinic = await db("clinics").where("id", clinicId).first();
  if (!clinic) throw ApiError.notFound("Clinic not found");

  const pictures = parsePictures(clinic.pictures);
  pictures.push(url);

  await db("clinics").where("id", clinicId).update({ pictures: JSON.stringify(pictures) });
  return getClinicProfile(clinicId);
}

export async function uploadClinicLogo(clinicId: number, url: string) {
  const clinic = await db("clinics").where("id", clinicId).first();
  if (!clinic) throw ApiError.notFound("Clinic not found");

  await db("clinics").where("id", clinicId).update({ logo: url });
  return getClinicProfile(clinicId);
}
