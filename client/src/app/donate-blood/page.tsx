import { Suspense } from "react";
import { DonateBlood } from "@/views/donate-blood";

export default function Page() {
  return (
    <Suspense>
      <DonateBlood />
    </Suspense>
  );
}
