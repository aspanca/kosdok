import { Request, Response, NextFunction } from "express";
import * as authService from "./auth.service";
import type { AuthRequest } from "../../utils/types";

export async function registerPatient(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await authService.registerPatient(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

export async function registerClinic(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await authService.registerClinic(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await authService.login(req.body);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

export async function refresh(req: Request, res: Response, next: NextFunction) {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      res.status(400).json({ success: false, message: "Refresh token is required" });
      return;
    }
    const tokens = await authService.refreshAccessToken(refreshToken);
    res.json({ success: true, data: tokens });
  } catch (error) {
    next(error);
  }
}

export async function getMe(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const user = await authService.getMe(req.user!.id, req.user!.type);
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
}

export async function updateProfile(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const user = await authService.updateProfile(req.user!.id, req.user!.type, req.body);
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
}

export async function uploadProfilePicture(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const file = req.file;
    if (!file?.buffer) {
      res.status(400).json({ success: false, message: "No image file provided" });
      return;
    }
    const user = await authService.uploadProfilePicture(req.user!.id, req.user!.type, file.buffer);
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
}

export async function changePassword(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const result = await authService.changePassword(req.user!.id, req.user!.type, req.body);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

export async function verifyEmail(req: Request, res: Response, next: NextFunction) {
  try {
    const { token } = req.query;
    if (!token || typeof token !== "string") {
      res.status(400).json({ success: false, message: "Token is required" });
      return;
    }
    const result = await authService.verifyEmail(token);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}
