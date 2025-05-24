"use client";

export const dynamic = "force-dynamic";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef, FormEvent } from "react";
import { supabase } from "@/lib/supabase-browser";
import NavigationMenu from "@/components/layout/NavigationMenu";
import { useSearch } from "@/context/SearchContext";
import { getMenuPages } from "@/lib/getMenuPages";

function toTitleCase(str: string | null | undefined): string {
  if (!str) {
    return "";
  }
  return str
    .toLocaleLowerCase("tr-TR")
    .trim()
    .split(/\s+/)
    .map((word) => {
      if (word.length === 0) return "";
      return word.charAt(0).toLocaleUpperCase("tr-TR") + word.slice(1);
    })
    .join(" ");
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
  const [menuItems, setMenuItems] = useState<any[]>([]); // NavigationMenu kendi verisini çektiği için bu state'in NavigationMenu için kullanımı kalktı.
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  const [suggestions, setSuggestions] = useState<VehicleSuggestion[]>([]);
  const [allVehiclesForSuggestions, setAllVehiclesForSuggestions] = useState<VehicleSuggestion[]>([]);
  const searchContainerRef = useRef<HTMLDivElement>(null);

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
          if (!page || typeof page.title === 'undefined') {
            console.warn("Geçersiz sayfa verisi bulundu, atlanıyor:", page);
            continue;
          }
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
            return pagesInGroupOrParentItemArray.map((parent: any) => {
              if (!parent || typeof parent.title === 'undefined') {
                  return { title: "Hatalı Veri", slug: "#", isExternal: false, group_sort_order:0, subItems: [] };
              }
              return {
                title: toTitleCase(parent.title),
                slug: parent.external_url || parent.slug,
                isExternal: !!parent.external_url,
                group_sort_order: parent.group_sort_order ?? parent.sort_order ?? 0,
                subItems: data
                  .filter((child: any) => child && child.parent === parent.id && typeof child.title !== 'undefined')
                  .map((sub: any) => ({
                    title: toTitleCase(sub.title),
                    slug: sub.external_url || sub.slug,
                    isExternal: !!sub.external_url,
                  })),
              };
            });
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

  return (
    <header className="sticky top-0 z-50 bg-white">
      {/* Üst Bilgi Çubuğu */}
      <div className="bg-[#6A3C96] text-white py-2.5 px-4 text-sm">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3 md:space-x-4">
            <Link href="/iletisim" className="flex items-center hover:text-gray-200 transition-colors" aria-label="Adres">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </Link>
            <Link href="/iletisim" className="flex items-center hover:text-gray-200 transition-colors" aria-label="E-posta">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            </Link>
            <Link href="/iletisim" className="flex items-center hover:text-gray-200 transition-colors" aria-label="Telefon">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
            </Link>
          </div>
          <div className="text-center hidden md:block">
            <h2 className="text-sm md:text-base font-medium">Yüzlerce Araç Tek Ekranda Seç Beğen Güvenle Kirala</h2>
          </div>
          <div className="hidden md:flex items-center space-x-3">
            <Link href="https://www.facebook.com/lenacars2020/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300 transition-colors" aria-label="Facebook"><svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" /></svg></Link>
            <Link href="https://www.instagram.com/lena.cars/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300 transition-colors" aria-label="Instagram"><svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg></Link>
            <Link href="https://tr.linkedin.com/company/lenacars" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300 transition-colors" aria-label="LinkedIn"><svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" /></svg></Link>
            <Link href="https://www.youtube.com/channel/UCHSB4vxpEegkVmop4qJqCPQ" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300 transition-colors" aria-label="YouTube"><svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" /></svg></Link>
          </div>
        </div>
      </div>

      <div className="bg-white py-3 px-4 shadow-sm border-b border-gray-100">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/LENACARS.svg"
              alt="LenaCars Logo"
              width={230}
              height={64}
              className="h-10 md:h-16 w-auto"
              priority
              onError={(e) => { const target = e.target as HTMLImageElement; if (target.src.endsWith(".svg")) { target.src = "/LENACARS.png"; }}}
            />
          </Link>

          {/* MASAÜSTÜ ARAMA KUTUSU */}
          <div ref={searchContainerRef} className="hidden md:flex flex-grow items-center mx-6 max-w-xl relative">
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
                className="w-full py-3 pl-12 pr-3 border-0 focus:outline-none focus:ring-0 text-sm bg-transparent placeholder-gray-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => { if (searchTerm.trim().length > 1 && allVehiclesForSuggestions.length > 0) { /* ... */ } }}
              />
              <button
                type="submit"
                className="px-4 sm:px-5 h-full bg-[#6A3C96] text-white hover:bg-[#5a3080] focus:outline-none transition-colors text-sm font-medium border-0"
                aria-label="Ara"
                style={{ paddingBlock: '0.75rem' }}
              >
                Ara
              </button>
            </form>
            {suggestions.length > 0 && (
              <ul className="absolute top-full left-0 right-0 mt-1.5 z-[60] w-full bg-white border border-gray-200 rounded-lg shadow-xl max-h-[calc(100vh-200px)] overflow-y-auto py-1.5">
                {suggestions.map((vehicle) => (
                  <li key={vehicle.id}>
                    <button
                      type="button"
                      onClick={() => handleSuggestionClick(vehicle)}
                      className="w-full text-left px-3.5 py-3 hover:bg-purple-50 hover:text-[#6A3C96] flex items-center gap-3 transition-colors duration-150 rounded-md mx-1 my-0.5 group"
                    >
                      <Image
                        src={vehicle.cover_image || "/placeholder.svg"}
                        alt={vehicle.name}
                        width={72}
                        height={48}
                        className="object-cover rounded-md flex-shrink-0 bg-gray-100 aspect-[3/2]"
                      />
                      <div className="flex-grow overflow-hidden">
                        <p className="font-medium text-sm text-gray-800 group-hover:text-[#6A3C96] truncate transition-colors">
                          {vehicle.name}
                        </p>
                        {vehicle.price !== undefined && vehicle.price > 0 && (
                          <p className="text-xs text-gray-500 mt-0.5">
                            {vehicle.price.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY', minimumFractionDigits: 0, maximumFractionDigits: 0 })} / Gün
                          </p>
                        )}
                      </div>
                    </button>
                  </li>
                ))}
                {searchTerm.trim().length > 0 && (
                    <li className="border-t border-gray-100 mt-1 pt-1">
                    <a
                      href="#vehicle-list"
                      onClick={(e) => { e.preventDefault(); handleSearchFormSubmit(e as any); }}
                      className="block text-center py-2.5 text-sm font-medium text-[#6A3C96] hover:bg-purple-50 transition-colors duration-150 rounded-b-md"
                    >
                      Tüm sonuçları gör "{searchTerm}"
                    </a>
                  </li>
                )}
              </ul>
            )}
          </div>

          {/* === GARAJ VE GİRİŞ/PROFİL BUTONLARI (MASAÜSTÜ) === */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="md:hidden"> {/* Hamburger Butonu */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#6A3C96]"
                aria-label={isMobileMenuOpen ? "Menüyü Kapat" : "Menüyü Aç"}
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? ( <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg> )
                                : ( <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg> )}
              </button>
            </div>
            {/* Masaüstü için görünür (Garaj ve Giriş/Profil Linkleri) */}
            <div className="hidden md:flex items-center space-x-3">
              <Link href="/garaj" className="border border-[#6A3C96] text-[#6A3C96] px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-50 hover:text-[#5a3080] transition-colors duration-150">
                Garaj
              </Link>
              <Link
                href={userName ? "/profil" : "/giris"}
                className={`${
                  userName ? "bg-green-100 text-green-600 hover:bg-green-200" : "bg-[#6A3C96] text-white hover:bg-[#5a3080]"
                } px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150 flex items-center`}
              >
                {userName || "Giriş Yap / Üye Ol"}
              </Link>
            </div>
          </div>
          {/* === GARAJ VE GİRİŞ/PROFİL BUTONLARI (MASAÜSTÜ) SONU === */}
        </div>
      </div>

      {/* === YENİ EKLENEN MOBİL GARAJ VE GİRİŞ/PROFİL BUTONLARI === */}
      {/* Mobil için görünür */}
      <div className="flex md:hidden items-center justify-end mt-3 space-x-2 px-4 pb-3 border-b border-gray-200"> {/* Mobil butonlar için alt boşluk ve border eklendi */}
        <Link href="/garaj" className="border border-[#6A3C96] text-[#6A3C96] px-3 py-1.5 rounded-md text-sm font-medium hover:bg-purple-50 transition">
          Garaj
        </Link>
        <Link
          href={userName ? "/profil" : "/giris"}
          className={`${
            userName ? "bg-green-100 text-green-600 hover:bg-green-200" : "bg-[#6A3C96] text-white hover:bg-[#5a3080]"
          } px-3 py-1.5 rounded-md text-sm font-medium transition`}
        >
          {userName || "Giriş Yap"}
        </Link>
      </div>
      {/* === YENİ EKLENEN MOBİL BUTONLARIN SONU === */}


      {/* Mobil Menü: Hamburger tıklanınca açılır */}
      {isMobile && isMobileMenuOpen && (
        <div className="fixed top-[120px] left-0 w-full z-40 bg-white shadow-lg border-t border-gray-200"> {/* top-[120px] mobil butonların yüksekliğine göre ayarlanabilir */}
          <NavigationMenu
            isMobileFromParent={true}
            setIsMobileMenuOpenFromParent={setIsMobileMenuOpen}
          />
        </div>
      )}

      {/* Masaüstü Menü */}
      {!isMobile && (
        <NavigationMenu
          isMobileFromParent={false}
          setIsMobileMenuOpenFromParent={() => {}}
        />
      )}

      {/* MOBİL ARAMA KUTUSU */}
      {isMobile && (
        <div className="bg-gray-50 p-3 border-t border-gray-200">
           <form onSubmit={handleSearchFormSubmit} className="relative flex items-center group border border-gray-300 rounded-lg overflow-hidden shadow-sm hover:shadow-md focus-within:ring-2 focus-within:ring-[#6A3C96] focus-within:border-transparent transition-all duration-200">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#6A3C96] transition-colors pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
            <input
              type="text"
              placeholder="Araç Ara..."
              className="w-full py-2.5 pl-12 pr-3 border-0 focus:outline-none focus:ring-0 text-sm bg-transparent placeholder-gray-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
              <button
                type="submit"
                className="px-3 h-full bg-[#6A3C96] text-white hover:bg-[#5a3080] focus:outline-none transition-colors text-sm font-medium border-0"
                aria-label="Ara"
                style={{ paddingBlock: '0.625rem' }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </button>
          </form>
            {isMobile && suggestions.length > 0 && (
              <ul className="mt-1.5 z-[60] w-full bg-white border border-gray-200 rounded-lg shadow-xl max-h-[calc(100vh-250px)] overflow-y-auto py-1.5">
                  {suggestions.map((vehicle) => (
                    <li key={vehicle.id}>
                      <button
                        type="button"
                        onClick={() => handleSuggestionClick(vehicle)}
                        className="w-full text-left px-3.5 py-3 hover:bg-purple-50 hover:text-[#6A3C96] flex items-center gap-3 transition-colors duration-150 rounded-md mx-1 my-0.5 group"
                      >
                        <Image
                          src={vehicle.cover_image || "/placeholder.svg"}
                          alt={vehicle.name}
                          width={60}
                          height={40}
                          className="object-cover rounded-md flex-shrink-0 bg-gray-100 aspect-[3/2]"
                        />
                        <div className="flex-grow overflow-hidden">
                          <p className="font-medium text-sm text-gray-800 group-hover:text-[#6A3C96] truncate transition-colors">
                            {vehicle.name}
                          </p>
                          {vehicle.price !== undefined && vehicle.price > 0 && (
                            <p className="text-xs text-gray-500 mt-0.5">
                              {vehicle.price.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY', minimumFractionDigits: 0, maximumFractionDigits: 0 })} / Gün
                            </p>
                          )}
                        </div>
                      </button>
                    </li>
                  ))}
                  {searchTerm.trim().length > 0 && (
                    <li className="border-t border-gray-100 mt-1 pt-1">
                    <a
                      href="#vehicle-list"
                      onClick={(e) => { e.preventDefault(); handleSearchFormSubmit(e as any); }}
                      className="block text-center py-2.5 text-sm font-medium text-[#6A3C96] hover:bg-purple-50 transition-colors duration-150 rounded-b-md"
                    >
                      Tüm sonuçları gör "{searchTerm}"
                    </a>
                  </li>
                  )}
              </ul>
            )}
        </div>
      )}
    </header>
  );
}
