import { Request } from "express";

export type UserType = "patient" | "clinic" | "admin";

export interface JwtPayload {
  id: number;
  email: string;
  type: UserType;
}

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}
