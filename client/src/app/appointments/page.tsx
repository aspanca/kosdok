import { Suspense } from "react";
import { AppointmentsPage } from "@/views/appointments";

export default function Page() {
  return (
    <Suspense>
      <AppointmentsPage />
    </Suspense>
  );
}
