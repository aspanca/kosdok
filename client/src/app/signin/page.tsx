import { Suspense } from "react";
import { SigninPage } from "@/views/signin";

export default function Page() {
  return (
    <Suspense>
      <SigninPage />
    </Suspense>
  );
}
