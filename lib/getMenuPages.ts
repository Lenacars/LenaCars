import { supabase } from "@/lib/supabase-browser";

export async function getMenuPages() {
  const { data, error } = await supabase
    .from("Pages")
    .select("id, title, slug, parent, show_in_menu, menu_group, group_sort_order")
    .eq("show_in_menu", true)
    .order("group_sort_order", { ascending: true });

  if (error) {
    console.error("Menü verisi alınamadı:", error.message);
    return [];
  }

  return data || [];
}
