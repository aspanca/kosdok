import { Suspense } from "react";
import { ClinicBookingsPage } from "@/views/clinic-dashboard/bookings";

export default function Page() {
  return (
    <Suspense>
      <ClinicBookingsPage />
    </Suspense>
  );
}
