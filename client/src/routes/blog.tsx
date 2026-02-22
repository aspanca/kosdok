import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./root";
import { BlogPage } from "../pages/blog";

export const blogRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/blog",
  component: BlogPage,
});
