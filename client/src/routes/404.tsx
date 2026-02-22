import { NotFoundRoute } from "@tanstack/react-router";
import { rootRoute } from "./root";
import { NotFoundPage } from "../pages/not-found";

export const notFoundRoute = new NotFoundRoute({
  getParentRoute: () => rootRoute,
  component: () => <NotFoundPage />,
});
