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
  // Her menü için ayrı state tutuyoruz
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  const toggleMenu = (title: string) => {
    setOpenMenus(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  return (
    <div className="hidden md:block border-t border-b py-2">
      <style jsx>{`
        .menu-container {
          display: flex;
          justify-content: center;
          align-items: center;
        }
        
        .menu-item {
          position: relative;
          display: inline-block;
        }
        
        .menu-trigger {
          display: flex;
          align-items: center;
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: color 0.2s;
        }
        
        .menu-trigger:hover {
          color: #6A3C96;
        }
        
        .dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          width: 300px;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 0.375rem;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          z-index: 50;
          margin-top: 0.25rem;
        }
        
        .dropdown ul {
          list-style: none;
          padding: 0.5rem 0;
          margin: 0;
        }
        
        .dropdown li a {
          display: block;
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
          transition: background-color 0.2s;
        }
        
        .dropdown li a:hover {
          background-color: #f7fafc;
        }
        
        .single-link {
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
          font-weight: 500;
          transition: color 0.2s;
        }
        
        .single-link:hover {
          color: #6A3C96;
        }
      `}</style>
      
      <div className="container mx-auto">
        <div className="menu-container">
          {menuItems.map((menu) => (
            <div key={menu.title} className="menu-item">
              <button 
                className="menu-trigger"
                onClick={() => toggleMenu(menu.title)}
              >
                {menu.title}
                <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${openMenus[menu.title] ? 'rotate-180' : ''}`} />
              </button>
              
              {openMenus[menu.title] && (
                <div className="dropdown">
                  <ul>
                    {menu.items.map((item) => (
                      <li key={item.href}>
                        <Link 
                          href={item.href} 
                          onClick={() => toggleMenu(menu.title)}
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
              className="single-link"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
