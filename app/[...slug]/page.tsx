// app/[...slug]/page.tsx

import { supabase } from "@/lib/supabase-browser"; // doğru import
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

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">{data.title}</h1>
      <div
        className="prose prose-lg"
        dangerouslySetInnerHTML={{ __html: data.content || "" }}
      />
    </div>
  );
}
