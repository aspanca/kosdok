import { Suspense } from "react";
import { PrivacyPolicyPage } from "@/views/privacy-policy";

export default function Page() {
  return (
    <Suspense>
      <PrivacyPolicyPage />
    </Suspense>
  );
}
