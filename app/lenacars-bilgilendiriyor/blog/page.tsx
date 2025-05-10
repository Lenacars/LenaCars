"use client";

import BlogList from "@/components/blog/BlogList";

export default function Blog() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-4">Blog</h1>
      <p className="mb-6">
        Güncel içerikler, kullanıcı tavsiyeleri ve sektörel analizler blog sayfamızda yayınlanmaktadır.
      </p>

      <BlogList />
    </div>
  );
}
