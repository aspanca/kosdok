import { Suspense } from "react";
import { HomePage } from "@/views/home";

export default function Page() {
  return (
    <Suspense>
      <HomePage />
    </Suspense>
  );
}
