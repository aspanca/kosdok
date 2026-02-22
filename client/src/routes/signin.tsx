import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./root";
import { SigninPage } from "../pages/signin";

export const signinRoute = createRoute({
    getParentRoute: () => rootRoute,
    component: SigninPage,
    path: "/signin",
});
