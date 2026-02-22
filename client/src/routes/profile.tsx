import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./root";
import { ProfilePage } from "../pages/profile";

export const profileRoute = createRoute({
    getParentRoute: () => rootRoute,
    component: ProfilePage,
    path: "/profile",
});
