
"use client";

import { supabase } from "@/lib/supabase-browser";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

interface PageProps {
  params: { slug: string };
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = params;

  const { data: blog, error } = await supabase
    .from("bloglar")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (!blog || error) return notFound();

  const kelimeSayisi = blog.content?.split(" ").length || 0;
  const okumaSuresi = Math.ceil(kelimeSayisi / 180);

  const { data: relatedBlogs } = await supabase
    .from("bloglar")
    .select("id, title, slug, thumbnail_image")
    .eq("published", true)
    .neq("slug", slug)
    .order("created_at", { ascending: false })
    .limit(3);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-4 text-[#6A3C96]">{blog.title}</h1>
      <p className="text-sm text-gray-500 text-center mb-6">{okumaSuresi} dakikalık okuma</p>

      <div
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />

      <div className="mt-10 flex gap-3">
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${process.env.NEXT_PUBLIC_BASE_URL}/blog/${blog.slug}`}
          target="_blank"
          className="btn bg-[#6A3C96] text-white px-4 py-2 rounded hover:bg-[#542d80]"
        >
          LinkedIn
        </a>
        <a
          href={`https://wa.me/?text=${process.env.NEXT_PUBLIC_BASE_URL}/blog/${blog.slug}`}
          target="_blank"
          className="btn bg-[#6A3C96] text-white px-4 py-2 rounded hover:bg-[#542d80]"
        >
          WhatsApp
        </a>
      </div>

      <div className="mt-16">
        <h3 className="text-2xl font-semibold text-[#6A3C96] mb-6">İlgili Yazılar</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {relatedBlogs?.map((item) => (
            <Link key={item.id} href={`/blog/${item.slug}`}>
              <div className="border rounded-lg overflow-hidden hover:shadow-lg transition">
                {item.thumbnail_image && (
                  <Image
                    src={item.thumbnail_image}
                    alt={item.title}
                    width={400}
                    height={250}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <h4 className="text-lg font-semibold">{item.title}</h4>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
