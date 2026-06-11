import { Suspense } from "react";
import { ClinicProfilePage } from "@/views/clinic-profile";

export default function Page() {
  return (
    <Suspense>
      <ClinicProfilePage />
    </Suspense>
  );
}
