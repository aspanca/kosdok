import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./root";
import { ClinicBookingsPage } from "../pages/clinic-dashboard/bookings";
import { ClinicCalendarPage } from "../pages/clinic-dashboard/calendar";
import { ClinicPatientsPage } from "../pages/clinic-dashboard/patients";

export const clinicBookingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/clinic-dashboard/bookings",
  component: ClinicBookingsPage,
});

export const clinicCalendarRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/clinic-dashboard/calendar",
  component: ClinicCalendarPage,
});

export const clinicPatientsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/clinic-dashboard/patients",
  component: ClinicPatientsPage,
});
