import { Router } from "express";
import * as authController from "./auth.controller";
import { validate, authenticate } from "../../middleware";
import { upload } from "../../middleware/upload";
import { patientRegisterSchema, clinicRegisterSchema, loginSchema, updateProfileSchema, changePasswordSchema } from "./auth.validation";

export const authRouter = Router();

authRouter.post("/register/patient", validate(patientRegisterSchema), authController.registerPatient);
authRouter.post("/register/clinic", validate(clinicRegisterSchema), authController.registerClinic);
authRouter.get("/verify-email", authController.verifyEmail);
authRouter.post("/login", validate(loginSchema), authController.login);
authRouter.post("/refresh", authController.refresh);
authRouter.get("/me", authenticate, authController.getMe);
authRouter.patch("/me", authenticate, validate(updateProfileSchema), authController.updateProfile);
authRouter.post("/me/picture", authenticate, upload.single("picture"), authController.uploadProfilePicture);
authRouter.patch("/me/password", authenticate, validate(changePasswordSchema), authController.changePassword);
