"use client";

export const dynamic = "force-dynamic";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase-browser";
import NavigationMenu from "@/components/layout/NavigationMenu";
import { useSearch } from "@/context/SearchContext";
import { getMenuPages } from "@/lib/getMenuPages"; // Bu fonksiyonun içeriği önemli

// toTitleCase Fonksiyonu (console.log eklenmiş)
function toTitleCase(str: string | null | undefined) {
  console.log("toTitleCase GİRDİ:", str, "| Tip:", typeof str); // Gelen değeri logla
  if (!str) {
    console.log("toTitleCase ÇIKTI (null/undefined giriş için):", "");
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
  console.log("toTitleCase ÇIKTI ('" + str + "' için):", result); // Çıkan değeri logla
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

  useEffect(() => {
    const fetchMenuItems = async () => {
      console.log("fetchMenuItems çağrıldı.");
      try {
        const data = await getMenuPages(); // Tüm sayfaları içeren ana veri
        console.log("getMenuPages'den gelen veri:", data); // getMenuPages'den gelen veriyi logla

        if (!data || data.length === 0) {
          console.warn("getMenuPages'den boş veya tanımsız veri geldi.");
          setMenuItems([]);
          return;
        }

        const groups: { [key: string]: any[] } = {};

        for (const page of data) {
          if (!page) {
            console.warn("Veri içinde tanımsız bir sayfa bulundu, atlanıyor.");
            continue;
          }
          const isParent = !page.parent;
          console.log(`Sayfa işleniyor: ${page.title}, Ana Sayfa Mı: ${isParent}, Grup: ${page.menu_group}`);
          const groupKey = toTitleCase(page.menu_group);
          console.log(`Sayfa: ${page.title}, Oluşturulan GroupKey: ${groupKey}`);


          if (isParent && groupKey) {
            if (!groups[groupKey]) groups[groupKey] = [];
            groups[groupKey].push(page);
          } else if (isParent) {
            // Grupsuz ana sayfalar için kendi ID'lerini kullanıyoruz, bu ID'yi title case yapmaya gerek yok.
            // Ancak, eğer bu ID bir şekilde başlık olarak gösteriliyorsa ve onu da formatlamak isterseniz
            // toTitleCase(page.id) gibi bir şey düşünebilirsiniz ama genellikle ID'ler formatlanmaz.
            groups[page.id] = [page];
          }
        }
        console.log("Oluşturulan gruplar:", groups);

        const sortedMenuItems = Object.entries(groups)
          .map(([groupOrParentId, pagesInGroupOrParentItemArray]) => {
            console.log(`Grup/ParentId işleniyor: ${groupOrParentId}`);
            return pagesInGroupOrParentItemArray.map((parent) => {
              if (!parent || typeof parent.title === 'undefined') {
                console.warn("Tanımsız parent veya parent.title tanımsız:", parent);
                return { title: "Hatalı Veri", slug: "#", isExternal: false, group_sort_order:0, subItems: [] }; // Hatalı veri için fallback
              }
              console.log("İŞLENECEK PARENT.TITLE:", parent.title, "| Tip:", typeof parent.title);
              const processedTitle = toTitleCase(parent.title);
              console.log("İŞLENMİŞ PARENT.TITLE ('" + parent.title + "' için):", processedTitle);
              return {
                title: processedTitle,
                slug: parent.external_url || parent.slug,
                isExternal: !!parent.external_url,
                group_sort_order: parent.group_sort_order ?? parent.sort_order ?? 0,
                subItems: data // 'data'nın burada tekrar kullanılması tüm sayfaları içerir, dikkatli olunmalı.
                  .filter((child) => child && child.parent === parent.id) // child'ın da null/undefined olmamasını kontrol et
                  .map((sub) => {
                    if (!sub || typeof sub.title === 'undefined') {
                      console.warn("Tanımsız sub veya sub.title tanımsız:", sub);
                      return { title: "Hatalı Alt Veri", slug: "#", isExternal: false }; // Hatalı veri için fallback
                    }
                    console.log("İŞLENECEK SUB.TITLE:", sub.title, "| Tip:", typeof sub.title);
                    const processedSubTitle = toTitleCase(sub.title);
                    console.log("İŞLENMİŞ SUB.TITLE ('" + sub.title + "' için):", processedSubTitle);
                    return {
                      title: processedSubTitle,
                      slug: sub.external_url || sub.slug,
                      isExternal: !!sub.external_url,
                    };
                  }),
              };
            });
          })
          .flat()
          .sort((a, b) => (a.group_sort_order ?? 0) - (b.group_sort_order ?? 0));

        console.log("Sıralanmış Menü Öğeleri:", sortedMenuItems);
        setMenuItems(sortedMenuItems);
      } catch (error) {
        console.error("fetchMenuItems sırasında hata oluştu:", error);
        setMenuItems([]); // Hata durumunda menüyü boşalt
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
      if (sessionError) {
        console.error("Error getting session:", sessionError.message);
        return;
      }
      const userId = sessionData.session?.user?.id;
      if (!userId) return;

      const { data, error } = await supabase
        .from("kullanicilar")
        .select("ad, soyad")
        .eq("id", userId)
        .single();

      if (!error && data) {
        setUserName(`${data.ad} ${data.soyad}`);
      } else if (error && error.code !== 'PGRST116') { // PGRST116: " esattamente una riga attesa, ma 0 ne sono state trovate " (Exactly one row expected, but 0 were found)
        console.error("Error fetching user name:", error.message);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchAllVehiclesForSuggestions = async () => {
      try {
        const res = await fetch("https://adminpanel-green-two.vercel.app/api/araclar", {
          cache: "no-store",
        });
        if (!res.ok) {
          console.error("Failed to fetch vehicles for suggestions. Status:", res.status);
          setAllVehiclesForSuggestions([]);
          return;
        }
        const json = await res.json();
        const rawVehicles = json.data || [];
        const transformedForSuggestions: VehicleSuggestion[] = rawVehicles.map((vehicle: any) => {
          const aktifVaryasyonlar = vehicle.variations?.filter((v: any) => v.status === "Aktif") || [];
          const enDusukFiyat =
            aktifVaryasyonlar.length > 0
              ? Math.min(...aktifVaryasyonlar.map((v: any) => v.fiyat))
              : vehicle.fiyat ?? 0;
          return {
            id: vehicle.id,
            name: vehicle.isim || "Araç İsmi Yok",
            slug: vehicle.slug || vehicle.id,
            cover_image: vehicle.cover_image?.startsWith("http")
              ? vehicle.cover_image
              : vehicle.cover_image
              ? `https://uxnpmdeizkzvnevpceiw.supabase.co/storage/v1/object/public/images/${vehicle.cover_image.replace(/^\/+/, "")}`
              : "/placeholder.svg",
            price: enDusukFiyat,
          };
        });
        setAllVehiclesForSuggestions(transformedForSuggestions);
      } catch (error) {
        console.error("Error fetching all vehicles for suggestions:", error);
        setAllVehiclesForSuggestions([]);
      }
    };
    fetchAllVehiclesForSuggestions();
  }, []);

  useEffect(() => {
    if (searchTerm.trim().length > 1) {
      const filtered = allVehiclesForSuggestions.filter(vehicle =>
        vehicle.name.toLowerCase().includes(searchTerm.toLowerCase())
      ).slice(0, 5);
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
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchContainerRef]);

  const handleSearchFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
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

  const mainMenuItems = [...menuItems].sort((a, b) => (a.group_sort_order ?? 0) - (b.group_sort_order ?? 0));

  return (
    <header>
      {/* Üst Bilgi Çubuğu */}
      <div className="bg-[#6A3C96] text-white py-3 px-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link href="/iletisim" className="flex items-center hover:text-gray-200" aria-label="Adres">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </Link>
            <Link href="/iletisim" className="flex items-center hover:text-gray-200" aria-label="E-posta">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </Link>
            <Link href="/iletisim" className="flex items-center hover:text-gray-200" aria-label="Telefon">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </Link>
          </div>
          <div className="text-center hidden md:block">
            <h2 className="text-lg font-medium">Yüzlerce Araç Tek Ekranda Seç Beğen Güvenle Kirala</h2>
          </div>
          <div className="hidden md:flex items-center space-x-3">
            <Link href="https://facebook.com" target="_blank" className="hover:text-gray-200" aria-label="Facebook">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
              </svg>
            </Link>
            <Link href="https://instagram.com" target="_blank" className="hover:text-gray-200" aria-label="Instagram">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </Link>
            <Link href="https://linkedin.com" target="_blank" className="hover:text-gray-200" aria-label="LinkedIn">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
              </svg>
            </Link>
            <Link href="https://youtube.com" target="_blank" className="hover:text-gray-200" aria-label="YouTube">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

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
                if (target.src.endsWith(".svg")) {
                  target.src = "/LENACARS.png";
                }
              }}
            />
          </Link>

          <div ref={searchContainerRef} className="hidden md:block flex-grow mx-4 max-w-md relative">
            <form onSubmit={handleSearchFormSubmit} className="relative">
              <input
                type="text"
                placeholder="Araç Ara (örn: Honda Civic)"
                className="w-full py-2 px-4 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-[#6A3C96] focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => {
                  if (searchTerm.trim().length > 1 && allVehiclesForSuggestions.length > 0) {
                    const filtered = allVehiclesForSuggestions.filter(vehicle =>
                      vehicle.name.toLowerCase().includes(searchTerm.toLowerCase())
                    ).slice(0, 5);
                    setSuggestions(filtered);
                  }
                }}
              />
              <button
                type="submit"
                className="absolute right-0 top-0 h-full px-4 bg-[#E67E22] text-white rounded-r-md hover:bg-[#D35400] transition-colors"
                aria-label="Ara"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>
            {suggestions.length > 0 && (
              <ul className="absolute top-full left-0 right-0 z-20 w-full bg-white border border-gray-300 border-t-0 rounded-b-md shadow-lg max-h-80 overflow-y-auto">
                {suggestions.map((vehicle) => (
                  <li key={vehicle.id}>
                    <button
                      type="button"
                      onClick={() => handleSuggestionClick(vehicle)}
                      className="w-full text-left px-3 py-2.5 hover:bg-gray-100 flex items-center gap-3 transition-colors duration-150"
                    >
                      <Image
                        src={vehicle.cover_image || "/placeholder.svg"}
                        alt={vehicle.name}
                        width={50}
                        height={32}
                        className="object-cover rounded flex-shrink-0"
                        unoptimized={vehicle.cover_image?.startsWith("http")}
                      />
                      <div className="flex-grow overflow-hidden">
                        <p className="font-medium text-sm text-gray-700 truncate">{vehicle.name}</p>
                        {vehicle.price !== undefined && vehicle.price > 0 && (
                          <p className="text-xs text-gray-500">
                            {vehicle.price.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY', minimumFractionDigits: 0, maximumFractionDigits: 0 })} / Gün
                          </p>
                        )}
                      </div>
                    </button>
                  </li>
                ))}
                <li className="border-t">
                  <a
                    href="#vehicle-list"
                    onClick={(e) => {
                      e.preventDefault();
                      const el = document.getElementById('vehicle-list');
                      if (el) {
                        el.scrollIntoView({ behavior: "smooth" });
                      }
                      setSearchTerm(searchTerm.trim());
                      setSuggestions([]);
                    }}
                    className="block text-center py-3 text-sm font-medium text-[#6A3C96] hover:underline hover:bg-gray-50 transition-colors duration-150"
                  >
                    Tüm sonuçları gör "{searchTerm}"
                  </a>
                </li>
              </ul>
            )}
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none"
              aria-label={isMobileMenuOpen ? "Menüyü Kapat" : "Menüyü Aç"}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

          <div className="hidden md:flex items-center space-x-3">
            <Link href="/garaj" className="border border-[#6A3C96] text-[#6A3C96] px-4 py-2 rounded-md flex items-center hover:bg-gray-50 transition-colors">
              Garaj
            </Link>
            <Link
              href={userName ? "/profil" : "/giris"}
              className={`${
                userName ? "bg-green-100 text-green-700" : "bg-[#6A3C96] text-white hover:bg-[#5a3080]"
              } px-4 py-2 rounded-md transition-colors flex items-center`}
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

      {isMobile && (
        <form onSubmit={handleSearchFormSubmit} className="bg-white py-2 px-4 border-t border-gray-200">
          <div className="relative">
            <input
              type="text"
              placeholder="Araç Ara"
              className="w-full py-2 px-4 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-[#6A3C96] focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              type="submit"
              className="absolute right-0 top-0 h-full px-4 bg-[#E67E22] text-white rounded-r-md hover:bg-[#D35400] transition-colors"
              aria-label="Ara"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </form>
      )}
    </header>
  );
}
