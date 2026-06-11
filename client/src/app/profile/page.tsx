import { Suspense } from "react";
import { ProfilePage } from "@/views/profile";

export default function Page() {
  return (
    <Suspense>
      <ProfilePage />
    </Suspense>
  );
}
