import { Suspense } from "react";
import { ContactPage } from "@/views/contact";

export default function Page() {
  return (
    <Suspense>
      <ContactPage />
    </Suspense>
  );
}
