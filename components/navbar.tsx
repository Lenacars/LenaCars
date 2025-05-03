"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface Page {
  id: string;
  title: string;
  slug: string;
  menu_group: string;
}

export default function Navbar() {
  const [pages, setPages] = useState<Page[]>([]);

  useEffect(() => {
    async function fetchPages() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pages`, {
          next: { revalidate: 60 }, // Opsiyonel: 60 saniyede bir cache güncellesin
        });
        if (response.ok) {
          const data = await response.json();
          setPages(data);
        } else {
          console.error("Sayfalar çekilemedi.");
        }
      } catch (error) {
        console.error("Sayfalar alınırken hata oluştu:", error);
      }
    }
    fetchPages();
  }, []);

  const menuGroups = [
    "Kurumsal",
    "Kiralama",
    "İkinci El",
    "LenaCars Bilgilendiriyor",
    "Elektrikli Araçlar",
    "Basın Köşesi",
  ];

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex space-x-8 py-4">
          {menuGroups.map((group) => {
            const groupPages = pages.filter((page) => page.menu_group === group);

            return (
              <div key={group} className="relative group">
                <button className="text-gray-700 font-medium hover:text-purple-700">
                  {group}
                </button>

                {groupPages.length > 0 && (
                  <div className="absolute hidden group-hover:block bg-white shadow-md rounded-md mt-2 z-50 min-w-[200px]">
                    {groupPages.map((page) => (
                      <Link
                        key={page.id}
                        href={`/${page.slug}`}
                        className="block px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-purple-700"
                      >
                        {page.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
