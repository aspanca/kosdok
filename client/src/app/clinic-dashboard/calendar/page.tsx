import { Suspense } from "react";
import { ClinicCalendarPage } from "@/views/clinic-dashboard/calendar";

export default function Page() {
  return (
    <Suspense>
      <ClinicCalendarPage />
    </Suspense>
  );
}
