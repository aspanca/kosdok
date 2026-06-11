import { Suspense } from "react";
import { Doctor } from "@/views/doctor";

export default function Page() {
  return (
    <Suspense>
      <Doctor />
    </Suspense>
  );
}
