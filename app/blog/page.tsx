import { supabase } from "@/lib/supabase-browser";
import Link from "next/link";
import Image from "next/image";

export default async function BlogPage() {
  const { data: blogs, error } = await supabase
    .from("bloglar")
    .select("id, title, slug, seo_description, thumbnail_image, created_at")
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (error) {
    return <div className="p-6 text-red-500">Bloglar yüklenemedi.</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Blog</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs?.map((blog) => (
          <Link key={blog.id} href={`/blog/${blog.slug}`}>
            <div className="border rounded-lg overflow-hidden hover:shadow-lg transition">
              {blog.thumbnail_image && (
                <Image
                  src={blog.thumbnail_image}
                  alt={blog.title}
                  width={400}
                  height={250}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{blog.title}</h2>
                <p className="text-sm text-gray-600">{blog.seo_description || ""}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
