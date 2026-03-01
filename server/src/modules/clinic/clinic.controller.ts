import { Response, NextFunction } from "express";
import * as clinicService from "./clinic.service";
import type { AuthRequest } from "../../utils/types";

export async function getServices(_req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const services = await clinicService.getServices();
    res.json({ success: true, data: services });
  } catch (error) {
    next(error);
  }
}

export async function getClinicProfile(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user || req.user.type !== "clinic") {
      return res.status(403).json({ success: false, message: "Clinic access only" });
    }
    const profile = await clinicService.getClinicProfile(req.user.id);
    res.json({ success: true, data: profile });
  } catch (error) {
    next(error);
  }
}

export async function updateClinicProfile(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user || req.user.type !== "clinic") {
      return res.status(403).json({ success: false, message: "Clinic access only" });
    }
    const profile = await clinicService.updateClinicProfile(req.user.id, req.body);
    res.json({ success: true, data: profile });
  } catch (error) {
    next(error);
  }
}

export async function uploadClinicPicture(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user || req.user.type !== "clinic") {
      return res.status(403).json({ success: false, message: "Clinic access only" });
    }
    const file = req.file;
    if (!file?.buffer) {
      return res.status(400).json({ success: false, message: "No image file provided" });
    }
    const { uploadToCloudinary } = await import("../../middleware/upload");
    const { url } = await uploadToCloudinary(file.buffer, "clinic-pictures");
    const profile = await clinicService.uploadClinicPicture(req.user.id, url);
    res.json({ success: true, data: profile });
  } catch (error) {
    next(error);
  }
}
