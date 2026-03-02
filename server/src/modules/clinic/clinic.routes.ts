import { Router } from "express";
import * as clinicController from "./clinic.controller";
import { authenticate, authorize, validate, upload } from "../../middleware";
import { clinicProfileSchema } from "./clinic.validation";

export const clinicRouter = Router();

clinicRouter.get("/services", clinicController.getServices);
clinicRouter.get("/facilities", clinicController.getFacilities);

clinicRouter.use(authenticate, authorize("clinic"));

clinicRouter.get("/me", clinicController.getClinicProfile);
clinicRouter.patch("/me", validate(clinicProfileSchema), clinicController.updateClinicProfile);
clinicRouter.post("/me/pictures", upload.single("picture"), clinicController.uploadClinicPicture);
clinicRouter.post("/me/logo", upload.single("logo"), clinicController.uploadClinicLogo);
