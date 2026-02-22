import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./root";
import { AdvancedSearchPage } from "../pages/advanced-search";

export const advancedSearchRoute = createRoute({
  getParentRoute: () => rootRoute,
  component: AdvancedSearchPage,
  path: "/advanced-search",
});
