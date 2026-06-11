import { Router } from "express";
import * as providersController from "./providers.controller";

export const providersRouter = Router();

providersRouter.get("/", providersController.searchProviders);
providersRouter.get("/clinic/:id", providersController.getClinicPublicProfile);
providersRouter.get("/doctor/:id", providersController.getDoctorPublicProfile);
providersRouter.get("/:type/:id/slots", providersController.getAvailableSlots);
