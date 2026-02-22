import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./root";
import { SignupPage } from "../pages/signup";

export const signupRoute = createRoute({
    getParentRoute: () => rootRoute,
    component: SignupPage,
    path: "/signup",
});
