import { supabase } from "@/lib/supabase-browser"; // Eğer "browser" dosyası kullanıyorsan

export async function getMenuPages() {
  const { data, error } = await supabase
    .from("Pages")
    .select("id, title, slug, parent_id, show_in_menu") // Gerekli alanları seç
    .eq("show_in_menu", true) // Sadece menüde gösterilecekleri al
    .order("order", { ascending: true }); // Eğer sıralama varsa

  if (error) {
    console.error("Menü verisi alınamadı:", error.message);
    return [];
  }

  return data || [];
}
