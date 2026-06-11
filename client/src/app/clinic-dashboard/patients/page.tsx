import { Suspense } from "react";
import { ClinicPatientsPage } from "@/views/clinic-dashboard/patients";

export default function Page() {
  return (
    <Suspense>
      <ClinicPatientsPage />
    </Suspense>
  );
}
