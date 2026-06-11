import { Request, Response, NextFunction } from "express";
import * as providersService from "./providers.service";
import { searchQuerySchema, slotsQuerySchema, providerTypeSchema } from "./providers.validation";
import { ApiError } from "../../utils";

function parseId(raw: unknown): number {
  const id = Number(raw);
  if (!Number.isInteger(id) || id <= 0) throw ApiError.badRequest("ID jo valide");
  return id;
}

export async function searchProviders(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = searchQuerySchema.safeParse(req.query);
    if (!parsed.success) throw ApiError.badRequest("Parametra kërkimi jo validë");
    const providers = await providersService.searchProviders(parsed.data);
    res.json({ success: true, data: providers });
  } catch (error) {
    next(error);
  }
}

export async function getClinicPublicProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const profile = await providersService.getClinicPublicProfile(parseId(req.params.id));
    res.json({ success: true, data: profile });
  } catch (error) {
    next(error);
  }
}

export async function getDoctorPublicProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const profile = await providersService.getDoctorPublicProfile(parseId(req.params.id));
    res.json({ success: true, data: profile });
  } catch (error) {
    next(error);
  }
}

export async function getAvailableSlots(req: Request, res: Response, next: NextFunction) {
  try {
    const type = providerTypeSchema.safeParse(req.params.type);
    if (!type.success) throw ApiError.badRequest("Lloji i ofruesit jo valid");
    const query = slotsQuerySchema.safeParse(req.query);
    if (!query.success) throw ApiError.badRequest("Data duhet të jetë në formatin YYYY-MM-DD");
    const slots = await providersService.getAvailableSlots(type.data, parseId(req.params.id), query.data.date);
    res.json({ success: true, data: { date: query.data.date, slots } });
  } catch (error) {
    next(error);
  }
}
