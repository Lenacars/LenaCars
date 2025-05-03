"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getMenuPages } from "@/lib/getMenuPages";

interface Page {
  id: string;
  title: string;
  slug: string;
}

export default function NavigationMenu() {
  const [menuPages, setMenuPages] = useState<Page[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMenuPages = async () => {
      const pages = await getMenuPages();
      setMenuPages(pages);
      setIsLoading(false);
    };

    fetchMenuPages();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <nav className="bg-white border-t border-b border-gray-200">
      <div className="container mx-auto px-4">
        <ul className="flex flex-wrap justify-center md:justify-start space-x-1 md:space-x-6">
          {menuPages.map((page) => (
            <li key={page.id} className="relative group py-4">
              <Link
                href={`/${page.slug}`}
                className="flex items-center text-gray-800 hover:text-[#6A3C96] font-medium transition-colors"
              >
                {page.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
