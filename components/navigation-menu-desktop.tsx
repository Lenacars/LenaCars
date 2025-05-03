"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";

// Supabase browser client kur
const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Page {
  id: string;
  title: string;
  slug: string;
  menu_group: string;
}

export default function NavigationMenuDesktop() {
  const [menuData, setMenuData] = useState<Record<string, Page[]>>({});

  useEffect(() => {
    const fetchMenuData = async () => {
      const { data, error } = await supabase
        .from("Pages")
        .select("id, title, slug, menu_group")
        .eq("status", "published");

      if (error) {
        console.error("Menü verisi alınamadı:", error);
        return;
      }

      // Menü gruplarına göre grupla
      const groupedData: Record<string, Page[]> = {};
      data?.forEach((page) => {
        if (!page.menu_group) return; // Menü grubu boş olanları atla
        if (!groupedData[page.menu_group]) {
          groupedData[page.menu_group] = [];
        }
        groupedData[page.menu_group].push(page);
      });

      setMenuData(groupedData);
    };

    fetchMenuData();
  }, []);

  return (
    <div className="hidden md:block border-t border-b py-2">
      <div className="container mx-auto">
        <div className="flex items-center justify-center space-x-2">
          {Object.entries(menuData).map(([group, pages]) => (
            <div key={group} className="relative group">
              <button className="flex items-center px-4 py-2 text-sm font-medium hover:text-[#6A3C96]">
                {group}
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>

              <div className="absolute left-0 mt-2 hidden group-hover:block bg-white border rounded shadow-md z-50">
                {pages.map((page) => (
                  <Link
                    key={page.id}
                    href={`/${page.slug}`}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 whitespace-nowrap"
                  >
                    {page.title}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
