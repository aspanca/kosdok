import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./root";
import { PrivacyPolicyPage } from "../pages/privacy-policy";

export const privacyPolicyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/privacy-policy",
  component: PrivacyPolicyPage,
});
