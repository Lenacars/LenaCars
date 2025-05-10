"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase-browser";

interface BlogItem {
  id: string;
  title: string;
  slug: string;
  seo_description?: string;
  thumbnail_image?: string;
  created_at?: string;
}

export default function BlogPage() {
  const [blogs, setBlogs] = useState<BlogItem[]>([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      const { data, error } = await supabase
        .from("bloglar")
        .select("id, title, slug, seo_description, thumbnail_image, created_at")
        .eq("published", true)
        .order("created_at", { ascending: false });

      if (!error && data) setBlogs(data);
    };

    fetchBlogs();
  }, []);

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-4">Blog</h1>
      <p className="mb-8 text-muted-foreground">
        Güncel içerikler, kullanıcı tavsiyeleri ve sektörel analizler blog sayfamızda yayınlanmaktadır.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {blogs.map((blog) => (
          <Link key={blog.id} href={`/lenacars-bilgilendiriyor/blog/${blog.slug}`}>
            <div className="border rounded-lg p-4 hover:shadow-md transition cursor-pointer">
              {blog.thumbnail_image && (
                <img
                  src={blog.thumbnail_image.replace(/^\/+/, "")}
                  alt={blog.title}
                  className="w-full h-48 object-cover rounded mb-3"
                />
              )}
              <h2 className="text-xl font-semibold">{blog.title}</h2>
              <p className="text-sm text-muted-foreground">{blog.seo_description}</p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(blog.created_at!).toLocaleDateString("tr-TR")}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
