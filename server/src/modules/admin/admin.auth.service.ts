import bcrypt from "bcrypt";
import jwt, { type SignOptions } from "jsonwebtoken";
import { db, env } from "../../config";
import { ApiError } from "../../utils";
import type { JwtPayload } from "../../utils/types";

const SALT_ROUNDS = 12;

function generateTokens(payload: JwtPayload) {
  const accessOpts: SignOptions = { expiresIn: env.jwt.expiresIn as unknown as SignOptions["expiresIn"] };
  const refreshOpts: SignOptions = { expiresIn: env.jwt.refreshExpiresIn as unknown as SignOptions["expiresIn"] };
  const accessToken = jwt.sign(payload, env.jwt.secret, accessOpts);
  const refreshToken = jwt.sign(payload, env.jwt.refreshSecret, refreshOpts);
  return { accessToken, refreshToken };
}

function sanitizeAdmin(admin: Record<string, unknown>) {
  const { password_hash, ...safe } = admin;
  return { ...safe, type: "admin" };
}

export async function adminLogin(email: string, password: string) {
  const admin = await db("admins").where("email", email).first();
  if (!admin) {
    throw ApiError.unauthorized("Email ose fjalëkalimi nuk është i saktë");
  }
  const isValid = await bcrypt.compare(password, admin.password_hash);
  if (!isValid) {
    throw ApiError.unauthorized("Email ose fjalëkalimi nuk është i saktë");
  }
  const tokens = generateTokens({ id: admin.id, email: admin.email, type: "admin" });
  return { user: sanitizeAdmin(admin), ...tokens };
}

export async function adminRefresh(refreshToken: string) {
  try {
    const payload = jwt.verify(refreshToken, env.jwt.refreshSecret) as JwtPayload;
    if (payload.type !== "admin") throw ApiError.unauthorized("Invalid token");
    const admin = await db("admins").where("id", payload.id).first();
    if (!admin) throw ApiError.unauthorized("Admin not found");
    return generateTokens({ id: admin.id, email: admin.email, type: "admin" });
  } catch {
    throw ApiError.unauthorized("Invalid refresh token");
  }
}

export async function adminGetMe(adminId: number) {
  const admin = await db("admins").where("id", adminId).first();
  if (!admin) throw ApiError.notFound("Admin not found");
  return sanitizeAdmin(admin);
}
