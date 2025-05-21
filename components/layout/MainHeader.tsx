"use client";

export const dynamic = "force-dynamic"; // Kullanıcıya özel içerik için gerekli olabilir, ancak performansı etkileyebilir. Dikkatli değerlendirin.

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "@/lib/supabase-browser"; // Supabase client'ınızın doğru yolu olduğundan emin olun
import NavigationMenu from "@/components/layout/NavigationMenu"; // Bu bileşenin yolu doğru mu?
import { useSearch } from "@/context/SearchContext"; // Search context yolu doğru mu?
import { getMenuPages } from "@/lib/getMenuPages"; // Bu fonksiyonun yolu doğru mu?

// Tipler
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
  // Orijinal veriden gelen diğer alanlar buraya eklenebilir (id, parent, menu_group vb.)
  // Eğer menü işleme mantığında kullanılıyorsa.
}

// getMenuPages'den dönen ham sayfa verisi için tip (ihtiyaçlarınıza göre detaylandırın)
interface RawPageData {
  id: string;
  title: string;
  slug: string;
  external_url?: string | null;
  parent?: string | null;
  menu_group?: string | null;
  group_sort_order?: number | null;
  sort_order?: number | null; // Bu da kullanılıyor gibi duruyor fetchMenuItems içinde
}


interface VehicleSuggestion {
  id: string;
  name: string;
  slug?: string;
  cover_image?: string;
  price?: number;
}

// /api/araclar'dan gelen ham araç verisi için tip (ihtiyaçlarınıza göre detaylandırın)
interface RawVehicle {
  id: string;
  isim: string; // 'name' yerine 'isim' kullanılmış API'de
  slug?: string;
  cover_image?: string;
  fiyat?: number; // Ana fiyat, varyasyon yoksa
  variations?: { status: string; fiyat: number }[];
}

// Örnek bir Icon bileşeni konsepti (ayrı bir dosyada oluşturulabilir)
// const Icon = ({ type, className }) => { /* SVG pathlerine göre render eder */ return <svg>...</svg>; };


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
      } else if (error && error.code !== 'PGRST116') { // PGRST116: Kayıt bulunamadı hatası, bu bir hata değil.
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
          groups[page.id] = [page]; // Grupsuz ana sayfalar kendi ID'leriyle grup oluşturur
        }
      }

      const processedMenuItems = Object.values(groups) // Object.entries'e gerek yok, sadece değerler lazım
        .flatMap((pagesInGroupOrParentItemArray) => // flatMap ile iç içe map ve flat birleştirildi
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
  const menuItems = useMenuItems(); // Custom hook kullanımı
  const userName = useUserDetails(); // Custom hook kullanımı

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  
  const [suggestions, setSuggestions] = useState<VehicleSuggestion[]>([]);
  const [allVehiclesForSuggestions, setAllVehiclesForSuggestions] = useState<VehicleSuggestion[]>([]);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Mobil durumunu kontrol et
  useEffect(() => {
    const checkMobile = () => {
      const mobileCheck = window.innerWidth < 768; // md breakpoint
      setIsMobile(mobileCheck);
      if (!mobileCheck) { // Eğer desktop'a geçildiyse mobil menüyü ve dropdown'ı kapat
        setIsMobileMenuOpen(false);
        setActiveDropdown(null);
      }
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Araç önerileri için tüm araçları çek (Optimizasyon için SWR/React Query düşünülebilir)
  useEffect(() => {
    const fetchAllVehiclesForSuggestions = async () => {
      try {
        // TODO: Bu API endpoint'ini ve cache stratejisini gözden geçirin.
        // Sık değişmeyen veri ise SWR ile cache'lemek daha iyi olabilir.
        const res = await fetch("https://adminpanel-green-two.vercel.app/api/araclar", {
          cache: "no-store", // Verinin güncelliği kritikse bu kalabilir.
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
          
          let coverImage = "/placeholder.svg"; // Varsayılan placeholder
          if (vehicle.cover_image) {
            if (vehicle.cover_image.startsWith("http")) {
              coverImage = vehicle.cover_image;
            } else {
              // Supabase storage URL'nizi ve bucket adınızı kontrol edin
              coverImage = `https://uxnpmdeizkzvnevpceiw.supabase.co/storage/v1/object/public/images/${vehicle.cover_image.replace(/^\/+/, "")}`;
            }
          }

          return {
            id: vehicle.id,
            name: vehicle.isim || "Araç İsmi Yok",
            slug: vehicle.slug || vehicle.id, // Slug yoksa ID kullan
            cover_image: coverImage,
            price: enDusukFiyat > 0 ? enDusukFiyat : undefined, // Fiyat 0 ise undefined yapalım ki koşullu render'da sorun olmasın
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

  // Arama terimine göre önerileri filtrele
  useEffect(() => {
    if (searchTerm.trim().length > 1 && allVehiclesForSuggestions.length > 0) {
      const filtered = allVehiclesForSuggestions
        .filter(vehicle => vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .slice(0, 5); // En fazla 5 öneri göster
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [searchTerm, allVehiclesForSuggestions]);

  // Arama alanı dışına tıklanınca önerileri kapat
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setSuggestions([]);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []); // searchContainerRef bağımlılıktan çıkarıldı, çünkü ref.current değişmez.

  const handleSearchFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedSearchTerm = searchTerm.trim();
    // setSearchTerm(trimmedSearchTerm); // Zaten onChange ile set ediliyor, burada tekrar etmeye gerek olmayabilir.
                                      // Ancak kullanıcı boşluk bırakıp arama yaparsa diye trimlenmiş halini set etmek iyi olabilir.
    setSuggestions([]); // Arama yapıldığında önerileri kapat
    if (trimmedSearchTerm) {
      const vehicleListElement = document.getElementById('vehicle-list');
      vehicleListElement?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSuggestionClick = (suggestion: VehicleSuggestion) => {
    setSearchTerm(suggestion.name); // Arama input'unu öneri ile doldur
    setSuggestions([]); // Önerileri kapat
    // Kullanıcı bir öneriye tıkladığında da arama sonuçlarına scroll et
    const vehicleListElement = document.getElementById('vehicle-list');
    vehicleListElement?.scrollIntoView({ behavior: "smooth" });
  };

  const toggleDropdown = (menuGroupTitle: string) => {
    setActiveDropdown(activeDropdown === menuGroupTitle ? null : menuGroupTitle);
  };
  
  // Sıralama zaten useMenuItems hook'unda yapıldığı için burada tekrar sıralamaya gerek yok.
  // const mainMenuItems = menuItems; 

  return (
    <header>
      {/* Üst Bilgi Çubuğu (TopBar) - Ayrı bir bileşen olabilir */}
      {/* TODO: Tailwind config'e renkleri ekle: bg-primary-purple (örn: #6A3C96) */}
      <div className="bg-[#6A3C96] text-white py-3 px-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            {/* TODO: Bu ikonları <Icon type="location" /> gibi bir bileşenle değiştirmeyi düşünün */}
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
            {/* Semantik olarak <p> daha uygun olabilir, stil ile h2 gibi gösterilebilir */}
            <p className="text-lg font-medium">Yüzlerce Araç Tek Ekranda Seç Beğen Güvenle Kirala</p>
          </div>
          <div className="hidden md:flex items-center space-x-3">
            {/* Sosyal medya linkleri, target="_blank" yanına rel="noopener noreferrer" eklemek iyi bir pratiktir */}
            <Link href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-200" aria-label="Facebook">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
              </svg>
            </Link>
            {/* Diğer sosyal medya ikonları benzer şekilde (Instagram, LinkedIn, YouTube) */}
          </div>
        </div>
      </div>

      {/* Ana Header Alanı */}
      <div className="bg-white py-4 px-4 shadow-sm">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/LENACARS.svg"
              alt="LenaCars Logo"
              width={200} // Next.js Image için width ve height zorunlu (layout="intrinsic" veya "fixed" için)
              height={60}
              className="w-auto h-auto max-h-16" // Bu class'lar stil için, Image optimizasyonu width/height'e göre yapar
              priority // LCP (Largest Contentful Paint) öğesi ise
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                // Basit bir fallback, .svg yüklenemezse .png dene
                if (target.src.includes(".svg")) { // Sadece .svg ise değiştir
                  target.src = "/LENACARS.png"; // .png dosyanızın public klasöründe olduğundan emin olun
                }
              }}
            />
          </Link>

          {/* Desktop Arama */}
          <div ref={searchContainerRef} className="hidden md:block flex-grow mx-4 max-w-md relative">
            <form onSubmit={handleSearchFormSubmit} className="relative">
              <input
                type="text"
                placeholder="Araç Ara (örn: Honda Civic)"
                className="w-full py-2 px-4 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-[#6A3C96] focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => { // Bu onFocus'un içeriği, useEffect ile çakışmaması için gözden geçirilebilir.
                               // Temel amacı, odaklanıldığında (ve arama terimi varsa) önerileri göstermektir.
                  if (searchTerm.trim().length > 1 && allVehiclesForSuggestions.length > 0) {
                    const filtered = allVehiclesForSuggestions.filter(vehicle =>
                      vehicle.name.toLowerCase().includes(searchTerm.toLowerCase())
                    ).slice(0, 5);
                    setSuggestions(filtered);
                  }
                }}
                aria-haspopup="listbox" // Erişilebilirlik: Bu input bir liste açar
                aria-controls="search-suggestions-desktop" // Açılan listenin ID'si
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
              <ul 
                id="search-suggestions-desktop"
                role="listbox" // Erişilebilirlik: Bu bir seçenek listesidir
                className="absolute top-full left-0 right-0 z-20 w-full bg-white border border-gray-300 border-t-0 rounded-b-md shadow-lg max-h-80 overflow-y-auto"
              >
                {suggestions.map((vehicle) => (
                  <li key={vehicle.id} role="option"> {/* Erişilebilirlik: Bu bir seçenektir */}
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
                        unoptimized={vehicle.cover_image?.startsWith("http")} // Dışarıdan gelen resimler için optimizasyonu kapat
                      />
                      <div className="flex-grow overflow-hidden">
                        <p className="font-medium text-sm text-gray-700 truncate">{vehicle.name}</p>
                        {vehicle.price && ( // Sadece fiyat varsa göster
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
                    href="#vehicle-list" // Bu ID'nin sayfada bir yerde olması lazım
                    onClick={(e) => {
                      e.preventDefault();
                      const el = document.getElementById('vehicle-list');
                      el?.scrollIntoView({ behavior: "smooth" });
                      // setSearchTerm(searchTerm.trim()); // Zaten set edilmiş durumda
                      setSuggestions([]); // Önerileri kapat
                    }}
                    className="block text-center py-3 text-sm font-medium text-[#6A3C96] hover:underline hover:bg-gray-50 transition-colors duration-150"
                  >
                    Tüm sonuçları gör "{searchTerm}"
                  </a>
                </li>
              </ul>
            )}
          </div>

          {/* Mobil Menü Butonu */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none"
              aria-label={isMobileMenuOpen ? "Menüyü Kapat" : "Menüyü Aç"}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-navigation-menu" // Açılacak menünün ID'si
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

          {/* Desktop Sağ Kısım (Garaj, Giriş/Profil) */}
          <div className="hidden md:flex items-center space-x-3">
            <Link href="/garaj" className="border border-[#6A3C96] text-[#6A3C96] px-4 py-2 rounded-md flex items-center hover:bg-gray-50 transition-colors">
              Garaj
            </Link>
            <Link
              href={userName ? "/profil" : "/giris"}
              className={`${
                userName ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-[#6A3C96] text-white hover:bg-[#5a3080]"
              } px-4 py-2 rounded-md transition-colors flex items-center`}
            >
              {userName || "Giriş Yap / Üye Ol"}
            </Link>
          </div>
        </div>
      </div>

      {/* Ana Navigasyon Menüsü */}
      {/* NavigationMenu bileşeninin id="mobile-navigation-menu" gibi bir ID alması iyi olur (aria-controls için) */}
      <NavigationMenu
        menuItems={menuItems} // Sıralı menü öğeleri (mainMenuItems yerine doğrudan menuItems kullanılabilir)
        isMobile={isMobile}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        activeDropdown={activeDropdown}
        toggleDropdown={toggleDropdown}
        // id="mobile-navigation-menu" // Eğer mobil menü bu bileşen içinde render ediliyorsa
      />

      {/* Mobil Arama */}
      {isMobile && (
        <form onSubmit={handleSearchFormSubmit} className="bg-white py-2 px-4 border-t border-gray-200">
          <div className="relative">
            {/* Mobil arama için de öneri listesi ve ARIA etiketleri eklenebilir (desktop'takine benzer) */}
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
          {/* Mobil için arama önerileri buraya da eklenebilir, benzer bir mantıkla */}
        </form>
      )}
    </header>
  );
}
