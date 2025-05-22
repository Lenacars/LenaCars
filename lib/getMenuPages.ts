import { supabase } from "@/lib/supabase-browser";

// Menüde gösterilecek sayfaları çeker, group_sort_order'a göre sıralar
export async function getMenuPages() {
  const { data, error } = await supabase
    .from("Pages")
    .select(`
      id,
      title,
      slug,
      menu_group,
      parent,
      external_url,
      group_sort_order,
      sort_order
    `)
    .eq("published", true) // sadece yayınlanmış sayfaları al
    .order("group_sort_order", { ascending: true })
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("❌ Menü verisi alınamadı:", error.message);
    return [];
  }

  return data || [];
}
