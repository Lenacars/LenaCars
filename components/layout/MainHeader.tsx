"use client";

export const dynamic = "force-dynamic";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react"; // useRef eklendi
// import { useRouter } from "next/navigation"; // Yönlendirme context üzerinden olduğu için gerek yok
import { supabase } from "@/lib/supabase-browser";
import NavigationMenu from "@/components/layout/NavigationMenu";
import { useSearch } from "@/context/SearchContext";

// Öneri için araç tipi (basitleştirilmiş)
interface VehicleSuggestion {
  id: string;
  name: string; // vehicle.isim'den gelecek
  slug: string; // Detay sayfasına link için
  cover_image?: string;
  price?: number; // vehicle.price'dan (enDusukFiyat) gelecek
}

export default function MainHeader() {
  const { searchTerm, setSearchTerm } = useSearch();
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  // 1. ADIM için State'ler ve Ref
  const [suggestions, setSuggestions] = useState<VehicleSuggestion[]>([]);
  const [allVehiclesForSuggestions, setAllVehiclesForSuggestions] = useState<VehicleSuggestion[]>([]);
  const searchContainerRef = useRef<HTMLDivElement>(null); // Dışarı tıklamayı algılamak için

  // Tüm araçları bir kez çekip öneriler için saklama (opsiyonel, performansa göre değişebilir)
  useEffect(() => {
    const fetchAllVehiclesForSuggestions = async () => {
      try {
        // API endpoint'iniz veya Supabase sorgunuz.
        // Home.tsx'teki fetch'e benzer bir yapı kullanılabilir.
        // Bu örnekte API'den çekiyoruz ve basitleştirilmiş bir transform yapıyoruz.
        const res = await fetch("https://adminpanel-green-two.vercel.app/api/araclar", {
          cache: "no-store",
        });
        if (!res.ok) {
          console.error("Failed to fetch vehicles for suggestions");
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
            slug: vehicle.slug || vehicle.id, // Slug yoksa id kullanılabilir
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
      }
    };
    fetchAllVehiclesForSuggestions();
  }, []);


  // 1. ADIM: Arama terimi değiştikçe önerileri filtrele
  useEffect(() => {
    if (searchTerm.trim().length > 1) { // Genellikle en az 2 karakter girilince arama yapılır
      const filteredSuggestions = allVehiclesForSuggestions.filter(vehicle =>
        vehicle.name.toLowerCase().includes(searchTerm.toLowerCase())
      ).slice(0, 5); // İlk 5 öneriyi göster
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]); // Arama terimi kısaysa veya yoksa önerileri temizle
    }
  }, [searchTerm, allVehiclesForSuggestions]);

  // Dışarı tıklandığında önerileri kapat
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


  useEffect(() => {
    const fetchMenuItems = async () => { /* ... (menü item fetch kodu aynı) ... */ };
    fetchMenuItems();
  }, []);

  useEffect(() => {
    const checkMobile = () => { /* ... (checkMobile kodu aynı) ... */ };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const fetchUser = async () => { /* ... (fetchUser kodu aynı) ... */ };
    fetchUser();
  }, []);

  const handleSearchFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearchTerm(searchTerm.trim());
    setSuggestions([]); // Form submit edildiğinde önerileri kapat
    // Yönlendirme Ana Sayfa (Home.tsx) veya Arama Sonuçları Sayfası (VehicleListPage.tsx)
    // içindeki useEffect tarafından searchTerm değişikliği ile tetiklenir.
    // Eğer MainHeader'dan spesifik bir sayfaya yönlendirme isteniyorsa (artık önerilmiyor):
    // const trimmedSearchTerm = searchTerm.trim();
    // if (trimmedSearchTerm) {
    //   router.push(`/vehicles?search=${encodeURIComponent(trimmedSearchTerm)}`);
    // }
  };

  const handleSuggestionClick = (suggestion: VehicleSuggestion) => {
    setSearchTerm(suggestion.name); // Arama kutusunu öneriyle doldur
    setSuggestions([]); // Önerileri kapat
    // Opsiyonel: Öneriye tıklanınca doğrudan araç detay sayfasına git
    // router.push(`/vehicles/${suggestion.slug || suggestion.id}`);
    // Veya Home.tsx'in bu searchTerm ile listeyi filtrelemesini bekle
  };


  const toggleDropdown = (menuGroup: string) => { /* ... (toggleDropdown kodu aynı) ... */ };
  const mainMenuItems = menuItems.filter(item => item.menu_group === "main");

  return (
    <header>
      {/* Üst Bilgi Çubuğu */}
      <div className="bg-[#6A3C96] text-white py-3 px-4">
        {/* ... (üst bilgi çubuğu içeriği aynı) ... */}
      </div>

      {/* Logo + Arama + Giriş Butonları */}
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

          {/* Arama kutusu (Masaüstü) */}
          {/* 3. ADIM: Arama kutusunun bulunduğu div'e relative class'ı ekle (zaten form'da relative var, bu yeterli olabilir) */}
          {/* Eğer öneri kutusu formun dışına taşıyorsa, kapsayıcı bir dive ref={searchContainerRef} ve relative eklenebilir */}
          <div ref={searchContainerRef} className="hidden md:block flex-grow mx-4 max-w-md relative"> {/* Bu div'e relative eklendi ve ref atandı */}
            <form onSubmit={handleSearchFormSubmit} className="relative"> {/* Formun kendisine de relative eklenebilir */}
              <input
                type="text"
                placeholder="Araç Ara (örn: Honda Civic)"
                className="w-full py-2 px-4 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-[#6A3C96] focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => { // Tekrar focus olunca ve searchTerm varsa önerileri göster
                  if (searchTerm.trim().length > 1) {
                    const filteredSuggestions = allVehiclesForSuggestions.filter(vehicle =>
                      vehicle.name.toLowerCase().includes(searchTerm.toLowerCase())
                    ).slice(0, 5);
                    setSuggestions(filteredSuggestions);
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
            {/* 2. ADIM: Arama öneri listesi */}
            {suggestions.length > 0 && (
              <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-b-md shadow-lg max-h-96 overflow-y-auto">
                {suggestions.map((vehicle) => (
                  <li key={vehicle.id}>
                    <button // Link yerine button kullandık, tıklama olayını handleSuggestionClick yönetecek
                      onClick={() => handleSuggestionClick(vehicle)}
                      className="w-full text-left px-4 py-3 hover:bg-gray-100 flex items-center gap-3"
                    >
                      <Image
                        src={vehicle.cover_image || "/placeholder.svg"}
                        alt={vehicle.name}
                        width={60} // Daha küçük resim
                        height={40}
                        className="object-cover rounded"
                      />
                      <div className="flex-grow">
                        <p className="font-semibold text-sm text-gray-800">{vehicle.name}</p>
                        {vehicle.price !== undefined && ( // Fiyat varsa göster
                           <p className="text-xs text-gray-600">
                             {vehicle.price.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })} / Gün
                           </p>
                        )}
                      </div>
                    </button>
                  </li>
                ))}
                 <li className="px-4 py-2 border-t text-center">
                    <button
                        onClick={(e) => {
                            e.preventDefault(); // Form submit'i engelle
                            const form = (e.target as HTMLElement).closest('form');
                            if (form) {
                                // Form submit'ini manuel tetikle (handleSearchFormSubmit çalışacak)
                                const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
                                form.dispatchEvent(submitEvent);
                            }
                            setSuggestions([]); // Önerileri kapat
                        }}
                        className="text-sm text-indigo-600 hover:text-indigo-800 font-semibold"
                    >
                        Tüm sonuçları gör ({searchTerm})
                    </button>
                </li>
              </ul>
            )}
          </div>

          {/* ... (Mobil Menü Butonu, Garaj / Giriş aynı) ... */}
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

      {/* Mobil arama kutusu (Öneri özelliği mobil için ayrıca düşünülmeli veya basitleştirilmeli) */}
      {isMobile && (
        // Mobil için öneri kutusu tasarımı ve UX'i masaüstünden farklı olabilir.
        // Bu örnekte mobil için öneri kutusu eklenmemiştir, ancak benzer bir mantıkla eklenebilir.
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
