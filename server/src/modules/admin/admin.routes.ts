import { Router } from "express";
import { adminAuthRouter } from "./admin.auth.routes";
import { adminDataRouter } from "./admin.data.routes";
import { authenticate, authorizeAdmin } from "../../middleware";

export const adminRouter = Router();

adminRouter.use("/auth", adminAuthRouter);
adminRouter.use("/", authenticate, authorizeAdmin, adminDataRouter);
