import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./root";
import { Hospital } from "../pages/hospital";

export const hospitalRoute = createRoute({
    getParentRoute: () => rootRoute,
    component: Hospital,
    path: "/hospital",
});