import { Suspense } from "react";
import { Hospital } from "@/views/hospital";

export default function Page() {
  return (
    <Suspense>
      <Hospital />
    </Suspense>
  );
}
