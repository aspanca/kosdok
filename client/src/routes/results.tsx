import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./root";
import { Results } from "../pages/results";

export type ResultsSearch = {
  q?: string;
  city?: string;
  type?: "clinic" | "doctor";
  serviceId?: number;
};

export const resultsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/results",
  component: Results,
  validateSearch: (search: Record<string, unknown>): ResultsSearch => ({
    q: typeof search.q === "string" && search.q ? search.q : undefined,
    city: typeof search.city === "string" && search.city ? search.city : undefined,
    type: search.type === "clinic" || search.type === "doctor" ? search.type : undefined,
    serviceId: typeof search.serviceId === "number" ? search.serviceId : undefined,
  }),
});
