import { Response, NextFunction } from "express";
import * as appointmentsService from "./appointments.service";
import { clinicAppointmentsQuerySchema } from "./appointments.validation";
import { ApiError } from "../../utils";
import type { AuthRequest } from "../../utils/types";

function parseId(raw: unknown): number {
  const id = Number(raw);
  if (!Number.isInteger(id) || id <= 0) throw ApiError.badRequest("ID jo valide");
  return id;
}

export async function createAppointment(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const appointment = await appointmentsService.createAppointment(req.user!.id, req.body);
    res.status(201).json({ success: true, data: appointment });
  } catch (error) {
    next(error);
  }
}

export async function getMyAppointments(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const appointments = await appointmentsService.listForPatient(req.user!.id);
    res.json({ success: true, data: appointments });
  } catch (error) {
    next(error);
  }
}

export async function getClinicAppointments(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const parsed = clinicAppointmentsQuerySchema.safeParse(req.query);
    if (!parsed.success) throw ApiError.badRequest("Parametra jo validë");
    const appointments = await appointmentsService.listForClinic(req.user!.id, parsed.data);
    res.json({ success: true, data: appointments });
  } catch (error) {
    next(error);
  }
}

export async function getClinicPatients(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const patients = await appointmentsService.listClinicPatients(req.user!.id);
    res.json({ success: true, data: patients });
  } catch (error) {
    next(error);
  }
}

export async function cancelAppointment(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const appointment = await appointmentsService.cancelAppointment(parseId(req.params.id), req.user!);
    res.json({ success: true, data: appointment });
  } catch (error) {
    next(error);
  }
}

export async function confirmAppointment(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const appointment = await appointmentsService.confirmAppointment(parseId(req.params.id), req.user!.id);
    res.json({ success: true, data: appointment });
  } catch (error) {
    next(error);
  }
}

export async function completeAppointment(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const appointment = await appointmentsService.completeAppointment(parseId(req.params.id), req.user!.id);
    res.json({ success: true, data: appointment });
  } catch (error) {
    next(error);
  }
}
