"use client";

import Link from "next/link";

interface SubItem {
  title: string;
  slug: string; // slug veya tam external URL olabilir
  isExternal?: boolean;
}

interface MenuItem {
  title: string;
  slug: string; // slug veya tam external URL olabilir
  isExternal?: boolean;
  subItems?: SubItem[];
}

interface Props {
  menuItems: MenuItem[];
  isMobile?: boolean;
  isMobileMenuOpen?: boolean;
  setIsMobileMenuOpen?: (val: boolean) => void;
  activeDropdown?: string | null;
  toggleDropdown?: (val: string) => void;
}

export default function NavigationMenu({
  menuItems = [],
  isMobile = false,
  isMobileMenuOpen = false,
  setIsMobileMenuOpen,
  activeDropdown,
  toggleDropdown,
}: Props) {
  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <ul className={`flex ${isMobile ? "flex-col" : "flex-row"} space-x-4`}>
          {menuItems.map((item) => (
            <li key={item.slug} className="relative group py-4">
              <Link
                href={item.isExternal ? item.slug : `/${item.slug}`}
                target={item.isExternal ? "_blank" : "_self"}
                rel={item.isExternal ? "noopener noreferrer" : undefined}
                className="flex items-center text-gray-800 hover:text-[#6A3C96] font-medium transition-colors"
              >
                {item.title}
                {item.isExternal && <span className="ml-1 text-sm">↗</span>}
              </Link>

              {item.subItems && item.subItems.length > 0 && (
                <ul className="absolute top-full left-0 mt-2 bg-white shadow-lg rounded-md z-20 hidden group-hover:block">
                  {item.subItems.map((sub) => (
                    <li key={sub.slug}>
                      <Link
                        href={sub.isExternal ? sub.slug : `/${sub.slug}`}
                        target={sub.isExternal ? "_blank" : "_self"}
                        rel={sub.isExternal ? "noopener noreferrer" : undefined}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        {sub.title}
                        {sub.isExternal && <span className="ml-1 text-xs">↗</span>}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
