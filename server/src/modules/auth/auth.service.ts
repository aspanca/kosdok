import bcrypt from "bcrypt";
import jwt, { type SignOptions } from "jsonwebtoken";
import { db, env } from "../../config";
import { ApiError } from "../../utils";
import { sendVerificationEmail } from "../../utils/email";
import type { JwtPayload, UserType } from "../../utils/types";
import type { PatientRegisterInput, ClinicRegisterInput, LoginInput, UpdateProfileInput, ChangePasswordInput } from "./auth.validation";
import { uploadToCloudinary } from "../../middleware/upload";

const SALT_ROUNDS = 12;
const VERIFY_TOKEN_EXPIRY = "24h";

function generateTokens(payload: JwtPayload) {
  const accessOpts: SignOptions = { expiresIn: env.jwt.expiresIn as unknown as SignOptions["expiresIn"] };
  const refreshOpts: SignOptions = { expiresIn: env.jwt.refreshExpiresIn as unknown as SignOptions["expiresIn"] };

  const accessToken = jwt.sign(payload, env.jwt.secret, accessOpts);
  const refreshToken = jwt.sign(payload, env.jwt.refreshSecret, refreshOpts);

  return { accessToken, refreshToken };
}

function formatDateOnly(value: unknown): string | null {
  if (value == null) return null;
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const d = value instanceof Date ? value : new Date(value as string);
  if (isNaN(d.getTime())) return null;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function sanitizeUser(user: Record<string, unknown>) {
  const { password_hash, ...safe } = user;
  if ("date_of_birth" in safe && safe.date_of_birth != null) {
    const formatted = formatDateOnly(safe.date_of_birth);
    safe.date_of_birth = formatted ?? safe.date_of_birth;
  }
  return safe;
}

function sanitizeClinicForAuth(clinic: Record<string, unknown>) {
  const { password_hash, ...safe } = clinic;
  return { ...safe, type: "clinic", clinic_name: safe.name };
}

export async function registerPatient(input: PatientRegisterInput) {
  const existing = await db("patients").where("email", input.email).first();
  if (existing) {
    throw ApiError.conflict("Ky email është i regjistruar tashmë");
  }

  const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);

  const dateOfBirth = input.dateOfBirth?.trim() || null;

  const [id] = await db("patients").insert({
    first_name: input.firstName,
    last_name: input.lastName,
    email: input.email,
    password_hash: passwordHash,
    phone_number: input.phone || null,
    city: input.city?.trim() || null,
    date_of_birth: dateOfBirth,
    gender: input.gender || null,
  });

  const patient = await db("patients").where("id", id).first();

  const verifyToken = jwt.sign(
    { sub: id, email: input.email, purpose: "verify" },
    env.jwt.secret,
    { expiresIn: VERIFY_TOKEN_EXPIRY as unknown as SignOptions["expiresIn"] }
  );
  const verifyUrl = `${env.clientUrl}/verify-email?token=${verifyToken}`;
  await sendVerificationEmail(input.email, input.firstName, verifyUrl);

  return {
    user: sanitizeUser(patient),
    message: "Regjistrimi u krye. Kontrolloni email-in për të verifikuar llogarinë.",
  };
}

export async function registerClinic(input: ClinicRegisterInput) {
  const existing = await db("clinics").where("email", input.email).first();
  if (existing) {
    throw ApiError.conflict("Ky email është i regjistruar tashmë");
  }

  const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);

  const [id] = await db("clinics").insert({
    email: input.email,
    password_hash: passwordHash,
    name: input.clinicName,
    phone: input.phone,
    city: input.city,
  });

  const clinic = await db("clinics").where("id", id).first();
  const tokens = generateTokens({ id, email: clinic.email, type: "clinic" as UserType });

  return { user: sanitizeClinicForAuth(clinic), ...tokens };
}

export async function login(input: LoginInput) {
  const patient = await db("patients").where("email", input.email).first();
  if (patient) {
    const isPasswordValid = await bcrypt.compare(input.password, patient.password_hash);
    if (!isPasswordValid) {
      throw ApiError.unauthorized("Email ose fjalëkalimi nuk është i saktë");
    }
    if (!patient.email_verified_at) {
      throw ApiError.unauthorized("Ju lutemi verifikoni email-in tuaj përpara se të kyçeni.");
    }
    const tokens = generateTokens({ id: patient.id, email: patient.email, type: "patient" as UserType });
    return { user: sanitizeUser(patient), ...tokens };
  }

  const clinic = await db("clinics").where("email", input.email).first();
  if (!clinic) {
    throw ApiError.unauthorized("Email ose fjalëkalimi nuk është i saktë");
  }

  const isPasswordValid = await bcrypt.compare(input.password, clinic.password_hash);
  if (!isPasswordValid) {
    throw ApiError.unauthorized("Email ose fjalëkalimi nuk është i saktë");
  }

  const tokens = generateTokens({ id: clinic.id, email: clinic.email, type: "clinic" as UserType });

  return { user: sanitizeClinicForAuth(clinic), ...tokens };
}

export async function refreshAccessToken(refreshToken: string) {
  try {
    const payload = jwt.verify(refreshToken, env.jwt.refreshSecret) as JwtPayload;

    if (payload.type === "patient") {
      const patient = await db("patients").where("id", payload.id).first();
      if (!patient) throw ApiError.unauthorized("User not found");
      return generateTokens({ id: patient.id, email: patient.email, type: "patient" });
    }

    const clinic = await db("clinics").where("id", payload.id).first();
    if (!clinic) throw ApiError.unauthorized("User not found");
    return generateTokens({ id: clinic.id, email: clinic.email, type: "clinic" as UserType });
  } catch {
    throw ApiError.unauthorized("Invalid refresh token");
  }
}

export async function getMe(userId: number, userType: UserType) {
  if (userType === "patient") {
    const patient = await db("patients").where("id", userId).first();
    if (!patient) throw ApiError.notFound("User not found");
    return sanitizeUser(patient);
  }
  const clinic = await db("clinics").where("id", userId).first();
  if (!clinic) throw ApiError.notFound("User not found");
  return sanitizeClinicForAuth(clinic);
}

export async function updateProfile(userId: number, userType: UserType, input: UpdateProfileInput) {
  if (userType === "clinic") {
    throw ApiError.forbidden("Clinic profile must be updated via /api/clinic/me");
  }
  if (userType === "patient") {
    const patient = await db("patients").where("id", userId).first();
    if (!patient) throw ApiError.notFound("User not found");

    const updates: Record<string, unknown> = {};
    if (input.firstName !== undefined) updates.first_name = input.firstName;
    if (input.lastName !== undefined) updates.last_name = input.lastName;
    if (input.phone !== undefined) updates.phone_number = input.phone;
    if (input.dateOfBirth !== undefined) updates.date_of_birth = input.dateOfBirth || null;
    if (input.gender !== undefined) updates.gender = input.gender;
    if (input.address !== undefined) updates.address = input.address;
    if (input.city !== undefined) updates.city = input.city;
    if (input.picture !== undefined) updates.picture = input.picture === "" ? null : input.picture;

    await db("patients").where("id", userId).update(updates);
    const updated = await db("patients").where("id", userId).first();
    return sanitizeUser(updated);
  }

  throw ApiError.forbidden("Invalid user type");
}

export async function uploadProfilePicture(userId: number, userType: UserType, buffer: Buffer) {
  const { url } = await uploadToCloudinary(buffer, "profile-pictures");

  if (userType === "patient") {
    await db("patients").where("id", userId).update({ picture: url });
    const patient = await db("patients").where("id", userId).first();
    return sanitizeUser(patient);
  }

  await db("clinics").where("id", userId).update({ logo: url });
  const clinic = await db("clinics").where("id", userId).first();
  return sanitizeClinicForAuth(clinic);
}

export async function changePassword(userId: number, userType: UserType, input: ChangePasswordInput) {
  if (userType === "patient") {
    const patient = await db("patients").where("id", userId).first();
    if (!patient) throw ApiError.notFound("User not found");

    const isValid = await bcrypt.compare(input.currentPassword, patient.password_hash);
    if (!isValid) {
      throw ApiError.unauthorized("Fjalëkalimi aktual nuk është i saktë");
    }

    const passwordHash = await bcrypt.hash(input.newPassword, SALT_ROUNDS);
    await db("patients").where("id", userId).update({ password_hash: passwordHash });
    return { message: "Fjalëkalimi u ndryshua me sukses" };
  }

  const clinic = await db("clinics").where("id", userId).first();
  if (!clinic) throw ApiError.notFound("User not found");

  const isValid = await bcrypt.compare(input.currentPassword, clinic.password_hash);
  if (!isValid) {
    throw ApiError.unauthorized("Fjalëkalimi aktual nuk është i saktë");
  }

  const passwordHash = await bcrypt.hash(input.newPassword, SALT_ROUNDS);
  await db("clinics").where("id", userId).update({ password_hash: passwordHash });
  return { message: "Fjalëkalimi u ndryshua me sukses" };
}

export async function verifyEmail(token: string) {
  try {
    const payload = jwt.verify(token, env.jwt.secret) as unknown as { sub: number; purpose?: string };
    if (payload.purpose !== "verify") {
      throw ApiError.badRequest("Token i pavlefshëm");
    }

    const updated = await db("patients")
      .where("id", payload.sub)
      .update({ email_verified_at: db.raw("CURRENT_TIMESTAMP") });

    if (!updated) {
      throw ApiError.notFound("Pacienti nuk u gjet");
    }

    const patient = await db("patients").where("id", payload.sub).first();
    const tokens = generateTokens({ id: patient.id, email: patient.email, type: "patient" });
    return { user: sanitizeUser(patient), ...tokens };
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw ApiError.badRequest("Linku i verifikimit ka skaduar ose është i pavlefshëm");
  }
}
