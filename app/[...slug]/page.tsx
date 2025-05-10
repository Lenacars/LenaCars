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

  // Eğer bu blog sayfasıysa, blog içeriklerini de çek
  let blogList: any[] = [];
  if (slug === "lenacars-bilgilendiriyor/blog") {
    const { data: blogs, error: blogError } = await supabase
      .from("bloglar")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false });

    if (!blogError && blogs) {
      blogList = blogs;
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">{page.title}</h1>

      {slug === "lenacars-bilgilendiriyor/blog" ? (
        blogList.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {blogList.map((blog) => (
              <div
                key={blog.id}
                className="border rounded-md shadow-sm p-4 hover:shadow-lg transition-all duration-200"
              >
                {blog.thumbnail_image && (
                  <img
                    src={blog.thumbnail_image}
                    alt={blog.title}
                    className="w-full h-48 object-cover mb-4 rounded"
                  />
                )}
                <h2 className="text-xl font-semibold mb-2">{blog.title}</h2>
                <p className="text-sm text-gray-600 line-clamp-3">
                  {blog.seo_description}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p>Henüz blog içeriği eklenmemiş.</p>
        )
      ) : (
        <div
          className="prose prose-lg"
          dangerouslySetInnerHTML={{ __html: page.content || "" }}
        />
      )}
    </div>
  );
}
