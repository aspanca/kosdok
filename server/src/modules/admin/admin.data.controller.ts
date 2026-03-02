import { Request, Response, NextFunction } from "express";
import { db } from "../../config";
import { ApiError } from "../../utils";

function handle(fn: (req: Request) => Promise<unknown>) {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req).then((data) => res.json({ success: true, data })).catch(next);
  };
}

// Cities
export const listCities = handle(async () =>
  db("cities").select("id", "name", "postcode").orderBy("name")
);

export const createCity = handle(async (req: Request) => {
  const { name, postcode } = req.body;
  if (!name || !postcode) throw ApiError.badRequest("Emri dhe postkodi janë të detyrueshëm");
  const [id] = await db("cities").insert({ name, postcode });
  return db("cities").where("id", id).first();
});

export const updateCity = handle(async (req: Request) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) throw ApiError.badRequest("ID invalid");
  const { name, postcode } = req.body;
  const updates: Record<string, unknown> = {};
  if (name !== undefined) updates.name = name;
  if (postcode !== undefined) updates.postcode = postcode;
  if (Object.keys(updates).length === 0) throw ApiError.badRequest("Asnjë fushë për përditësim");
  await db("cities").where("id", id).update(updates);
  const row = await db("cities").where("id", id).first();
  if (!row) throw ApiError.notFound("Qyteti nuk u gjet");
  return row;
});

export const deleteCity = handle(async (req: Request) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) throw ApiError.badRequest("ID invalid");
  const deleted = await db("cities").where("id", id).del();
  if (!deleted) throw ApiError.notFound("Qyteti nuk u gjet");
  return { message: "U fshi" };
});

// Services
export const listServices = handle(async () =>
  db("services").select("id", "name", "category", "icon").orderBy("category").orderBy("name")
);

export const createService = handle(async (req: Request) => {
  const { name, category, icon } = req.body;
  if (!name) throw ApiError.badRequest("Emri është i detyrueshëm");
  const [id] = await db("services").insert({ name, category: category || null, icon: icon || null });
  return db("services").where("id", id).first();
});

export const updateService = handle(async (req: Request) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) throw ApiError.badRequest("ID invalid");
  const { name, category, icon } = req.body;
  const updates: Record<string, unknown> = {};
  if (name !== undefined) updates.name = name;
  if (category !== undefined) updates.category = category;
  if (icon !== undefined) updates.icon = icon;
  if (Object.keys(updates).length === 0) throw ApiError.badRequest("Asnjë fushë për përditësim");
  await db("services").where("id", id).update(updates);
  const row = await db("services").where("id", id).first();
  if (!row) throw ApiError.notFound("Shërbimi nuk u gjet");
  return row;
});

export const deleteService = handle(async (req: Request) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) throw ApiError.badRequest("ID invalid");
  const deleted = await db("services").where("id", id).del();
  if (!deleted) throw ApiError.notFound("Shërbimi nuk u gjet");
  return { message: "U fshi" };
});

// Facilities
export const listFacilities = handle(async () =>
  db("facilities").select("id", "name", "icon", "category").orderBy("category").orderBy("name")
);

export const createFacility = handle(async (req: Request) => {
  const { name, icon, category } = req.body;
  if (!name) throw ApiError.badRequest("Emri është i detyrueshëm");
  const [id] = await db("facilities").insert({ name, icon: icon || null, category: category || null });
  return db("facilities").where("id", id).first();
});

export const updateFacility = handle(async (req: Request) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) throw ApiError.badRequest("ID invalid");
  const { name, icon, category } = req.body;
  const updates: Record<string, unknown> = {};
  if (name !== undefined) updates.name = name;
  if (icon !== undefined) updates.icon = icon;
  if (category !== undefined) updates.category = category;
  if (Object.keys(updates).length === 0) throw ApiError.badRequest("Asnjë fushë për përditësim");
  await db("facilities").where("id", id).update(updates);
  const row = await db("facilities").where("id", id).first();
  if (!row) throw ApiError.notFound("Lehtësira nuk u gjet");
  return row;
});

export const deleteFacility = handle(async (req: Request) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) throw ApiError.badRequest("ID invalid");
  const deleted = await db("facilities").where("id", id).del();
  if (!deleted) throw ApiError.notFound("Lehtësira nuk u gjet");
  return { message: "U fshi" };
});

// List entities (no password_hash)
export const listPatients = handle(async () => {
  const rows = await db("patients")
    .select("id", "first_name", "last_name", "email", "phone_number", "city", "email_verified_at", "suspended_at", "created_at")
    .orderBy("created_at", "desc");
  return rows;
});

export const listClinics = handle(async () => {
  const rows = await db("clinics")
    .select("id", "name", "email", "phone", "address", "city", "website", "suspended_at", "created_at")
    .orderBy("created_at", "desc");
  return rows;
});

export const listLabs = handle(async () => {
  return db("labs")
    .select("id", "name", "email", "phone", "address", "city", "website", "suspended_at", "created_at")
    .orderBy("created_at", "desc");
});

export const listPharmacies = handle(async () => {
  return db("pharmacies")
    .select("id", "name", "email", "phone", "address", "city", "website", "suspended_at", "created_at")
    .orderBy("created_at", "desc");
});

export const listDoctors = handle(async () => {
  return db("doctors")
    .select("id", "first_name", "last_name", "email", "phone", "specialty", "city", "suspended_at", "created_at")
    .orderBy("created_at", "desc");
});

// Suspend
function suspendTable(table: string, id: number) {
  return db(table).where("id", id).update({ suspended_at: db.fn.now() });
}

function unsuspendTable(table: string, id: number) {
  return db(table).where("id", id).update({ suspended_at: null });
}

async function suspendHandler(table: string, req: Request) {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) throw ApiError.badRequest("ID invalid");
  const updated = await suspendTable(table, id);
  if (!updated) throw ApiError.notFound("Nuk u gjet");
  return { message: "U pezullua" };
}

async function unsuspendHandler(table: string, req: Request) {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) throw ApiError.badRequest("ID invalid");
  const updated = await unsuspendTable(table, id);
  if (!updated) throw ApiError.notFound("Nuk u gjet");
  return { message: "U aktivizua" };
}

export const suspendPatient = handle((req) => suspendHandler("patients", req));
export const unsuspendPatient = handle((req) => unsuspendHandler("patients", req));
export const suspendClinic = handle((req) => suspendHandler("clinics", req));
export const unsuspendClinic = handle((req) => unsuspendHandler("clinics", req));
export const suspendLab = handle((req) => suspendHandler("labs", req));
export const unsuspendLab = handle((req) => unsuspendHandler("labs", req));
export const suspendPharmacy = handle((req) => suspendHandler("pharmacies", req));
export const unsuspendPharmacy = handle((req) => unsuspendHandler("pharmacies", req));
export const suspendDoctor = handle((req) => suspendHandler("doctors", req));
export const unsuspendDoctor = handle((req) => unsuspendHandler("doctors", req));
