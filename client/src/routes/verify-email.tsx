import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./root";
import { VerifyEmailPage } from "../pages/verify-email";

export const verifyEmailRoute = createRoute({
  getParentRoute: () => rootRoute,
  component: VerifyEmailPage,
  path: "/verify-email",
});
