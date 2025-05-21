import { supabase } from "@/lib/supabase-browser";
import { notFound } from "next/navigation";
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

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* Başlık */}
      <h1 className="text-4xl font-bold text-center text-[#6A3C96] mb-6">
        {blog.title}
      </h1>

      {/* Yayın Tarihi */}
      {blog.created_at && (
        <p className="text-center text-sm text-gray-500 mb-8">
          {new Date(blog.created_at).toLocaleDateString("tr-TR", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      )}

      {/* Kapak Görseli */}
      {blog.thumbnail_image && (
        <div className="mb-8">
          <Image
            src={blog.thumbnail_image}
            alt={blog.title}
            width={900}
            height={500}
            className="rounded-xl w-full object-cover max-h-[450px] mx-auto shadow-md"
          />
        </div>
      )}

      {/* İçerik */}
      <div
        className="prose prose-lg max-w-none text-gray-800 prose-headings:text-[#6A3C96] prose-a:text-[#6A3C96] prose-a:font-semibold prose-img:rounded-lg prose-img:shadow-lg"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />
    </div>
  );
}
