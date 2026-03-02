import { createRootRoute, createRoute, createRouter, redirect } from "@tanstack/react-router";
import { AdminLayout } from "./components/admin-layout";
import { LoginPage } from "./pages/login";
import { DashboardPage } from "./pages/dashboard";
import { CitiesPage } from "./pages/cities";
import { ServicesPage } from "./pages/services";
import { FacilitiesPage } from "./pages/facilities";
import { PatientsPage } from "./pages/patients";
import { ClinicsPage } from "./pages/clinics";
import { LabsPage } from "./pages/labs";
import { PharmaciesPage } from "./pages/pharmacies";
import { DoctorsPage } from "./pages/doctors";
import { getAccessToken } from "./lib/axios";

const rootRoute = createRootRoute();

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
});

const layoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "layout",
  component: AdminLayout,
  beforeLoad: () => {
    if (!getAccessToken()) throw redirect({ to: "/login" });
  },
});

const indexRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/",
  component: DashboardPage,
});

const citiesRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/cities",
  component: CitiesPage,
});

const servicesRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/services",
  component: ServicesPage,
});

const facilitiesRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/facilities",
  component: FacilitiesPage,
});

const patientsRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/patients",
  component: PatientsPage,
});

const clinicsRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/clinics",
  component: ClinicsPage,
});

const labsRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/labs",
  component: LabsPage,
});

const pharmaciesRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/pharmacies",
  component: PharmaciesPage,
});

const doctorsRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/doctors",
  component: DoctorsPage,
});

const routeTree = rootRoute.addChildren([
  loginRoute,
  layoutRoute.addChildren([
    indexRoute,
    citiesRoute,
    servicesRoute,
    facilitiesRoute,
    patientsRoute,
    clinicsRoute,
    labsRoute,
    pharmaciesRoute,
    doctorsRoute,
  ]),
]);

export const router = createRouter({
  routeTree,
  defaultPreload: "intent",
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
