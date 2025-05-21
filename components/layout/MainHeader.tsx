"use client";

export const dynamic = "force-dynamic";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react"; // useCallback kaldırıldı, bu versiyonda kullanılmıyordu.
import { supabase } from "@/lib/supabase-browser";
import NavigationMenu from "@/components/layout/NavigationMenu";
import { useSearch } from "@/context/SearchContext";
import { getMenuPages } from "@/lib/getMenuPages";

// Tipler (Daha önceki versiyondaki gibi)
interface SubMenuItem {
  title: string;
  slug: string;
  isExternal: boolean;
}

interface MenuItem {
  title: string;
  slug: string;
  isExternal: boolean;
  group_sort_order: number;
  subItems: SubMenuItem[];
}

interface RawPageData {
  id: string;
  title: string;
  slug: string;
  external_url?: string | null;
  parent?: string | null;
  menu_group?: string | null;
  group_sort_order?: number | null;
  sort_order?: number | null;
}

interface VehicleSuggestion {
  id: string;
  name: string;
  slug?: string;
  cover_image?: string;
  price?: number;
}

interface RawVehicle {
  id: string;
  isim: string;
  slug?: string;
  cover_image?: string;
  fiyat?: number;
  variations?: { status: string; fiyat: number }[];
}

// Custom Hook: Kullanıcı Detayları için
function useUserDetails() {
  const [userName, setUserName] = useState<string | null>(null);
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
      } else if (error && error.code !== 'PGRST116') {
        console.error("Error fetching user name:", error.message);
      }
    };
    fetchUser();
  }, []);
  return userName;
}

// Custom Hook: Menü Öğeleri için
function useMenuItems() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  useEffect(() => {
    const fetchAndProcessMenuItems = async () => {
      const data: RawPageData[] = await getMenuPages();
      const groups: { [key: string]: RawPageData[] } = {};
      for (const page of data) {
        const isParent = !page.parent;
        const groupKey = page.menu_group?.trim();
        if (isParent && groupKey) {
          if (!groups[groupKey]) groups[groupKey] = [];
          groups[groupKey].push(page);
        } else if (isParent) {
          groups[page.id] = [page];
        }
      }
      const processedMenuItems = Object.values(groups)
        .flatMap((pagesInGroupOrParentItemArray) =>
          pagesInGroupOrParentItemArray.map((parentPage) => ({
            title: parentPage.title,
            slug: parentPage.external_url || parentPage.slug,
            isExternal: !!parentPage.external_url,
            group_sort_order: parentPage.group_sort_order ?? parentPage.sort_order ?? 0,
            subItems: data
              .filter((childPage) => childPage.parent === parentPage.id)
              .map((subPage) => ({
                title: subPage.title,
                slug: subPage.external_url || subPage.slug,
                isExternal: !!subPage.external_url,
              })),
          }))
        )
        .sort((a, b) => a.group_sort_order - b.group_sort_order);
      setMenuItems(processedMenuItems);
    };
    fetchAndProcessMenuItems();
  }, []);
  return menuItems;
}

export default function MainHeader() {
  const { searchTerm, setSearchTerm } = useSearch();
  const menuItems = useMenuItems();
  const userName = useUserDetails();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  
  const [suggestions, setSuggestions] = useState<VehicleSuggestion[]>([]);
  const [allVehiclesForSuggestions, setAllVehiclesForSuggestions] = useState<VehicleSuggestion[]>([]);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      const mobileCheck = window.innerWidth < 768;
      setIsMobile(mobileCheck);
      if (!mobileCheck) {
        setIsMobileMenuOpen(false);
        setActiveDropdown(null);
      }
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
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
        const rawVehicles: RawVehicle[] = json.data || [];
        const transformedForSuggestions: VehicleSuggestion[] = rawVehicles.map((vehicle) => {
          const aktifVaryasyonlar = vehicle.variations?.filter((v) => v.status === "Aktif") || [];
          const enDusukFiyat =
            aktifVaryasyonlar.length > 0
              ? Math.min(...aktifVaryasyonlar.map((v) => v.fiyat))
              : vehicle.fiyat ?? 0;
          let coverImage = "/placeholder.svg";
          if (vehicle.cover_image) {
            if (vehicle.cover_image.startsWith("http")) {
              coverImage = vehicle.cover_image;
            } else {
              coverImage = `https://uxnpmdeizkzvnevpceiw.supabase.co/storage/v1/object/public/images/${vehicle.cover_image.replace(/^\/+/, "")}`;
            }
          }
          return {
            id: vehicle.id,
            name: vehicle.isim || "Araç İsmi Yok",
            slug: vehicle.slug || vehicle.id,
            cover_image: coverImage,
            price: enDusukFiyat > 0 ? enDusukFiyat : undefined,
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
    if (searchTerm.trim().length > 1 && allVehiclesForSuggestions.length > 0) {
      const filtered = allVehiclesForSuggestions
        .filter(vehicle => vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .slice(0, 5);
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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedSearchTerm = searchTerm.trim();
    setSearchTerm(trimmedSearchTerm); // Arama yapıldığında input'taki değeri de trim'lenmiş haliyle güncelle
    setSuggestions([]);
    if (trimmedSearchTerm) {
      const vehicleListElement = document.getElementById('vehicle-list');
      vehicleListElement?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSuggestionClick = (suggestion: VehicleSuggestion) => {
    setSearchTerm(suggestion.name);
    setSuggestions([]);
    const vehicleListElement = document.getElementById('vehicle-list');
    vehicleListElement?.scrollIntoView({ behavior: "smooth" });
  };

  const toggleDropdown = (menuGroupTitle: string) => {
    setActiveDropdown(activeDropdown === menuGroupTitle ? null : menuGroupTitle);
  };

  return (
    // Kurumsal renk için bg-primary kullanıldı. tailwind.config.js'de tanımlamanız gerekir.
    <header className="shadow-sm"> {/* Header'a genel hafif bir gölge */}
      {/* Üst Bilgi Çubuğu */}
      <div className="bg-primary text-white py-3 px-4 md:py-4 md:px-6"> {/* Renginizi bg-primary olarak kullanın, padding ayarlandı */}
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link href="/iletisim" className="flex items-center hover:text-gray-200 transition-colors" aria-label="Adres">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </Link>
            <Link href="/iletisim" className="flex items-center hover:text-gray-200 transition-colors" aria-label="E-posta">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </Link>
            <Link href="/iletisim" className="flex items-center hover:text-gray-200 transition-colors" aria-label="Telefon">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </Link>
          </div>
          <div className="text-center hidden md:block">
            <p className="text-base font-medium">Yüzlerce Araç Tek Ekranda Seç Beğen Güvenle Kirala</p> {/* Font boyutu ayarlandı */}
          </div>
          <div className="hidden md:flex items-center space-x-3">
            <Link href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-200 transition-colors" aria-label="Facebook">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
              </svg>
            </Link>
            {/* Diğer sosyal medya ikonları benzer şekilde güncellenebilir */}
             <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-200 transition-colors" aria-label="Instagram">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-white py-4 px-4 md:px-6 shadow-sm"> {/* Hafif gölge eklendi */}
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/LENACARS.svg" // Logonuzun yolu
              alt="LenaCars Logo"
              width={250} // Logo genişliği artırıldı
              height={70} // Logo yüksekliği artırıldı
              className="w-auto" // max-h-XX kaldırıldı, width/height ile oran korunacak
              priority
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                if (target.src.includes(".svg")) {
                  target.src = "/LENACARS.png"; // PNG fallback'iniz
                }
              }}
            />
          </Link>

          <div ref={searchContainerRef} className="hidden md:block flex-grow mx-6 max-w-lg relative"> {/* mx ve max-w ayarlandı */}
            <form onSubmit={handleSearchFormSubmit} className="relative">
              <input
                type="text"
                placeholder="Araç Ara (örn: Honda Civic)"
                // Yumuşak tasarım için padding, border, rounded, shadow ve focus stilleri güncellendi
                className="w-full py-3 px-5 text-sm border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-shadow"
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
                aria-haspopup="listbox"
                aria-controls="search-suggestions-desktop"
              />
              <button
                type="submit"
                // Arama butonu stili güncellendi (turuncu renk, yumuşak köşeler)
                className="absolute right-0 top-0 h-full px-5 bg-orange-500 text-white rounded-r-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-colors shadow-sm"
                aria-label="Ara"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>
            {suggestions.length > 0 && (
              <ul 
                id="search-suggestions-desktop"
                role="listbox"
                // Öneri listesi stili güncellendi (yumuşak köşe ve gölge)
                className="absolute top-full mt-1 left-0 right-0 z-20 w-full bg-white border border-gray-200 rounded-lg shadow-md max-h-80 overflow-y-auto"
              >
                {suggestions.map((vehicle) => (
                  <li key={vehicle.id} role="option">
                    <button
                      type="button"
                      onClick={() => handleSuggestionClick(vehicle)}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3 transition-colors duration-150" // Padding ayarlandı
                    >
                      <Image
                        src={vehicle.cover_image || "/placeholder.svg"}
                        alt={vehicle.name}
                        width={50}
                        height={32}
                        className="object-cover rounded-md flex-shrink-0" // Resim köşeleri yumuşatıldı
                        unoptimized={vehicle.cover_image?.startsWith("http")}
                      />
                      <div className="flex-grow overflow-hidden">
                        <p className="font-medium text-sm text-gray-700 truncate">{vehicle.name}</p>
                        {vehicle.price && (
                          <p className="text-xs text-gray-500">
                            {vehicle.price.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY', minimumFractionDigits: 0, maximumFractionDigits: 0 })} / Gün
                          </p>
                        )}
                      </div>
                    </button>
                  </li>
                ))}
                <li className="border-t border-gray-100"> {/* Border rengi yumuşatıldı */}
                  <a
                    href="#vehicle-list"
                    onClick={(e) => {
                      e.preventDefault();
                      const el = document.getElementById('vehicle-list');
                      el?.scrollIntoView({ behavior: "smooth" });
                      setSuggestions([]);
                    }}
                    // "Tüm sonuçları gör" linki stili güncellendi (primary renk)
                    className="block text-center py-3 text-sm font-medium text-primary hover:underline hover:bg-gray-50 transition-colors duration-150"
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
              // Mobil menü butonu stili güncellendi (yumuşak köşe)
              className="p-2.5 rounded-lg text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300"
              aria-label={isMobileMenuOpen ? "Menüyü Kapat" : "Menüyü Aç"}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-navigation-menu"
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
            <Link 
              href="/garaj" 
              // "Garaj" butonu stili güncellendi (yumuşak köşe, primary renk, hafif gölge)
              className="border border-primary text-primary px-5 py-2.5 rounded-lg shadow-sm hover:bg-primary hover:text-white transition-colors duration-150 font-medium text-sm"
            >
              Garaj
            </Link>
            <Link
              href={userName ? "/profil" : "/giris"}
              // "Giriş/Profil" butonu stili güncellendi
              className={`${
                userName 
                  ? "bg-green-100 text-green-700 hover:bg-green-200" 
                  : "bg-primary text-white hover:bg-opacity-90" // bg-primary/90 da kullanılabilir
              } px-5 py-2.5 rounded-lg shadow-sm transition-colors duration-150 font-medium text-sm`}
            >
              {userName || "Giriş Yap / Üye Ol"}
            </Link>
          </div>
        </div>
      </div>

      <NavigationMenu
        menuItems={menuItems}
        isMobile={isMobile}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        activeDropdown={activeDropdown}
        toggleDropdown={toggleDropdown}
        // Bu bileşenin içine de benzer yumuşatma (rounded-lg, shadow-sm/md) ve padding ayarları yapmanız gerekebilir.
      />

      {isMobile && (
        <form onSubmit={handleSearchFormSubmit} className="bg-white py-3 px-4 border-t border-gray-100"> {/* Padding ve border rengi ayarlandı */}
          <div className="relative">
            <input
              type="text"
              placeholder="Araç Ara"
              // Mobil arama input stili güncellendi
              className="w-full py-2.5 px-4 text-sm border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-shadow"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              type="submit"
              // Mobil arama butonu stili güncellendi
              className="absolute right-0 top-0 h-full px-4 bg-orange-500 text-white rounded-r-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-colors shadow-sm"
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
