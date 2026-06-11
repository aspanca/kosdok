import { Request, Response, NextFunction } from "express";
import * as reviewsService from "./reviews.service";
import { ApiError } from "../../utils";
import type { AuthRequest } from "../../utils/types";

function parseId(raw: unknown): number {
  const id = Number(raw);
  if (!Number.isInteger(id) || id <= 0) throw ApiError.badRequest("ID jo valide");
  return id;
}

export async function listForProvider(req: Request, res: Response, next: NextFunction) {
  try {
    const { providerType } = req.params;
    if (providerType !== "clinic" && providerType !== "doctor") {
      throw ApiError.badRequest("Lloji i ofruesit jo valid");
    }
    const data = await reviewsService.listForProvider(providerType, parseId(req.params.providerId));
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function createReview(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const review = await reviewsService.createReview(req.user!.id, req.body);
    res.status(201).json({ success: true, data: review });
  } catch (error) {
    next(error);
  }
}

export async function getMyReviews(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const reviews = await reviewsService.listForPatient(req.user!.id);
    res.json({ success: true, data: reviews });
  } catch (error) {
    next(error);
  }
}

export async function updateReview(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const review = await reviewsService.updateReview(parseId(req.params.id), req.user!.id, req.body);
    res.json({ success: true, data: review });
  } catch (error) {
    next(error);
  }
}

export async function deleteReview(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    await reviewsService.deleteReview(parseId(req.params.id), req.user!.id);
    res.json({ success: true, data: { message: "Vlerësimi u fshi" } });
  } catch (error) {
    next(error);
  }
}
