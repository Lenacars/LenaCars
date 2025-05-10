import { supabase } from "@/lib/supabase-browser";
import { notFound } from "next/navigation";

interface BlogPageProps {
  params: { slug: string };
}

export default async function BlogDetailPage({ params }: BlogPageProps) {
  const { slug } = params;

  const { data: blog, error } = await supabase
    .from("bloglar")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (!blog || error) return notFound();

  const imageUrl = blog.thumbnail_image?.startsWith("http")
    ? blog.thumbnail_image
    : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/${blog.thumbnail_image?.replace(/^\/+/, "")}`;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{blog.title}</h1>

      {blog.thumbnail_image && (
        <img
          src={imageUrl}
          alt={blog.title}
          className="mb-6 w-full h-72 object-cover rounded"
        />
      )}

      <div
        className="prose prose-lg"
        dangerouslySetInnerHTML={{ __html: blog.content || "" }}
      />
    </div>
  );
}
