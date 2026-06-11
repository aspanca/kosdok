import { Router } from "express";
import * as appointmentsController from "./appointments.controller";
import { authenticate, authorize, validate } from "../../middleware";
import { createAppointmentSchema } from "./appointments.validation";

export const appointmentsRouter = Router();

appointmentsRouter.use(authenticate);

appointmentsRouter.post("/", authorize("patient"), validate(createAppointmentSchema), appointmentsController.createAppointment);
appointmentsRouter.get("/mine", authorize("patient"), appointmentsController.getMyAppointments);

appointmentsRouter.get("/clinic", authorize("clinic"), appointmentsController.getClinicAppointments);
appointmentsRouter.get("/clinic/patients", authorize("clinic"), appointmentsController.getClinicPatients);
appointmentsRouter.patch("/:id/confirm", authorize("clinic"), appointmentsController.confirmAppointment);
appointmentsRouter.patch("/:id/complete", authorize("clinic"), appointmentsController.completeAppointment);

appointmentsRouter.patch("/:id/cancel", authorize("patient", "clinic"), appointmentsController.cancelAppointment);
