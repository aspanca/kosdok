import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./root";
import { BlogPostPage } from "../pages/blog-post";

export const blogPostRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/blog/$postId",
  component: BlogPostPage,
});
