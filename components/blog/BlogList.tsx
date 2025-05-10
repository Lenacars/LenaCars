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

export default function BlogList() {
  const [blogs, setBlogs] = useState<BlogItem[]>([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      const { data, error } = await supabase
        .from("bloglar")
        .select("id, title, slug, seo_description, thumbnail_image, created_at")
        .eq("published", true)
        .order("created_at", { ascending: false });

      if (!error && data) setBlogs(data);
      else if (error) console.error("Error fetching blogs:", error.message);
    };

    fetchBlogs();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
      {blogs.map((blog) => (
        <Link key={blog.id} href={`/lenacars-bilgilendiriyor/blog/${blog.slug}`}>
          <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow duration-200 cursor-pointer h-full flex flex-col">
            {blog.thumbnail_image && (
              <img
                const imageUrl = `https://uxnpmdeizkzvnevpceiw.supabase.co/storage/v1/object/public/images/${blog.thumbnail_image?.replace(/^\/+/, "")}`;
                alt={blog.title}
                className="w-full h-48 object-cover rounded mb-4"
              />
            )}
            <div className="flex flex-col flex-grow">
              <h2 className="text-xl font-semibold mb-2 text-gray-800">{blog.title}</h2>
              <p className="text-sm text-gray-600 mb-3 line-clamp-3 flex-grow">
                {blog.seo_description}
              </p>
              <p className="text-xs text-gray-500 mt-auto pt-2 border-t border-gray-100">
                {blog.created_at
                  ? new Date(blog.created_at).toLocaleDateString("tr-TR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "Tarih Yok"}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
