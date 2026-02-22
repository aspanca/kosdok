import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./root";
import { Doctor } from "../pages/doctor";

export const doctorRoute = createRoute({
  getParentRoute: () => rootRoute,
  component: Doctor,
  path: "/doctor",
});
