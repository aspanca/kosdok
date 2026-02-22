import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./root";
import { ClinicSigninPage } from "../pages/clinic-signin";

export const clinicSigninRoute = createRoute({
  getParentRoute: () => rootRoute,
  component: ClinicSigninPage,
  path: "/clinic-signin",
});
