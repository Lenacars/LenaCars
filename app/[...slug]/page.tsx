// app/[...slug]/page.tsx

import { supabase } from "@/lib/supabase-browser";
import { notFound } from "next/navigation";

interface PageProps {
  params: { slug: string[] };
}

export default async function DynamicPage({ params }: PageProps) {
  const slugArray = params.slug;
  const slug = Array.isArray(slugArray) ? slugArray.join("/") : slugArray;

  const { data: page, error } = await supabase
    .from("Pages")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (!page || error) return notFound();

  // Eğer slug blog sayfasıysa blogları Supabase'den çek
  let blogList = [];
  if (slug === "lenacars-bilgilendiriyor/blog") {
    const { data: blogs } = await supabase
      .from("bloglar")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false });

    blogList = blogs || [];
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">{page.title}</h1>

      {slug === "lenacars-bilgilendiriyor/blog" ? (
        <div className="grid md:grid-cols-2 gap-6">
          {blogList.map((blog) => (
            <div key={blog.id} className="border p-4 rounded shadow-sm">
              {blog.thumbnail_image && (
                <img
                  src={blog.thumbnail_image}
                  alt={blog.title}
                  className="mb-4 w-full h-48 object-cover rounded"
                />
              )}
              <h2 className="text-xl font-semibold mb-2">{blog.title}</h2>
              <p className="text-sm text-gray-600">{blog.seo_description}</p>
            </div>
          ))}
        </div>
      ) : (
        <div
          className="prose prose-lg"
          dangerouslySetInnerHTML={{ __html: page.content || "" }}
        />
      )}
    </div>
  );
}
