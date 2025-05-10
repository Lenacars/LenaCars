// app/[...slug]/page.tsx

import { supabase } from "@/lib/supabase-browser";
import { notFound } from "next/navigation";

interface PageProps {
  params: { slug: string[] };
}

export default async function DynamicPage({ params }: PageProps) {
  const slugArray = params.slug;
  const slug = Array.isArray(slugArray) ? slugArray.join("/") : slugArray;

  const { data, error } = await supabase
    .from("Pages")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (!data || error) {
    return notFound();
  }

  // Eğer bu bir blog liste sayfasıysa, blogları çek
  let blogs: any[] = [];
  if (data.slug === "lenacars-bilgilendiriyor/blog") {
    const { data: bloglar } = await supabase
      .from("bloglar")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false });

    blogs = bloglar || [];
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">{data.title}</h1>
      <div
        className="prose prose-lg mb-10"
        dangerouslySetInnerHTML={{ __html: data.content || "" }}
      />

      {/* Blog sayfasıysa blogları listele */}
      {data.slug === "lenacars-bilgilendiriyor/blog" && blogs.length > 0 && (
        <div className="space-y-10">
          {blogs.map((blog) => (
            <div key={blog.id} className="border-b pb-6">
              <h2 className="text-xl font-semibold">{blog.title}</h2>
              <p className="text-gray-600">{blog.seo_description}</p>
              {blog.thumbnail_image && (
                <img
                  src={blog.thumbnail_image}
                  alt={blog.title}
                  className="w-full max-w-md rounded mt-4"
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
