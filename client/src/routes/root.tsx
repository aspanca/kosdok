import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Layout } from "../components/layout/layout";

export const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
});
