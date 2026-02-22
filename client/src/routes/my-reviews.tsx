import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./root";
import { MyReviewsPage } from "../pages/my-reviews";

export const myReviewsRoute = createRoute({
    getParentRoute: () => rootRoute,
    component: MyReviewsPage,
    path: "/my-reviews",
});
