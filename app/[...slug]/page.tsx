import { supabase } from "@/lib/supabase-browser";
import { notFound, redirect } from "next/navigation"; // ✅ redirect eklendi
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import remarkGfm from "remark-gfm";
import dynamic from "next/dynamic";
import Link from "next/link";

const components = {
  // Örnek bileşen tanımları: Timeline: dynamic(() => import("@/components/Timeline"))
};

interface PageProps {
  params: { slug: string[] };
}

export default async function DynamicPage({ params }: PageProps) {
  const slugArray = params.slug;
  const slug = Array.isArray(slugArray) ? slugArray.join("/") : slugArray;
  const decodedSlug = decodeURIComponent(slug);

  const { data: page, error } = await supabase
    .from("Pages")
    .select("*")
    .eq("slug", decodedSlug)
    .eq("published", true)
    .maybeSingle();

  if (!page || error) return notFound();

  // ✅ Dış bağlantıya yönlendirme kontrolü
  if (page.external_url) {
    return redirect(page.external_url);
  }

  // Blog liste özel durumu
  if (decodedSlug === "lenacars-bilgilendiriyor/blog") {
    const { data: blogs } = await supabase
      .from("bloglar")
      .select("id, title, slug, thumbnail_image, seo_description, published")
      .eq("published", true)
      .order("created_at", { ascending: false });

    return (
      <div className="max-w-5xl mx-auto p-6">
        <div className="grid md:grid-cols-2 gap-6">
          {blogs?.map((blog) => (
            <Link key={blog.id} href={`/${blog.slug}`}>
              <div className="border p-4 rounded shadow-sm hover:shadow-lg transition cursor-pointer">
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
            </Link>
          ))}
        </div>
      </div>
    );
  }

  // MDX varsa
  if (page.mdx_content) {
    return (
      <div className="max-w-5xl mx-auto p-6 prose prose-lg">
        <MDXRemote
          source={page.mdx_content}
          components={components}
          options={{
            mdxOptions: {
              remarkPlugins: [remarkGfm],
              rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings],
            },
          }}
        />
      </div>
    );
  }

  // HTML içerik varsa
  if (page.html_content) {
    return (
      <div className="max-w-5xl mx-auto p-6 prose prose-lg">
        <div dangerouslySetInnerHTML={{ __html: page.html_content }} />
      </div>
    );
  }

  // Hiç içerik yoksa
  return notFound();
}
