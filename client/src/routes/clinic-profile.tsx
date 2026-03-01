import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./root";
import { ClinicProfilePage } from "../pages/clinic-profile";

export const clinicProfileRoute = createRoute({
  getParentRoute: () => rootRoute,
  component: ClinicProfilePage,
  path: "/clinic-profile",
});
