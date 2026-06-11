import { Suspense } from "react";
import { BlogPage } from "@/views/blog";

export default function Page() {
  return (
    <Suspense>
      <BlogPage />
    </Suspense>
  );
}
