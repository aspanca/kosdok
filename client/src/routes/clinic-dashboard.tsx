import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./root";
import { ClinicDashboardPage } from "../pages/clinic-dashboard";

export const clinicDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  component: ClinicDashboardPage,
  path: "/clinic-dashboard",
});
