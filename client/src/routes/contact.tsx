import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./root";
import { ContactPage } from "../pages/contact";

export const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/contact",
  component: ContactPage,
});
