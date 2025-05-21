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
    return (
      <div className="p-6 text-red-500 text-center">
        Bloglar yüklenemedi. Lütfen daha sonra tekrar deneyin.
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center text-[#6A3C96] mb-10">
        LenaCars Blog
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogs?.map((blog) => (
          <Link key={blog.id} href={`/blog/${blog.slug}`} className="group">
            <div className="bg-white border border-[#e3d5f3] rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-[#6A3C96]/50 flex flex-col h-full">
              {blog.thumbnail_image && (
                <Image
                  src={blog.thumbnail_image}
                  alt={blog.title}
                  width={500}
                  height={300}
                  className="w-full h-52 object-cover transition-all duration-300 group-hover:scale-[1.02]"
                />
              )}

              <div className="p-5 flex flex-col flex-1">
                <h2 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                  {blog.title}
                </h2>
                <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                  {blog.seo_description || ""}
                </p>
                <span className="inline-block mt-auto text-sm font-medium text-white bg-[#6A3C96] px-4 py-2 rounded-md hover:bg-[#542d80] transition w-fit">
                  Devamını Oku
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
