"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase-browser"; // Bu import kalsın, işlevselliğin bir parçası

interface PageItem {
  id: string;
  title: string;
  slug: string;
  menu_group: string | null;
  parent: string | null;
  published: boolean;
  sort_order: number | null;
}

interface MenuItem {
  groupName: string;
  pages: { title: string; slug: string }[];
}

export default function NavigationMenu() {
  const pathname = usePathname();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // FONKSİYONEL KISIMLAR OLDUĞU GİBİ KALIYOR
  useEffect(() => {
    const fetchMenuItems = async () => {
      const { data, error } = await supabase
        .from("Pages")
        .select("id, title, slug, menu_group, parent, published, sort_order")
        .eq("published", true);

      if (!error && data) {
        const grouped: { [key: string]: { title: string; slug: string }[] } = {};
        const ungrouped: { title: string; slug: string }[] = [];

        data.forEach((page) => {
          const isParent = !page.parent;
          const groupKey = page.menu_group?.trim() || "";

          const normalizedGroup = groupKey // Orijinal formatlama mantığınız
            .toLocaleLowerCase("tr-TR")
            .split(" ")
            .map(word => word.charAt(0).toLocaleUpperCase("tr-TR") + word.slice(1).toLocaleLowerCase("tr-TR"))
            .join(" ");

          if (isParent && normalizedGroup) {
            if (!grouped[normalizedGroup]) grouped[normalizedGroup] = [];
            grouped[normalizedGroup].push({ title: page.title, slug: page.slug });
          } else if (isParent) {
            ungrouped.push({ title: page.title, slug: page.slug });
          }
        });

        const menuOrder = [ // Orijinal menü sıranız
          "Kurumsal",
          "Kiralama",
          "İkinci El",
          "Elektrikli Araçlar",
          "Basın Köşesi",
          "LenaCars Bilgilendiriyor",
          "S.S.S.",
          "Nasıl Çalışır",
        ];

        const orderedMenu: MenuItem[] = [];

        menuOrder.forEach((groupName) => {
          if (grouped[groupName]) {
            orderedMenu.push({ groupName, pages: grouped[groupName] });
            delete grouped[groupName];
          }
        });

        Object.entries(grouped).forEach(([groupName, pages]) => {
          orderedMenu.push({ groupName, pages });
        });

        ungrouped.forEach((page) => {
          orderedMenu.push({ groupName: page.title, pages: [] });
        });

        setMenuItems(orderedMenu);
      } else if (error) {
        console.error("Orj. NavigationMenu: Veri alınamadı:", error.message);
        setMenuItems([]);
      }
    };

    fetchMenuItems();
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleDropdown = (groupName: string) => {
    setActiveDropdown(activeDropdown === groupName ? null : groupName);
  };
  // FONKSİYONEL KISIMLARIN SONU

  return (
    <nav className="bg-white/95 backdrop-blur sticky top-0 z-40 border-b border-gray-200 shadow-sm"> {/* Sticky ve z-index eklendi */}
      {/* Mobile toggle */}
      <div className="md:hidden flex justify-end items-center px-4 py-3"> {/* Sadece menü butonu sağda */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Menüyü aç/kapat"
          className="p-2 rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#6A3C96] transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {/* `isMenuOpen` state'i mobil menünün görünürlüğünü kontrol ediyor */}
      <div className={`md:hidden ${isMenuOpen ? "block" : "hidden"} absolute top-full left-0 w-full bg-white shadow-lg border-t border-gray-200 z-30`}>
        <div className="px-3 py-3 space-y-1">
          {menuItems.map((group) => (
            <li key={group.groupName} className="list-none"> {/* Safari'de list-style sorununu çözmek için */}
              {group.pages.length === 0 ? (
                <Link
                  href={`/${group.groupName.toLocaleLowerCase("tr-TR").replace(/\s+/g, "-")}`} // Orijinal slug üretimi
                  className={`block py-2.5 px-3.5 text-base text-gray-700 font-medium hover:bg-purple-50 hover:text-[#6A3C96] rounded-lg transition-colors duration-150 ${
                    pathname === `/${group.groupName.toLocaleLowerCase("tr-TR").replace(/\s+/g, "-")}` ? "bg-purple-100 text-[#6A3C96]" : ""
                  }`}
                  onClick={() => { setIsMenuOpen(false); setActiveDropdown(null);}} // Menüyü ve aktif dropdown'u kapat
                >
                  {group.groupName}
                </Link>
              ) : (
                <>
                  <button
                    onClick={() => toggleDropdown(group.groupName)}
                    className="w-full flex justify-between items-center py-2.5 px-3.5 text-base text-gray-700 font-medium hover:bg-purple-50 hover:text-[#6A3C96] rounded-lg transition-colors duration-150"
                  >
                    <span>{group.groupName}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform duration-200 ${activeDropdown === group.groupName ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {activeDropdown === group.groupName && (
                    <ul className="pl-4 mt-1.5 mb-1 space-y-1 border-l-2 border-purple-200 ml-1.5"> {/* Hafif içe alma */}
                      {group.pages.map((page) => (
                        <li key={page.slug}>
                          <Link
                            href={`/${page.slug}`}
                            className={`block py-2 px-3 text-sm text-gray-600 hover:text-[#6A3C96] hover:bg-purple-50 rounded-md transition-colors duration-150 ${
                              pathname === `/${page.slug}` ? "text-[#6A3C96] bg-purple-100 font-semibold" : ""
                            }`}
                            onClick={() => { setIsMenuOpen(false); setActiveDropdown(null);}} // Menüyü ve aktif dropdown'u kapat
                          >
                            {page.title} {/* Orijinal başlık gösterimi */}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              )}
            </li>
          ))}
        </div>
      </div>

      {/* Desktop Menu */}
      {!isMobile && (
        <div className="max-w-screen-xl mx-auto flex justify-center items-center px-4 py-3 space-x-6 lg:space-x-8 text-sm"> {/* Daha iyi responsive boşluklar */}
          {menuItems.map((group) => (
            <div key={group.groupName} className="relative group">
              {group.pages.length === 0 ? (
                <Link
                  href={`/${group.groupName.toLocaleLowerCase("tr-TR").replace(/\s+/g, "-")}`} // Orijinal slug
                  className={`relative py-2 text-gray-600 hover:text-[#6A3C96] font-medium transition-colors duration-200 whitespace-nowrap ${
                    pathname === `/${group.groupName.toLocaleLowerCase("tr-TR").replace(/\s+/g, "-")}` ? "text-[#6A3C96]" : ""
                  } after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[3px] after:bg-[#6A3C96] after:transition-all after:duration-300 ${ // Alt çizgi efekti ayarlandı
                    pathname === `/${group.groupName.toLocaleLowerCase("tr-TR").replace(/\s+/g, "-")}` ? "after:w-full" : "after:w-0 group-hover:after:w-3/4" // Hover'da tam olmayan çizgi
                  }`}
                >
                  {group.groupName} {/* Orijinal grup adı */}
                </Link>
              ) : (
                <>
                  <span className="cursor-default py-2 flex items-center text-gray-600 group-hover:text-[#6A3C96] font-medium transition-colors duration-200 whitespace-nowrap relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[3px] after:bg-[#6A3C96] after:transition-all after:duration-300 after:w-0 group-hover:after:w-3/4"> {/* Alt çizgi efekti */}
                    {group.groupName} {/* Orijinal grup adı */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1.5 text-gray-400 group-hover:text-[#6A3C96] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"> {/* İkon boyutu ve kalınlığı */}
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                  <div className="absolute left-1/2 -translate-x-1/2 mt-1.5 w-auto min-w-[200px] bg-white shadow-xl border border-gray-100 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:mt-1 transition-all duration-200 ease-out z-50"> {/* Daha yumuşak gölge ve min genişlik */}
                    <ul className="py-2">
                      {group.pages.map((page) => (
                        <li key={page.slug}>
                          <Link
                            href={`/${page.slug}`}
                            className={`block w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-purple-50 hover:text-[#6A3C96] transition-colors duration-150 whitespace-nowrap ${
                              pathname === `/${page.slug}` ? "bg-purple-100 text-[#6A3C96] font-semibold" : ""
                            }`}
                          >
                            {page.title} {/* Orijinal başlık */}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </nav>
  );
}
