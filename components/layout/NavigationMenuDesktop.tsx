"use client"

import { useState } from "react"
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
  {
    title: "Kiralama",
    items: [
      { label: "Kısa Süreli Kiralama", href: "/kiralama/kisa-sureli-kiralama" },
      { label: "Kiralamanın Avantajları", href: "/kiralama/kiralamanin-avantajlari" },
      { label: "Kurumsal Üyelik Programı", href: "/kiralama/kurumsal-uyelik-programi" },
      { label: "LenaCars Avantajları", href: "/kiralama/lenacars-avantajlari" },
      { label: "Tasarrufunu Hesapla", href: "/kiralama/tasarrufunu-hesapla" },
    ],
  },
  {
    title: "İkinci El",
    items: [
      { label: "Satılık Araçlarımız", href: "/ikinci-el/satilik-araclarimiz" },
      { label: "Karlı Araç Satış Hizmeti", href: "/ikinci-el/karli-arac-satis-hizmeti" },
      { label: "Taşıt Kredisi", href: "/ikinci-el/tasit-kredisi" },
    ],
  },
  {
    title: "LenaCars Bilgilendiriyor",
    items: [
      { label: "Blog", href: "/bilgilendiriyor/blog" },
      { label: "Vlog", href: "/bilgilendiriyor/vlog" },
    ],
  },
];

const singleMenuItems = [
  { label: "Elektrikli Araçlar", href: "/elektrikli-araclar" },
  { label: "Basın Köşesi", href: "/basin-kosesi" },
  { label: "S.S.S.", href: "/sss" },
  { label: "Nasıl Çalışır", href: "/nasil-calisir" },
];

export default function NavigationMenuDesktop() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const handleMouseEnter = (title: string) => {
    setActiveMenu(title);
  };

  const handleMouseLeave = () => {
    setActiveMenu(null);
  };

  return (
    <div className="hidden md:block border-t border-b py-2">
      <div className="container mx-auto">
        <nav className="flex items-center justify-center">
          {menuItems.map((menu) => (
            <div 
              key={menu.title}
              className="relative"
              onMouseEnter={() => handleMouseEnter(menu.title)}
              onMouseLeave={handleMouseLeave}
            >
              <button className="flex items-center px-4 py-2 text-sm font-medium hover:text-[#6A3C96]">
                {menu.title}
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              
              {activeMenu === menu.title && (
                <div 
                  className="absolute left-0 top-full z-10 mt-1 w-[300px] rounded-md border bg-white shadow-lg"
                  style={{ minWidth: '250px' }}
                >
                  <ul className="py-2">
                    {menu.items.map((item) => (
                      <li key={item.href}>
                        <Link 
                          href={item.href} 
                          className="block px-4 py-2 text-sm hover:bg-gray-100"
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
