import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./root";
import { SigninPage } from "../pages/signin";

export const signupRoute = createRoute({
  getParentRoute: () => rootRoute,
  component: () => <SigninPage initialMode="signup" />,
  path: "/signup",
});
