import { Suspense } from "react";
import { AdvancedSearchPage } from "@/views/advanced-search";

export default function Page() {
  return (
    <Suspense>
      <AdvancedSearchPage />
    </Suspense>
  );
}
