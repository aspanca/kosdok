import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./root";
import { Results } from "../pages/results";

export const resultsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/results",
  component: Results,
});
