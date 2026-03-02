import { homeROute } from "./home";
import { resultsRoute } from "./results";
import { notFoundRoute } from "./404";
import { rootRoute } from "./root";
import { createRouter } from "@tanstack/react-router";
import { hospitalRoute } from "./hospital";
import { doctorRoute } from "./doctor";
import { donateBloodRoute } from "./donate-blood";
import { bloodEventRoute } from "./blood-event";
import { privacyPolicyRoute } from "./privacy-policy";
import { blogRoute } from "./blog";
import { blogPostRoute } from "./blog-post";
import { contactRoute } from "./contact";
import { advancedSearchRoute } from "./advanced-search";
import { signupRoute } from "./signup";
import { signinRoute } from "./signin";
import { verifyEmailRoute } from "./verify-email";
import { profileRoute } from "./profile";
import { appointmentsRoute } from "./appointments";
import { myReviewsRoute } from "./my-reviews";
import { clinicProfileRoute } from "./clinic-profile";
import { clinicSignupRoute } from "./clinic-signup";
import { clinicSigninRoute } from "./clinic-signin";

const routeTree = rootRoute.addChildren([homeROute, resultsRoute, hospitalRoute, doctorRoute, donateBloodRoute, bloodEventRoute, privacyPolicyRoute, blogRoute, blogPostRoute, contactRoute, advancedSearchRoute, signupRoute, signinRoute, verifyEmailRoute, profileRoute, appointmentsRoute, myReviewsRoute, clinicProfileRoute, clinicSignupRoute, clinicSigninRoute]);

export const router = createRouter({
  routeTree,
  defaultPendingComponent: () => <h1>Loading...</h1>,
  defaultErrorComponent: () => <h1>...</h1>,
  defaultPreload: "intent",
  basepath: "/",
  notFoundRoute,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
