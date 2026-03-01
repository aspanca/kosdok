import { Router, Request, Response, NextFunction } from "express";
import { db } from "../../config";

export const citiesRouter = Router();

citiesRouter.get("/", async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const cities = await db("cities").select("id", "name", "postcode").orderBy("name");
    res.json({ success: true, data: cities });
  } catch (error) {
    next(error);
  }
});
