"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { ChevronDown } from 'lucide-react'

// Menü verisi
const menuItems = [
  {
    title: "Kurumsal",
    items: [
      { label: "Hakkımızda", href: "/kurumsal/hakkimizda" },
      { label: "Liderlik Ekibimiz", href: "/kurumsal/liderlik-ekibimiz" },
      { label: "Ödüllerimiz", href: "/kurumsal/odullerimiz" },
      { label: "İnsan Kaynakları", href: "/kurumsal/insan-kaynaklari" },
    ],
  },
  // ... diğer menü öğeleri
];

const singleMenuItems = [
  { label: "Elektrikli Araçlar", href: "/elektrikli-araclar" },
  // ... diğer tek menü öğeleri
];

export default function NavigationMenuDesktop() {
  const [activeMenu, setActiveMenu] = useState(null);
  const menuRefs = useRef({});

  // Menü dışına tıklandığında menüyü kapat
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (activeMenu && !menuRefs.current[activeMenu]?.contains(event.target)) {
        setActiveMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activeMenu]);

  const toggleMenu = (title) => {
    setActiveMenu(activeMenu === title ? null : title);
  };

  return (
    <div className="hidden md:block border-t border-b py-2">
      <div className="container mx-auto">
        <nav className="flex items-center justify-center">
          {menuItems.map((menu) => (
            <div 
              key={menu.title}
              className="relative"
              ref={(el) => (menuRefs.current[menu.title] = el)}
            >
              <button 
                className="flex items-center px-4 py-2 text-sm font-medium hover:text-[#6A3C96]"
                onClick={() => toggleMenu(menu.title)}
              >
                {menu.title}
                <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${activeMenu === menu.title ? 'rotate-180' : ''}`} />
              </button>
              
              {activeMenu === menu.title && (
                <div 
                  className="absolute left-0 top-full z-50 mt-1 w-[300px] rounded-md border bg-white shadow-lg"
                >
                  <ul className="py-2">
                    {menu.items.map((item) => (
                      <li key={item.href}>
                        <Link 
                          href={item.href} 
                          className="block px-4 py-2 text-sm hover:bg-gray-100"
                          onClick={() => setActiveMenu(null)}
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
          
          {singleMenuItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href}
              className="px-4 py-2 text-sm font-medium hover:text-[#6A3C96]"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
