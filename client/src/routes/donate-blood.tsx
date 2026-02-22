import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./root";
import { DonateBlood } from "../pages/donate-blood";

export const donateBloodRoute = createRoute({
  getParentRoute: () => rootRoute,
  component: DonateBlood,
  path: "/donate-blood",
});
