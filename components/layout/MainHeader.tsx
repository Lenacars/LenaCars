"use client";

export const dynamic = "force-dynamic";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase-browser";
import NavigationMenu from "@/components/layout/NavigationMenu";
import { useSearch } from "@/context/SearchContext";

export default function MainHeader() {
  const router = useRouter();
  const { searchTerm, setSearchTerm } = useSearch();
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const fetchMenuItems = async () => {
      const { data, error } = await supabase
        .from("Pages")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: true });

      if (!error && data) {
        const grouped = data.reduce((acc, item) => {
          if (item.menu_group === "main") {
            acc.push({
              title: item.title,
              slug: item.slug,
              menu_group: item.menu_group,
              subItems: data
                .filter(sub => sub.parent === item.slug)
                .map(sub => ({
                  title: sub.title,
                  slug: sub.slug,
                  menu_group: sub.menu_group,
                  isExternal: sub.slug.startsWith("http")
                }))
            });
          }
          return acc;
        }, [] as any[]);
        setMenuItems(grouped);
      }
    };

    fetchMenuItems();
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
        setActiveDropdown(null);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData.session?.user?.id;
      if (!userId) return;

      const { data, error } = await supabase
        .from("kullanicilar")
        .select("ad, soyad")
        .eq("id", userId)
        .single();

      if (data && !error) {
        setUserName(`${data.ad} ${data.soyad}`);
      }
    };

    fetchUser();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (window.location.pathname !== "/") {
      router.push(`/?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  const toggleDropdown = (menuGroup: string) => {
    setActiveDropdown(activeDropdown === menuGroup ? null : menuGroup);
  };

  const mainMenuItems = menuItems.filter(item => item.menu_group === "main");

  return (
    <header>
      {/* Üst Bilgi Çubuğu */}
      <div className="bg-[#6A3C96] text-white py-3 px-4">
        <div className="container mx-auto flex justify-between items-center">
          {/* İletişim ikonları */}
          <div className="flex items-center space-x-4">
            <Link href="/iletisim" aria-label="Adres">📍</Link>
            <Link href="/iletisim" aria-label="E-Posta">📧</Link>
            <Link href="/iletisim" aria-label="Telefon">📞</Link>
          </div>

          <div className="text-center hidden md:block">
            <h2 className="text-lg font-medium">
              Yüzlerce Araç Tek Ekranda Seç Beğen Güvenle Kirala
            </h2>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link href="https://facebook.com" target="_blank" aria-label="Facebook">📘</Link>
            <Link href="https://instagram.com" target="_blank" aria-label="Instagram">📸</Link>
            <Link href="https://linkedin.com" target="_blank" aria-label="LinkedIn">💼</Link>
            <Link href="https://youtube.com" target="_blank" aria-label="YouTube">📺</Link>
          </div>
        </div>
      </div>

      {/* Logo + Arama + Giriş */}
      <div className="bg-white py-4 px-4 shadow-sm">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/LENACARS.svg"
              alt="LenaCars Logo"
              width={200}
              height={60}
              className="w-auto h-auto max-h-16"
              priority
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                if (!target.src.includes(".png")) {
                  target.src = "/LENACARS.png";
                }
              }}
            />
          </Link>

          {/* Arama Kutusu */}
          <form onSubmit={handleSearch} className="hidden md:block flex-grow mx-4 max-w-md relative">
            <input
              type="text"
              placeholder="Araç Ara"
              className="w-full py-2 px-4 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-[#6A3C96]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              type="submit"
              className="absolute right-0 top-0 h-full px-4 bg-[#E67E22] text-white rounded-r-md hover:bg-[#D35400]"
              aria-label="Ara"
            >
              🔍
            </button>
          </form>

          {/* Giriş */}
          <div className="hidden md:flex items-center space-x-3">
            <Link
              href="/garaj"
              className="border border-[#6A3C96] text-[#6A3C96] px-4 py-2 rounded-md hover:bg-gray-50"
            >
              Garaj
            </Link>
            <Link
              href={userName ? "/profil" : "/giris"}
              className={`${
                userName ? "bg-green-100 text-green-700" : "bg-[#6A3C96] text-white hover:bg-[#5a3080]"
              } px-4 py-2 rounded-md`}
            >
              {userName || "Giriş Yap / Üye Ol"}
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Menü */}
      <NavigationMenu
        menuItems={mainMenuItems}
        isMobile={isMobile}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        activeDropdown={activeDropdown}
        toggleDropdown={toggleDropdown}
      />

      {/* Mobil Arama Kutusu */}
      {isMobile && (
        <form onSubmit={handleSearch} className="bg-white py-2 px-4 border-t border-gray-200">
          <div className="relative">
            <input
              type="text"
              placeholder="Araç Ara"
              className="w-full py-2 px-4 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-[#6A3C96]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              type="submit"
              className="absolute right-0 top-0 h-full px-4 bg-[#E67E22] text-white rounded-r-md hover:bg-[#D35400]"
              aria-label="Ara"
            >
              🔍
            </button>
          </div>
        </form>
      )}
    </header>
  );
}
