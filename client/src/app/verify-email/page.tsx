import { Suspense } from "react";
import { VerifyEmailPage } from "@/views/verify-email";

export default function Page() {
  return (
    <Suspense>
      <VerifyEmailPage />
    </Suspense>
  );
}
