"use client";

export const dynamic = "force-dynamic";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase-browser";
import NavigationMenu from "@/components/layout/NavigationMenu";

export default function MainHeader() {
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
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
        setUserName(${data.ad} ${data.soyad});
      }
    };

    fetchUser();
  }, []);

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
          {/* Orta Metin */}
          <div className="text-center hidden md:block">
            <h2 className="text-lg font-medium">Yüzlerce Araç Tek Ekranda Seç Beğen Güvenle Kirala</h2>
          </div>
          {/* Sosyal medya ikonları eklendi */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Sosyal Medya İkonları */}
            <Link href="https://facebook.com" target="_blank" className="hover:text-gray-200" aria-label="Facebook">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-5 w-5"
              >
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
              </svg>
            </Link>
            <Link href="https://instagram.com" target="_blank" className="hover:text-gray-200" aria-label="Instagram">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-5 w-5"
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </Link>
            <Link href="https://linkedin.com" target="_blank" className="hover:text-gray-200" aria-label="LinkedIn">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-5 w-5"
              >
                <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
              </svg>
            </Link>
            <Link href="https://youtube.com" target="_blank" className="hover:text-gray-200" aria-label="YouTube">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-5 w-5"
              >
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Logo + Arama + Giriş Butonları */}
      <div className="bg-white py-4 px-4 shadow-sm">
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo */}
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
          <div className="hidden md:block flex-grow mx-4 max-w-md">
            <div className="relative">
              <input
                type="text"
                placeholder="Araç Ara"
                className="w-full py-2 px-4 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-[#6A3C96] focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                className="absolute right-0 top-0 h-full px-4 bg-[#E67E22] text-white rounded-r-md hover:bg-[#D35400] transition-colors"
                aria-label="Ara"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobil Menü Butonu */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none"
              aria-label={isMobileMenuOpen ? "Menüyü Kapat" : "Menüyü Aç"}
            >
              {isMobileMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

          {/* Garaj + Giriş/Profil Butonu */}
          <div className="hidden md:flex items-center space-x-3">
            <Link
              href="/garaj"
              className="border border-[#6A3C96] text-[#6A3C96] px-4 py-2 rounded-md flex items-center hover:bg-gray-50 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Garaj
            </Link>

            <Link
              href={userName ? "/profil" : "/giris"}
              className={${
                userName ? "bg-green-100 text-green-700" : "bg-[#6A3C96] text-white hover:bg-[#5a3080]"
              } px-4 py-2 rounded-md transition-colors}
            >
              {userName || "Giriş Yap / Üye Ol"}
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <NavigationMenu
        menuItems={mainMenuItems}
        isMobile={isMobile}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        activeDropdown={activeDropdown}
        toggleDropdown={toggleDropdown}
      />

      {/* Mobil Arama */}
      {isMobile && (
        <div className="bg-white py-2 px-4 border-t border-gray-200">
          <div className="relative">
            <input
              type="text"
              placeholder="Araç Ara"
              className="w-full py-2 px-4 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-[#6A3C96] focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              className="absolute right-0 top-0 h-full px-4 bg-[#E67E22] text-white rounded-r-md hover:bg-[#D35400] transition-colors"
              aria-label="Ara"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
