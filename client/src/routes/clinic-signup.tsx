import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./root";
import { ClinicSignupPage } from "../pages/clinic-signup";

export const clinicSignupRoute = createRoute({
  getParentRoute: () => rootRoute,
  component: ClinicSignupPage,
  path: "/clinic-signup",
});
