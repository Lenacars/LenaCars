"use client";

import Link from "next/link";
// import { useState, useEffect } from "react"; // MainHeader'dan props alacağı için kaldırıldı
// import { supabase } from "@/lib/supabase-browser"; // MainHeader'dan props alacağı için kaldırıldı

// MainHeader'dan gelecek menu item tipi (MainHeader'daki tanımla aynı olmalı)
interface SubMenuItemData {
  title: string;
  slug: string;
  isExternal: boolean;
}
interface ProcessedMenuItem { // Bu NavigationMenu'nün prop olarak alacağı tip
  title: string; // Grup adı veya tekil link başlığı
  slug: string;  // Tekil link ise kullanılacak slug
  isExternal: boolean; // Dış link mi?
  subItems: SubMenuItemData[]; // Alt menü öğeleri (dropdown için)
}

interface NavigationMenuProps {
  menuItems: ProcessedMenuItem[];
  isMobile: boolean;
  isMenuOpen: boolean; // MainHeader'dan gelecek mobil menü durumu
  setIsMenuOpen: (isOpen: boolean) => void; // MainHeader'daki state'i güncelleyecek fonksiyon
  activeDropdown: string | null; // MainHeader'dan gelecek aktif dropdown
  toggleDropdown: (groupName: string) => void; // MainHeader'daki state'i güncelleyecek fonksiyon
}

export default function NavigationMenu({
  menuItems,
  isMobile,
  isMenuOpen,
  setIsMenuOpen,
  activeDropdown,
  toggleDropdown,
}: NavigationMenuProps) {
  // Dahili state'ler MainHeader'a taşındığı için buradan kaldırıldı.
  // Veri çekme de MainHeader'a taşındı.

  // Slug oluşturma fonksiyonu (MainHeader'daki mantıkla uyumlu olabilir veya özel slug'lar kullanılabilir)
  const generateSlug = (title: string) => {
    return title.toLowerCase()
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '');
  };

  return (
    // Nav bar için yumuşak gölge ve border
    <nav className="bg-white border-b border-gray-100 shadow-sm" id="mobile-navigation-menu">
      {/* Mobil Menü Butonu (Bu artık MainHeader içinde, burada sadece mobil menü içeriği olacak) */}
      {/* Eğer mobil menü açma/kapama butonu burada kalacaksa MainHeader'dan gelen setIsMenuOpen kullanılmalı */}
      {/* Ancak önceki MainHeader düzenlemesinde bu buton MainHeader içindeydi. */}
      {/* Bu sebeple aşağıdaki mobil menü butonu kısmını yorum satırına alıyorum. */}
      {/* <div className="md:hidden flex justify-between items-center px-4 py-3">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)} // Propstan gelen fonksiyonu kullan
          className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
          <span className="ml-2 font-medium text-sm">Menü</span>
        </button>
      </div>
      */}

      {/* Mobil Menü İçeriği */}
      {isMobile && isMenuOpen && (
        <div className="md:hidden border-t border-gray-100">
          <ul className="px-3 py-3 space-y-1">
            {menuItems.map((item) => (
              <li key={item.title}>
                {item.subItems && item.subItems.length === 0 && !item.isExternal ? ( // Alt menüsü yoksa ve dış link değilse
                  <Link
                    href={item.slug || `/${generateSlug(item.title)}`}
                    onClick={() => setIsMenuOpen(false)} // Menüyü kapat
                    className="block py-2.5 px-4 text-sm font-medium text-gray-700 hover:bg-primary/10 hover:text-primary rounded-lg transition-colors"
                  >
                    {item.title}
                  </Link>
                ) : item.isExternal ? ( // Dış link ise
                  <a
                    href={item.slug}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsMenuOpen(false)}
                    className="block py-2.5 px-4 text-sm font-medium text-gray-700 hover:bg-primary/10 hover:text-primary rounded-lg transition-colors"
                  >
                    {item.title} <span className="text-xs">↗</span>
                  </a>
                ) : ( // Alt menüsü varsa (dropdown)
                  <>
                    <button
                      onClick={() => toggleDropdown(item.title)}
                      className="w-full flex justify-between items-center py-2.5 px-4 text-sm font-medium text-gray-700 hover:bg-primary/10 hover:text-primary rounded-lg transition-colors focus:outline-none"
                    >
                      <span>{item.title}</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-4 w-4 transition-transform duration-200 ${
                          activeDropdown === item.title ? "rotate-180" : ""
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {activeDropdown === item.title && (
                      <ul className="pl-5 mt-1 mb-2 space-y-1 border-l-2 border-primary/20">
                        {item.subItems.map((subItem) => (
                          <li key={subItem.slug}>
                            {subItem.isExternal ? (
                                <a
                                href={subItem.slug}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => setIsMenuOpen(false)}
                                className="block py-2 px-3 text-xs text-gray-600 hover:bg-gray-50 hover:text-primary rounded-md transition-colors"
                                >
                                {subItem.title} <span className="text-xs">↗</span>
                                </a>
                            ) : (
                                <Link
                                href={subItem.slug || `/${generateSlug(subItem.title)}`}
                                onClick={() => setIsMenuOpen(false)}
                                className="block py-2 px-3 text-xs text-gray-600 hover:bg-gray-50 hover:text-primary rounded-md transition-colors"
                                >
                                {subItem.title}
                                </Link>
                            )}
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

      {/* Desktop Menü */}
      {!isMobile && (
        // Ortalama ve padding/spacing ayarları
        <div className="max-w-screen-xl mx-auto flex justify-center items-center px-4 py-2.5 space-x-6 lg:space-x-8 text-sm">
          {menuItems.map((item) => (
            <div key={item.title} className="relative group">
              {item.subItems && item.subItems.length === 0 && !item.isExternal ? ( // Alt menüsü yoksa ve dış link değilse
                <Link
                  href={item.slug || `/${generateSlug(item.title)}`}
                  className="text-gray-700 hover:text-primary font-medium px-2 py-2 rounded-md hover:bg-primary/10 transition-colors"
                >
                  {item.title}
                </Link>
              ) : item.isExternal ? ( // Dış link ise
                <a
                  href={item.slug}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-700 hover:text-primary font-medium px-2 py-2 rounded-md hover:bg-primary/10 transition-colors flex items-center"
                >
                  {item.title} <span className="text-xs ml-1">↗</span>
                </a>
              ) : ( // Alt menüsü varsa (dropdown)
                <>
                  <span className="cursor-pointer text-gray-700 hover:text-primary font-medium px-2 py-2 rounded-md hover:bg-primary/10 transition-colors flex items-center">
                    {item.title}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 ml-1 text-gray-400 group-hover:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                  {/* Dropdown içeriği için yumuşak köşeler, gölge ve geçiş efektleri */}
                  <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-56 bg-white shadow-lg border border-gray-100 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:translate-y-1 transition-all duration-200 ease-out z-50 transform translate-y-0">
                    <ul className="py-2">
                      {item.subItems.map((subItem) => (
                        <li key={subItem.slug}>
                           {subItem.isExternal ? (
                            <a
                                href={subItem.slug}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block px-4 py-2.5 text-xs text-gray-700 hover:bg-primary hover:text-white transition-colors"
                            >
                                {subItem.title} <span className="text-xs">↗</span>
                            </a>
                           ) : (
                            <Link
                                href={subItem.slug || `/${generateSlug(subItem.title)}`}
                                className="block px-4 py-2.5 text-xs text-gray-700 hover:bg-primary hover:text-white transition-colors"
                            >
                                {subItem.title}
                            </Link>
                           )}
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
