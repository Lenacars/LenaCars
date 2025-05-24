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

interface FetchedMenuItem {
  groupName: string;
  pages: { title: string; slug: string }[];
}

interface Props {
  isMobileFromParent: boolean;
  setIsMobileMenuOpenFromParent: (isOpen: boolean) => void;
  userName?: string | null; // userName prop'u eklendi
}

export default function NavigationMenu({
  isMobileFromParent,
  setIsMobileMenuOpenFromParent,
  userName, // userName prop'u alındı
}: Props) {
  const pathname = usePathname();
  const [menuItems, setMenuItems] = useState<FetchedMenuItem[]>([]);
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
          "Kurumsal", "Kiralama", "İkinci El", "Elektrikli Araçlar",
          "Basın Köşesi", "LenaCars Bilgilendiriyor", "S.S.S.", "Nasıl Çalışır",
        ];
        const orderedMenu: FetchedMenuItem[] = [];

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
        console.error("NavigationMenu: Veri alınamadı:", error.message);
        setMenuItems([]);
      }
    };
    fetchMenuItems();
  }, []);

  const toggleMobileDropdown = (groupName: string) => {
    setActiveDropdown(activeDropdown === groupName ? null : groupName);
  };

  const handleMobileLinkClick = () => {
    setIsMobileMenuOpenFromParent(false);
    setActiveDropdown(null); // Alt menüleri de kapat
  };


  return (
    // Mobil menü açıkken `nav` sticky olmamalı, MainHeader'daki fixed div zaten pozisyonu yönetiyor.
    // Masaüstünde ise sticky kalabilir.
    <nav className={`bg-white/95 backdrop-blur border-b border-gray-200 shadow-sm ${!isMobileFromParent ? "md:sticky md:top-16 lg:top-[76px]" : ""}`}>
      {isMobileFromParent && (
        // Bu div, MainHeader'daki fixed div'in içinde tam yükseklik ve genişlikte olacak şekilde ayarlanabilir
        // veya MainHeader'daki fixed div'in doğrudan content'i olabilir.
        // Şimdiki yapı `MainHeader` içindeki `fixed top-0` div'in içine yerleşecek şekilde.
        // `NavigationMenu` kendi `absolute top-full` vs. gibi pozisyonlandırmasını içermiyorsa,
        // `MainHeader`'daki fixed div'in içeriğini direkt olarak bu `div` oluşturmalı.
        // Kullanıcının orijinal NavigationMenu.tsx'inde `absolute top-full` vardı, bunu koruyalım.
        <div className="absolute top-full left-0 w-full bg-white shadow-lg border-t border-gray-200 z-30 max-h-[calc(100vh-76px-0px)]"> {/* 76px header, 0px mobil butonlar (kaldırıldı) */}
          <div className="px-3 py-3 space-y-1 max-h-[inherit] overflow-y-auto"> {/* max-h-[calc(100vh-120px)] yerine inherit kullandık, üst div yönetecek */}
            {menuItems.map((group) => (
              <div key={group.groupName}>
                {group.pages.length === 0 ? (
                  <Link
                    href={`/${group.groupName.toLocaleLowerCase("tr-TR").replace(/\s+/g, "-")}`}
                    className={`block py-2.5 px-3.5 text-base text-gray-700 font-medium hover:bg-purple-50 hover:text-[#6A3C96] rounded-lg transition-colors duration-150 ${
                      pathname === `/${group.groupName.toLocaleLowerCase("tr-TR").replace(/\s+/g, "-")}` ? "bg-purple-100 text-[#6A3C96]" : ""
                    }`}
                    onClick={handleMobileLinkClick}
                  >
                    {group.groupName}
                  </Link>
                ) : (
                  <>
                    <button
                      onClick={() => toggleMobileDropdown(group.groupName)}
                      className="w-full flex justify-between items-center py-2.5 px-3.5 text-base text-gray-700 font-medium hover:bg-purple-50 hover:text-[#6A3C96] rounded-lg transition-colors duration-150"
                    >
                      <span>{group.groupName}</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform duration-200 ${activeDropdown === group.groupName ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {activeDropdown === group.groupName && (
                      <ul className="pl-4 mt-1.5 mb-1 space-y-1 border-l-2 border-purple-200 ml-1.5">
                        {group.pages.map((page) => (
                          <li key={page.slug}>
                            <Link
                              href={`/${page.slug}`}
                              className={`block py-2 px-3 text-sm text-gray-600 hover:text-[#6A3C96] hover:bg-purple-50 rounded-md transition-colors duration-150 ${
                                pathname === `/${page.slug}` ? "text-[#6A3C96] bg-purple-100 font-semibold" : ""
                              }`}
                              onClick={handleMobileLinkClick}
                            >
                              {page.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                )}
              </div>
            ))}

            {/* === MOBİL MENÜ İÇİN GARAJ VE GİRİŞ/PROFİL LİNKLERİ === */}
            <div className="mt-4 pt-4 border-t border-gray-200 space-y-1">
              <Link
                href="/garaj"
                className="block py-2.5 px-3.5 text-base text-gray-700 font-medium hover:bg-purple-50 hover:text-[#6A3C96] rounded-lg transition-colors duration-150"
                onClick={handleMobileLinkClick}
              >
                Garaj
              </Link>
              <Link
                href={userName ? "/profil" : "/giris"}
                className={`block py-2.5 px-3.5 text-base font-medium rounded-lg transition-colors duration-150 ${
                  userName
                    ? "text-green-700 hover:bg-green-100"
                    : "text-gray-700 hover:bg-purple-50 hover:text-[#6A3C96]"
                }`}
                onClick={handleMobileLinkClick}
              >
                {userName || "Giriş Yap"}
              </Link>
            </div>
            {/* === MOBİL MENÜ GARAJ VE GİRİŞ/PROFİL LİNKLERİ SONU === */}

            {/* MOBİL MENÜ İÇİN SOSYAL MEDYA İKONLARI */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-center items-center space-x-5 px-4 py-2">
                <Link href="https://www.facebook.com/lenacars2020/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[#6A3C96] transition-colors" aria-label="Facebook">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" /></svg>
                </Link>
                <Link href="https://www.instagram.com/lena.cars/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[#6A3C96] transition-colors" aria-label="Instagram">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                </Link>
                <Link href="https://tr.linkedin.com/company/lenacars" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[#6A3C96] transition-colors" aria-label="LinkedIn">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" /></svg>
                </Link>
                <Link href="https://www.youtube.com/channel/UCHSB4vxpEegkVmop4qJqCPQ" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[#6A3C96] transition-colors" aria-label="YouTube">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" /></svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {!isMobileFromParent && (
        <div className="max-w-screen-xl mx-auto flex justify-center items-center px-4 py-3 space-x-6 lg:space-x-8 text-sm">
          {menuItems.map((group) => (
            <div key={group.groupName} className="relative group">
              {group.pages.length === 0 ? (
                <Link
                  href={`/${group.groupName.toLocaleLowerCase("tr-TR").replace(/\s+/g, "-")}`}
                  className={`relative py-2 text-gray-600 hover:text-[#6A3C96] font-medium transition-colors duration-200 whitespace-nowrap ${
                    pathname === `/${group.groupName.toLocaleLowerCase("tr-TR").replace(/\s+/g, "-")}` ? "text-[#6A3C96]" : ""
                  } after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[3px] after:bg-[#6A3C96] after:transition-all after:duration-300 ${
                    pathname === `/${group.groupName.toLocaleLowerCase("tr-TR").replace(/\s+/g, "-")}` ? "after:w-full" : "after:w-0 group-hover:after:w-3/4"
                  }`}
                >
                  {group.groupName}
                </Link>
              ) : (
                <>
                  <span className="cursor-default py-2 flex items-center text-gray-600 group-hover:text-[#6A3C96] font-medium transition-colors duration-200 whitespace-nowrap relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[3px] after:bg-[#6A3C96] after:transition-all after:duration-300 after:w-0 group-hover:after:w-3/4">
                    {group.groupName}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1.5 text-gray-400 group-hover:text-[#6A3C96] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                  <div className="absolute left-1/2 -translate-x-1/2 mt-1.5 w-auto min-w-[200px] bg-white shadow-xl border border-gray-100 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:mt-1 transition-all duration-200 ease-out z-50">
                    <ul className="py-2">
                      {group.pages.map((page) => (
                        <li key={page.slug}>
                          <Link
                            href={`/${page.slug}`}
                            className={`block w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-purple-50 hover:text-[#6A3C96] transition-colors duration-150 whitespace-nowrap ${
                              pathname === `/${page.slug}` ? "bg-purple-100 text-[#6A3C96] font-semibold" : ""
                            }`}
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
