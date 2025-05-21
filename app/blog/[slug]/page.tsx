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

  const kelimeSayisi = blog.content?.split(" ").length || 0;
  const okumaSuresi = Math.ceil(kelimeSayisi / 180);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-[#6A3C96] mb-4 text-center">
        {blog.title}
      </h1>

      <p className="text-sm text-gray-500 text-center mb-8">
        Yayın Tarihi:{" "}
        {new Date(blog.created_at).toLocaleDateString("tr-TR", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}{" "}
        • Tahmini Okuma: {okumaSuresi} dk
      </p>

      {blog.thumbnail_image && (
        <div className="mb-10">
          <Image
            src={blog.thumbnail_image}
            alt={blog.title}
            width={900}
            height={500}
            className="rounded-lg w-full object-cover shadow"
          />
        </div>
      )}

      <div
        className="prose prose-lg max-w-none text-gray-800 prose-headings:text-[#6A3C96] prose-a:text-[#6A3C96] prose-img:rounded-lg"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />

      <div className="mt-12 flex gap-4">
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${process.env.NEXT_PUBLIC_SITE_URL}/blog/${blog.slug}`}
          target="_blank"
          className="bg-[#6A3C96] text-white px-4 py-2 rounded hover:bg-[#542d80] transition text-sm"
        >
          LinkedIn'de Paylaş
        </a>
        <a
          href={`https://wa.me/?text=${process.env.NEXT_PUBLIC_SITE_URL}/blog/${blog.slug}`}
          target="_blank"
          className="bg-[#6A3C96] text-white px-4 py-2 rounded hover:bg-[#542d80] transition text-sm"
        >
          WhatsApp'ta Paylaş
        </a>
      </div>
    </div>
  );
}
