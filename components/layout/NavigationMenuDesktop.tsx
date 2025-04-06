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

// Dropdown Menü Bileşeni
const DropdownMenu = ({ title, items }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative" onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
      <button 
        className="flex items-center px-4 py-2 text-sm font-medium hover:text-[#6A3C96]"
        onClick={() => setIsOpen(!isOpen)}
      >
        {title}
        <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute left-0 top-full z-10 mt-1 w-[300px] rounded-md border bg-white shadow-lg">
          <ul className="grid gap-2 p-4">
            {items.map((item) => (
              <li key={item.href}>
                <Link 
                  href={item.href} 
                  className="block p-2 rounded hover:bg-gray-100 text-sm font-medium"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default function NavigationMenuDesktop() {
  return (
    <div className="hidden md:block border-t border-b py-2">
      <div className="container mx-auto">
        <div className="flex items-center justify-center space-x-2">
          {menuItems.map((menu) => (
            <DropdownMenu key={menu.title} title={menu.title} items={menu.items} />
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
        </div>
      </div>
    </div>
  );
}
