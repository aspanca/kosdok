import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./root";
import { BloodEvent } from "../pages/blood-event";

export const bloodEventRoute = createRoute({
  getParentRoute: () => rootRoute,
  component: BloodEvent,
  path: "/donate-blood/$eventId",
});
