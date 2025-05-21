"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-browser";
import Link from "next/link";
import Image from "next/image";

export default function BlogListPage() {
  const [blogs, setBlogs] = useState<any[]>([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      const { data } = await supabase
        .from("bloglar")
        .select("id, title, slug, seo_description, thumbnail_image, created_at")
        .eq("published", true)
        .order("created_at", { ascending: false });

      setBlogs(data || []);
    };

    fetchBlogs();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center text-[#6A3C96] mb-10">LenaCars Blog</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogs.map((blog) => (
          <div
            key={blog.id}
            className="bg-white border rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden flex flex-col justify-between"
          >
            {blog.thumbnail_image && (
              <Image
                src={blog.thumbnail_image}
                alt={blog.title}
                width={600}
                height={300}
                className="w-full h-48 object-cover"
              />
            )}

            <div className="p-5 flex flex-col flex-grow">
              <h2 className="text-xl font-semibold text-[#333] mb-2">{blog.title}</h2>
              <p className="text-sm text-gray-600 flex-grow">{blog.seo_description}</p>

              <Link href={`/blog/${blog.slug}`} className="mt-4 inline-block">
                <button className="bg-[#6A3C96] text-white px-4 py-2 rounded hover:bg-[#542d80] transition">
                  Devamını Oku
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
