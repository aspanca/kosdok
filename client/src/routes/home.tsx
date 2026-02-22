import { createRoute } from "@tanstack/react-router";
import { HomePage } from "../pages/home";
import { rootRoute } from "./root";

export const homeROute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});
