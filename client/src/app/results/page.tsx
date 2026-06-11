import { Suspense } from "react";
import { Results } from "@/views/results";

export default function Page() {
  return (
    <Suspense>
      <Results />
    </Suspense>
  );
}
