"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronDown } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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
const NavDropdownMenu = ({ title, items }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <button 
            className="flex items-center px-4 py-2 text-sm font-medium hover:text-[#6A3C96]"
          >
            {title}
            <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent 
          align="center" 
          sideOffset={5}
          className="w-[300px]"
        >
          {items.map((item) => (
            <DropdownMenuItem key={item.href} asChild>
              <Link 
                href={item.href} 
                className="block p-2 rounded hover:bg-gray-100 text-sm font-medium"
              >
                {item.label}
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default function NavigationMenuDesktop() {
  return (
    <div className="hidden md:block border-t border-b py-2">
      <div className="container mx-auto">
        <div className="flex items-center justify-center space-x-2">
          {menuItems.map((menu) => (
            <NavDropdownMenu key={menu.title} title={menu.title} items={menu.items} />
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
