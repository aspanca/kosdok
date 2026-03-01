import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config";
import { ApiError } from "../utils";
import type { AuthRequest, JwtPayload, UserType } from "../utils/types";

export function authenticate(req: AuthRequest, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return next(ApiError.unauthorized("Missing or invalid authorization header"));
  }

  const token = header.split(" ")[1];

  try {
    const payload = jwt.verify(token, env.jwt.secret) as JwtPayload;
    req.user = payload;
    next();
  } catch {
    next(ApiError.unauthorized("Invalid or expired token"));
  }
}

export function authorize(...allowedTypes: UserType[]) {
  return (req: AuthRequest, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(ApiError.unauthorized());
    }

    if (!allowedTypes.includes(req.user.type)) {
      return next(ApiError.forbidden("You do not have permission to access this resource"));
    }

    next();
  };
}
