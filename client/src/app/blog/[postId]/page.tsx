import { Suspense } from "react";
import { BlogPostPage } from "@/views/blog-post";

export default function Page() {
  return (
    <Suspense>
      <BlogPostPage />
    </Suspense>
  );
}
