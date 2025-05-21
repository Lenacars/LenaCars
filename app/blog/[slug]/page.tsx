import { supabase } from "@/lib/supabase-browser";
import { notFound } from "next/navigation";

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

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">{blog.title}</h1>
      <div
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />
    </div>
  );
}
