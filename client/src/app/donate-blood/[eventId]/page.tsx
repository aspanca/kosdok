import { Suspense } from "react";
import { BloodEvent } from "@/views/blood-event";

export default function Page() {
  return (
    <Suspense>
      <BloodEvent />
    </Suspense>
  );
}
