import express from "express";
import cors from "cors";
import { env } from "./config";
import { errorHandler } from "./middleware/error-handler";
import { authRouter } from "./modules/auth/auth.routes";
import { citiesRouter } from "./modules/cities/cities.routes";
import { clinicRouter } from "./modules/clinic/clinic.routes";
import { adminRouter } from "./modules/admin/admin.routes";

const app = express();

app.use(cors({
  origin: [env.clientUrl, env.adminUrl],
  credentials: true,
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/auth", authRouter);
app.use("/api/cities", citiesRouter);
app.use("/api/clinic", clinicRouter);
app.use("/api/admin", adminRouter);

app.use(errorHandler);

export { app };
