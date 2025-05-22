"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase-browser";

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

          const normalizedGroup = groupKey
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

        const menuOrder = [
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

  return (
    <nav className="bg-white/95 backdrop-blur border-b border-gray-100 shadow-sm">
      {/* Mobile toggle */}
      <div className="md:hidden flex justify-between items-center px-4 py-3">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex items-center text-gray-800"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
          <span className="ml-2 font-medium">Menü</span>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobile && isMenuOpen && (
        <div className="px-4 pb-4">
          <ul className="space-y-2">
            {menuItems.map((group) => (
              <li key={group.groupName}>
                {group.pages.length === 0 ? (
                  <Link
                    href={`/${group.groupName.toLowerCase().replace(/\s+/g, "-")}`}
                    className="block py-2 px-3 text-gray-800 font-semibold bg-gray-100 rounded"
                  >
                    {group.groupName}
                  </Link>
                ) : (
                  <>
                    <button
                      onClick={() => toggleDropdown(group.groupName)}
                      className="w-full flex justify-between items-center py-2 px-3 text-gray-800 font-semibold bg-gray-100 rounded"
                    >
                      {group.groupName}
                      <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform ${activeDropdown === group.groupName ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {activeDropdown === group.groupName && (
                      <ul className="pl-4 mt-2 space-y-2 border-l-2 border-gray-200">
                        {group.pages.map((page) => (
                          <li key={page.slug}>
                            <Link
                              href={`/${page.slug}`}
                              className="block py-1 px-2 text-gray-600 hover:text-[#6A3C96] hover:bg-gray-50 rounded"
                            >
                              {page.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Desktop Menu */}
      {!isMobile && (
        <div className="max-w-7xl mx-auto flex justify-center px-6 py-4 space-x-10 text-base font-semibold">
          {menuItems.map((group) => (
            <div key={group.groupName} className="relative group">
              {group.pages.length === 0 ? (
                <Link
                  href={`/${group.groupName.toLowerCase().replace(/\s+/g, "-")}`}
                  className={`relative text-gray-800 hover:text-[#6A3C96] ${
                    pathname === `/${group.groupName.toLowerCase().replace(/\s+/g, "-")}` ? "text-[#6A3C96] after:w-full" : "after:w-0"
                  } after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:bg-[#6A3C96] after:transition-all after:duration-300`}
                >
                  {group.groupName}
                </Link>
              ) : (
                <>
                  <span className="cursor-pointer text-gray-800 hover:text-[#6A3C96] relative after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:bg-[#6A3C96] after:transition-all after:duration-300 group-hover:after:w-full after:w-0">
                    {group.groupName}
                  </span>
                  <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg border border-gray-200 rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <ul className="py-2">
                      {group.pages.map((page) => (
                        <li key={page.slug}>
                          <Link
                            href={`/${page.slug}`}
                            className="block px-4 py-2 text-gray-700 hover:bg-[#6A3C96] hover:text-white transition-colors duration-150"
                          >
                            {page.title}
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
