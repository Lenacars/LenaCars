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
    if (typeof window !== "undefined" && window.location.pathname !== "/") {
      router.push(`/?search=${encodeURIComponent(searchTerm.trim())}`);
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
          <div className="flex items-center space-x-4">
            <Link href="/iletisim" className="flex items-center hover:text-gray-200" aria-label="Adres">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </Link>
            <Link href="/iletisim" className="flex items-center hover:text-gray-200" aria-label="E-posta">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </Link>
            <Link href="/iletisim" className="flex items-center hover:text-gray-200" aria-label="Telefon">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </Link>
          </div>

          <div className="text-center hidden md:block">
            <h2 className="text-lg font-medium">Yüzlerce Araç Tek Ekranda Seç Beğen Güvenle Kirala</h2>
          </div>

         div className="hidden md:flex items-center space-x-3">
  <Link href="https://facebook.com" target="_blank" className="hover:text-gray-200" aria-label="Facebook">
    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="h-5 w-5 text-white" viewBox="0 0 24 24">
      <path d="M9 8H6v4h3v12h5V12h4l1-4h-5V6c0-.828.172-1 1-1h4V0h-5c-4 0-5 2-5 5v3z" />
    </svg>
  </Link>
  <Link href="https://instagram.com" target="_blank" className="hover:text-gray-200" aria-label="Instagram">
    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="h-5 w-5 text-white" viewBox="0 0 24 24">
      <path d="M12 2.2c3.2 0 3.6.012 4.85.07 3.252.148 4.77 1.69 4.92 4.92.057 1.264.07 1.645.07 4.85s-.012 3.586-.07 4.85c-.15 3.225-1.67 4.77-4.92 4.92-1.265.057-1.645.07-4.85.07s-3.586-.013-4.85-.07c-3.225-.15-4.77-1.67-4.92-4.92C2.213 15.586 2.2 15.205 2.2 12s.013-3.586.07-4.85c.15-3.225 1.67-4.77 4.92-4.92C8.414 2.213 8.795 2.2 12 2.2zm0 1.8C8.72 4 8.34 4.012 7.08 4.07c-2.707.123-3.632 1.04-3.755 3.755C3.26 8.34 3.25 8.72 3.25 12s.01 3.66.07 4.92c.123 2.717 1.048 3.632 3.755 3.755C8.34 20 8.72 20.01 12 20.01s3.66-.01 4.92-.07c2.717-.123 3.632-1.048 3.755-3.755.058-1.26.07-1.64.07-4.92s-.012-3.66-.07-4.92c-.123-2.717-1.048-3.632-3.755-3.755C15.66 4.012 15.28 4 12 4zm0 2.8a5.2 5.2 0 110 10.4 5.2 5.2 0 010-10.4zm0 1.8a3.4 3.4 0 100 6.8 3.4 3.4 0 000-6.8zm5.2-.9a1.2 1.2 0 11-2.4 0 1.2 1.2 0 012.4 0z" />
    </svg>
  </Link>
  <Link href="https://linkedin.com" target="_blank" className="hover:text-gray-200" aria-label="LinkedIn">
    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="h-5 w-5 text-white" viewBox="0 0 24 24">
      <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.11 1 2.5 1s2.48 1.12 2.48 2.5zM.08 8h4.83V24H.08V8zM7.98 8h4.63v2.2c.6-1.1 2.3-2.2 4.37-2.2 4.68 0 5.54 3.1 5.54 7.1V24h-4.8v-6.9c0-1.6 0-3.7-2.26-3.7s-2.6 1.74-2.6 3.6V24H7.98V8z" />
    </svg>
  </Link>
  <Link href="https://youtube.com" target="_blank" className="hover:text-gray-200" aria-label="YouTube">
    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="h-5 w-5 text-white" viewBox="0 0 24 24">
      <path d="M21.8 8.001c-.2-1.5-.8-2.6-2.3-2.8C17.2 5 12 5 12 5s-5.2 0-7.5.2c-1.5.2-2.1 1.3-2.3 2.8-.2 1.8-.2 5.5 0 7.2.2 1.5.8 2.6 2.3 2.8C6.8 20 12 20 12 20s5.2 0 7.5-.2c1.5-.2 2.1-1.3 2.3-2.8.2-1.8.2-5.5 0-7.2zM9.75 15.02V8.98l6 3.02-6 3.02z" />
    </svg>
  </Link>
</div>

      {/* LOGO + ARAMA KUTUSU BURASI */}
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
            />
          </Link>

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
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </form>

          {/* GARAJ / GİRİŞ BUTONLARI */}
          <div className="hidden md:flex items-center space-x-3">
            <Link href="/garaj" className="border border-[#6A3C96] text-[#6A3C96] px-4 py-2 rounded-md flex items-center hover:bg-gray-50">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2..." />
              </svg>
              Garaj
            </Link>
            <Link
              href={userName ? "/profil" : "/giris"}
              className={`${
                userName ? "bg-green-100 text-green-700" : "bg-[#6A3C96] text-white hover:bg-[#5a3080]"
              } px-4 py-2 rounded-md transition-colors`}
            >
              {userName || "Giriş Yap / Üye Ol"}
            </Link>
          </div>
        </div>
      </div>

      <NavigationMenu
        menuItems={mainMenuItems}
        isMobile={isMobile}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        activeDropdown={activeDropdown}
        toggleDropdown={toggleDropdown}
      />

      {/* MOBİL ARAMA */}
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
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6..." />
              </svg>
            </button>
          </div>
        </form>
      )}
    </header>
  );
}
