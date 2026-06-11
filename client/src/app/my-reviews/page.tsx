import { Suspense } from "react";
import { MyReviewsPage } from "@/views/my-reviews";

export default function Page() {
  return (
    <Suspense>
      <MyReviewsPage />
    </Suspense>
  );
}
