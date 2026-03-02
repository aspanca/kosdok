import { Router, Request, Response, NextFunction } from "express";
import { z } from "zod";
import * as adminAuthService from "./admin.auth.service";
import { ApiError } from "../../utils";
import { authenticate, authorizeAdmin } from "../../middleware";
import type { AuthRequest } from "../../utils/types";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const adminAuthRouter = Router();

adminAuthRouter.post("/login", (req: Request, res: Response, next: NextFunction) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return next(ApiError.badRequest("Email dhe fjalëkalimi janë të detyrueshëm"));
  }
  adminAuthService
    .adminLogin(parsed.data.email, parsed.data.password)
    .then((result) => res.json({ success: true, data: result }))
    .catch(next);
});

adminAuthRouter.post("/refresh", (req: Request, res: Response, next: NextFunction) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return next(ApiError.badRequest("Refresh token required"));
  }
  adminAuthService
    .adminRefresh(refreshToken)
    .then((tokens) => res.json({ success: true, data: tokens }))
    .catch(next);
});

adminAuthRouter.get("/me", authenticate, authorizeAdmin, (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) return next(ApiError.unauthorized());
  adminAuthService
    .adminGetMe(req.user.id)
    .then((user) => res.json({ success: true, data: user }))
    .catch(next);
});
