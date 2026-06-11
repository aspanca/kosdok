import { Suspense } from "react";
import { SignupPage } from "@/views/signup";

export default function Page() {
  return (
    <Suspense>
      <SignupPage />
    </Suspense>
  );
}
