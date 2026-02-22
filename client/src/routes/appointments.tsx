import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./root";
import { AppointmentsPage } from "../pages/appointments";

export const appointmentsRoute = createRoute({
    getParentRoute: () => rootRoute,
    component: AppointmentsPage,
    path: "/appointments",
});
