"use client";

export const dynamic = "force-dynamic";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef, FormEvent } from "react";
import { supabase } from "@/lib/supabase-browser";
import NavigationMenu from "@/components/layout/NavigationMenu";
import { useSearch } from "@/context/SearchContext";
import { getMenuPages } from "@/lib/getMenuPages";

// toTitleCase Fonksiyonu (loglar şimdilik duruyor)
function toTitleCase(str: string | null | undefined) {
  // console.log("toTitleCase GİRDİ:", str, "| Tip:", typeof str);
  if (!str) {
    // console.log("toTitleCase ÇIKTI (null/undefined giriş için):", "");
    return "";
  }
  const result = str
    .toLocaleLowerCase("tr-TR")
    .trim()
    .split(/\s+/)
    .map((word) => {
      if (word.length === 0) return "";
      return word.charAt(0).toLocaleUpperCase("tr-TR") + word.slice(1);
    })
    .join(" ");
  // console.log("toTitleCase ÇIKTI ('" + str + "' için):", result);
  return result;
}

interface VehicleSuggestion {
  id: string;
  name: string;
  slug?: string;
  cover_image?: string;
  price?: number;
}

export default function MainHeader() {
  const { searchTerm, setSearchTerm } = useSearch();
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  const [suggestions, setSuggestions] = useState<VehicleSuggestion[]>([]);
  const [allVehiclesForSuggestions, setAllVehiclesForSuggestions] = useState<VehicleSuggestion[]>([]);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Mevcut useEffect'leriniz (logları temizlenmiş haliyle)
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const data = await getMenuPages();
        if (!data || data.length === 0) {
          setMenuItems([]);
          return;
        }
        const groups: { [key: string]: any[] } = {};
        for (const page of data) {
          if (!page) continue;
          const isParent = !page.parent;
          const groupKey = toTitleCase(page.menu_group);
          if (isParent && groupKey) {
            if (!groups[groupKey]) groups[groupKey] = [];
            groups[groupKey].push(page);
          } else if (isParent) {
            groups[page.id] = [page];
          }
        }
        const sortedMenuItems = Object.entries(groups)
          .map(([groupOrParentId, pagesInGroupOrParentItemArray]) => {
            return pagesInGroupOrParentItemArray.map((parent: any) => ({
              title: toTitleCase(parent.title),
              slug: parent.external_url || parent.slug,
              isExternal: !!parent.external_url,
              group_sort_order: parent.group_sort_order ?? parent.sort_order ?? 0,
              subItems: data
                .filter((child: any) => child && child.parent === parent.id)
                .map((sub: any) => ({
                  title: toTitleCase(sub.title),
                  slug: sub.external_url || sub.slug,
                  isExternal: !!sub.external_url,
                })),
            }));
          })
          .flat()
          .sort((a: any, b: any) => (a.group_sort_order ?? 0) - (b.group_sort_order ?? 0));
        setMenuItems(sortedMenuItems);
      } catch (error) {
        console.error("fetchMenuItems sırasında hata oluştu:", error);
        setMenuItems([]);
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
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) { console.error("Error getting session:", sessionError.message); return; }
      const userId = sessionData.session?.user?.id;
      if (!userId) return;
      const { data, error } = await supabase.from("kullanicilar").select("ad, soyad").eq("id", userId).single();
      if (!error && data) { setUserName(`${data.ad} ${data.soyad}`); }
      else if (error && error.code !== 'PGRST116') { console.error("Error fetching user name:", error.message); }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchAllVehiclesForSuggestions = async () => {
      try {
        const res = await fetch("https://adminpanel-green-two.vercel.app/api/araclar", { cache: "no-store" });
        if (!res.ok) { console.error("Failed to fetch vehicles. Status:", res.status); setAllVehiclesForSuggestions([]); return; }
        const json = await res.json();
        const rawVehicles = json.data || [];
        const transformedForSuggestions: VehicleSuggestion[] = rawVehicles.map((vehicle: any) => {
          const aktifVaryasyonlar = vehicle.variations?.filter((v: any) => v.status === "Aktif") || [];
          const enDusukFiyat = aktifVaryasyonlar.length > 0 ? Math.min(...aktifVaryasyonlar.map((v: any) => v.fiyat)) : vehicle.fiyat ?? 0;
          return {
            id: vehicle.id,
            name: vehicle.isim || "Araç İsmi Yok",
            slug: vehicle.slug || vehicle.id,
            cover_image: vehicle.cover_image?.startsWith("http") ? vehicle.cover_image : vehicle.cover_image ? `https://uxnpmdeizkzvnevpceiw.supabase.co/storage/v1/object/public/images/${vehicle.cover_image.replace(/^\/+/, "")}` : "/placeholder.svg",
            price: enDusukFiyat,
          };
        });
        setAllVehiclesForSuggestions(transformedForSuggestions);
      } catch (error) { console.error("Error fetching suggestions:", error); setAllVehiclesForSuggestions([]); }
    };
    fetchAllVehiclesForSuggestions();
  }, []);

  useEffect(() => {
    if (searchTerm.trim().length > 1) {
      const filtered = allVehiclesForSuggestions.filter(vehicle => vehicle.name.toLowerCase().includes(searchTerm.toLowerCase())).slice(0, 5);
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [searchTerm, allVehiclesForSuggestions]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setSuggestions([]);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => { document.removeEventListener("mousedown", handleClickOutside); };
  }, [searchContainerRef]);

  const handleSearchFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedSearchTerm = searchTerm.trim();
    setSearchTerm(trimmedSearchTerm);
    setSuggestions([]);
    if (trimmedSearchTerm) {
      const vehicleListElement = document.getElementById('vehicle-list');
      if (vehicleListElement) {
        vehicleListElement.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const handleSuggestionClick = (suggestion: VehicleSuggestion) => {
    setSearchTerm(suggestion.name);
    setSuggestions([]);
    const vehicleListElement = document.getElementById('vehicle-list');
    if (vehicleListElement) {
      vehicleListElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  const toggleDropdown = (menuGroup: string) => {
    setActiveDropdown(activeDropdown === menuGroup ? null : menuGroup);
  };

  const mainMenuItems = [...menuItems].sort((a: any, b: any) => (a.group_sort_order ?? 0) - (b.group_sort_order ?? 0));

  return (
    <header className="sticky top-0 z-50 bg-white">
      {/* Üst Bilgi Çubuğu */}
      <div className="bg-[#6A3C96] text-white py-2.5 px-4 text-sm">
        <div className="container mx-auto flex justify-between items-center">
          {/* ... (Sol ve orta üst bar içeriği aynı) ... */}
          <div className="flex items-center space-x-3 md:space-x-4">
             {/* İletişim İkonları */}
          </div>
          <div className="text-center hidden md:block">
            <h2 className="text-sm md:text-base font-medium">Yüzlerce Araç Tek Ekranda Seç Beğen Güvenle Kirala</h2>
          </div>
          <div className="hidden md:flex items-center space-x-3">
             {/* Sosyal Medya Linkleri (Linkler güncellenmişti) */}
          </div>
        </div>
      </div>

      {/* Ana Header İçeriği */}
      <div className="bg-white py-3 px-4 shadow-sm border-b border-gray-100"> {/* py-3 dikey padding ayarlandı */}
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/LENACARS.svg"
              alt="LenaCars Logo"
              width={402}  // %30 BÜYÜTÜLDÜ (yaklaşık)
              height={112} // %30 BÜYÜTÜLDÜ (yaklaşık)
              className="w-auto h-auto max-h-28" // max-h-28 (112px)
              priority
              onError={(e) => { const target = e.target as HTMLImageElement; if (target.src.endsWith(".svg")) { target.src = "/LENACARS.png"; }}}
            />
          </Link>

          {/* MASAÜSTÜ ARAMA KUTUSU */}
          <div ref={searchContainerRef} className="hidden md:flex flex-grow items-center mx-6 max-w-xl relative">
            {/* Form elementi kenarlık ve yuvarlaklığı alıyor */}
            <form
              onSubmit={handleSearchFormSubmit}
              className="relative w-full flex items-center group border border-gray-300 rounded-lg overflow-hidden shadow-sm hover:shadow-md focus-within:ring-2 focus-within:ring-[#6A3C96] focus-within:border-transparent transition-all duration-200"
            >
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#6A3C96] transition-colors pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Araç Ara (Model, Marka vb.)"
                className="w-full py-3 pl-12 pr-3 border-0 focus:outline-none focus:ring-0 text-sm bg-transparent placeholder-gray-400" // Kenarlık ve ring kaldırıldı, placeholder rengi eklendi
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => { if (searchTerm.trim().length > 1 && allVehiclesForSuggestions.length > 0) { /* ... */ } }}
              />
              <button
                type="submit"
                className="px-4 sm:px-5 h-full bg-[#6A3C96] text-white hover:bg-[#5a3080] focus:outline-none transition-colors text-sm font-medium border-0" // border-0, h-full eklendi, dikey padding input ile aynı olacak
                aria-label="Ara"
                style={{ paddingBlock: '0.75rem' }} // py-3 ile eşdeğer dikey padding (input ile aynı)
              >
                Ara
              </button>
            </form>
            {suggestions.length > 0 && (
              <ul className="absolute top-full left-0 right-0 mt-1.5 z-[60] w-full bg-white border border-gray-200 rounded-lg shadow-xl max-h-[calc(100vh-200px)] overflow-y-auto py-1.5"> {/* Z-INDEX ARTIRILDI -> z-[60] */}
                {/* ... öneri listesi içeriği aynı ... */}
              </ul>
            )}
          </div>

          {/* Sağ Kısım: Mobil Menü Butonu ve Linkler */}
          <div className="flex items-center space-x-2 sm:space-x-3">
             {/* ... (mobil menü butonu ve Garaj/Giriş Yap linkleri aynı) ... */}
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

      {/* MOBİL ARAMA KUTUSU */}
      {isMobile && (
        <div className="bg-gray-50 p-3 border-t border-gray-200">
           {/* Mobil arama kutusu da benzer şekilde form ile sarmalanıp bütünleşik yapılabilir */}
           <form onSubmit={handleSearchFormSubmit} className="relative flex items-center group border border-gray-300 rounded-lg overflow-hidden shadow-sm hover:shadow-md focus-within:ring-2 focus-within:ring-[#6A3C96] focus-within:border-transparent transition-all duration-200">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#6A3C96] transition-colors pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
            <input
              type="text"
              placeholder="Araç Ara..."
              className="w-full py-2.5 pl-12 pr-3 border-0 focus:outline-none focus:ring-0 text-sm bg-transparent placeholder-gray-400" // py-2.5 mobil için, kenarlık ve ring kaldırıldı
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
             {/* Mobil için ayrı bir arama butonu eklenebilir veya sadece enter ile arama yapılabilir */}
             <button
                type="submit"
                className="px-3 h-full bg-[#6A3C96] text-white hover:bg-[#5a3080] focus:outline-none transition-colors text-sm font-medium border-0"
                aria-label="Ara"
                style={{ paddingBlock: '0.625rem' }} // py-2.5 ile eşdeğer
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </button>
          </form>
           {isMobile && suggestions.length > 0 && (
              <ul className="mt-1.5 z-[60] w-full bg-white border border-gray-200 rounded-lg shadow-xl max-h-[calc(100vh-250px)] overflow-y-auto py-1.5"> {/* Z-INDEX ARTIRILDI */}
                {/* ... mobil öneri listesi içeriği aynı ... */}
              </ul>
            )}
        </div>
      )}
    </header>
  );
}
