"use client";

export const dynamic = "force-dynamic";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef, FormEvent } from "react"; // FormEvent eklendi
import { supabase } from "@/lib/supabase-browser";
import NavigationMenu from "@/components/layout/NavigationMenu";
import { useSearch } from "@/context/SearchContext";
import { getMenuPages } from "@/lib/getMenuPages";

// toTitleCase Fonksiyonu (işlevselliği aynı, loglar duruyor)
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

  // Mevcut useEffect'leriniz aynı kalıyor...
  useEffect(() => {
    const fetchMenuItems = async () => {
      // console.log("fetchMenuItems çağrıldı.");
      try {
        const data = await getMenuPages();
        // console.log("getMenuPages'den gelen veri:", data);
        if (!data || data.length === 0) {
          // console.warn("getMenuPages'den boş veya tanımsız veri geldi.");
          setMenuItems([]);
          return;
        }
        const groups: { [key: string]: any[] } = {};
        for (const page of data) { /* ... */ }
        // ... (menuItems oluşturma logiğiniz aynı)
        // Örnek olarak kısa kesiyorum, sizin kodunuzdaki mantık devam edecek
        const sortedMenuItems = Object.entries(groups)
         .map(([groupOrParentId, pagesInGroupOrParentItemArray]) => {
            return pagesInGroupOrParentItemArray.map((parent) => ({
              title: toTitleCase(parent.title),
              slug: parent.external_url || parent.slug,
              isExternal: !!parent.external_url,
              group_sort_order: parent.group_sort_order ?? parent.sort_order ?? 0,
              subItems: data
                .filter((child) => child && child.parent === parent.id)
                .map((sub) => ({
                  title: toTitleCase(sub.title),
                  slug: sub.external_url || sub.slug,
                  isExternal: !!sub.external_url,
                })),
            }));
          })
         .flat()
         .sort((a, b) => (a.group_sort_order ?? 0) - (b.group_sort_order ?? 0));
        setMenuItems(sortedMenuItems);

      } catch (error) {
        console.error("fetchMenuItems sırasında hata oluştu:", error);
        setMenuItems([]);
      }
    };
    fetchMenuItems();
  }, []);

  useEffect(() => { /* checkMobile logiği */ 
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
  useEffect(() => { /* fetchUser logiği */ 
    const fetchUser = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData.session?.user?.id;
      if (!userId) return;
      const { data, error } = await supabase.from("kullanicilar").select("ad, soyad").eq("id", userId).single();
      if (!error && data) setUserName(`${data.ad} ${data.soyad}`);
      else if (error && error.code !== 'PGRST116') console.error("Error fetching user name:", error.message);
    };
    fetchUser();
  }, []);
  useEffect(() => { /* fetchAllVehiclesForSuggestions logiği */
    const fetchAllVehiclesForSuggestions = async () => {
      try {
        const res = await fetch("https://adminpanel-green-two.vercel.app/api/araclar", { cache: "no-store" });
        if (!res.ok) {
          setAllVehiclesForSuggestions([]); return;
        }
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
      } catch (error) { setAllVehiclesForSuggestions([]); }
    };
    fetchAllVehiclesForSuggestions();
   }, []);
  useEffect(() => { /* searchTerm'e göre suggestions logiği */
    if (searchTerm.trim().length > 1) {
      const filtered = allVehiclesForSuggestions.filter(vehicle =>
        vehicle.name.toLowerCase().includes(searchTerm.toLowerCase())
      ).slice(0, 5);
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [searchTerm, allVehiclesForSuggestions]);
  useEffect(() => { /* handleClickOutside logiği */ 
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setSuggestions([]);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [searchContainerRef]);

  const handleSearchFormSubmit = (e: FormEvent<HTMLFormElement>) => { // FormEvent tipi eklendi
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
  const handleSuggestionClick = (suggestion: VehicleSuggestion) => { /* ... */ 
    setSearchTerm(suggestion.name);
    setSuggestions([]);
    const vehicleListElement = document.getElementById('vehicle-list');
    if (vehicleListElement) {
      vehicleListElement.scrollIntoView({ behavior: "smooth" });
    }
  };
  const toggleDropdown = (menuGroup: string) => { /* ... */ 
    setActiveDropdown(activeDropdown === menuGroup ? null : menuGroup);
  };

  const mainMenuItems = [...menuItems].sort((a, b) => (a.group_sort_order ?? 0) - (b.group_sort_order ?? 0));

  // --- TASARIM GÜNCELLEMELERİ BURADAN İTİBAREN ---
  return (
    <header className="sticky top-0 z-50 bg-white shadow-md"> {/* Header'a sticky ve z-index */}
      {/* Üst Bilgi Çubuğu (Aynı kalıyor) */}
      <div className="bg-[#6A3C96] text-white py-2.5 px-4 text-sm"> {/* Hafif padding ayarı */}
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3"> {/* İkonlar arası boşluk */}
            <Link href="/iletisim" className="flex items-center hover:text-gray-200 transition-colors" aria-label="Adres">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </Link>
            {/* Diğer üst bilgi ikonları da benzer şekilde güncellenebilir */}
          </div>
          <div className="text-center hidden md:block">
            <h2 className="text-base font-medium">Yüzlerce Araç Tek Ekranda Seç Beğen Güvenle Kirala</h2>
          </div>
          <div className="hidden md:flex items-center space-x-2.5"> {/* Sosyal medya ikonları arası boşluk */}
            {/* Sosyal medya linkleri aynı kalıyor */}
          </div>
        </div>
      </div>

      {/* Ana Header İçeriği */}
      <div className="bg-white py-3.5 px-4 shadow-sm border-b border-gray-100"> {/* Hafif padding ayarı ve alt border */}
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/LENACARS.svg" // Logo yolu
              alt="LenaCars Logo"
              width={180} // Boyut ayarlandı
              height={50} // Boyut ayarlandı
              className="w-auto h-auto max-h-12" // Max yükseklik
              priority
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                if (target.src.endsWith(".svg")) { target.src = "/LENACARS.png"; } // Fallback PNG
              }}
            />
          </Link>

          {/* MASAÜSTÜ ARAMA KUTUSU */}
          <div ref={searchContainerRef} className="hidden md:block flex-grow mx-6 max-w-lg relative"> {/* max-w artırıldı, mx ayarlandı */}
            <form onSubmit={handleSearchFormSubmit} className="relative flex items-center">
              {/* Arama ikonu input içinde (isteğe bağlı) */}
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Araç Ara (örn: Honda Civic)"
                className="w-full py-2.5 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6A3C96] focus:border-transparent transition-shadow duration-200 shadow-sm hover:shadow-md" // Yuvarlak köşeler, padding, gölge ve hover efekti
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => { /* onFocus logiği */ }}
              />
              {/* Buton kaldırıldı, arama enter ile veya öneriye tıklayarak yapılabilir.
                  Eğer buton isteniyorsa, input'un sağına eklenebilir veya form dışına alınabilir.
                  Şimdilik daha sade bir görünüm için kaldırdım.
                  İstenirse:
              <button
                type="submit"
                className="absolute right-0 top-0 h-full px-4 bg-[#E67E22] text-white rounded-r-lg hover:bg-[#D35400] transition-colors"
                aria-label="Ara"
              >
                <svg>...</svg>
              </button>
              */}
            </form>
            {/* ÖNERİ LİSTESİ */}
            {suggestions.length > 0 && (
              <ul className="absolute top-full left-0 right-0 mt-1.5 z-30 w-full bg-white border border-gray-200 rounded-lg shadow-xl max-h-80 overflow-y-auto py-1"> {/* Daha belirgin gölge, yuvarlak köşeler, dikey padding */}
                {suggestions.map((vehicle) => (
                  <li key={vehicle.id}>
                    <button
                      type="button"
                      onClick={() => handleSuggestionClick(vehicle)}
                      className="w-full text-left px-4 py-3 hover:bg-purple-50 hover:text-[#6A3C96] flex items-center gap-3.5 transition-colors duration-150 rounded-md mx-1 my-0.5" // Padding, hover rengi, yuvarlak köşeler, dikey margin
                    >
                      <Image
                        src={vehicle.cover_image || "/placeholder.svg"}
                        alt={vehicle.name}
                        width={60} // Boyut artırıldı
                        height={40} // Boyut artırıldı
                        className="object-cover rounded-md flex-shrink-0 bg-gray-100" // Arka plan eklendi
                        unoptimized={vehicle.cover_image?.startsWith("http")}
                      />
                      <div className="flex-grow overflow-hidden">
                        <p className="font-medium text-sm text-gray-800 truncate">{vehicle.name}</p>
                        {vehicle.price !== undefined && vehicle.price > 0 && (
                          <p className="text-xs text-gray-500 mt-0.5"> {/* Hafif margin */}
                            {vehicle.price.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY', minimumFractionDigits: 0, maximumFractionDigits: 0 })} / Gün
                          </p>
                        )}
                      </div>
                    </button>
                  </li>
                ))}
                {searchTerm.trim().length > 0 && ( // Sadece arama terimi varsa göster
                   <li className="border-t border-gray-100 mt-1 pt-1">
                    <a
                      href="#vehicle-list" // Doğrudan araç listesine gitmeli, bu yüzden `searchTerm` ile link oluşturmaya gerek yok.
                      onClick={(e) => {
                        e.preventDefault();
                        handleSearchFormSubmit(e as any); // form submit'i tetikle
                      }}
                      className="block text-center py-2.5 text-sm font-medium text-[#6A3C96] hover:underline hover:bg-gray-50 transition-colors duration-150 rounded-b-md"
                    >
                      Tüm sonuçları gör "{searchTerm}"
                    </a>
                  </li>
                )}
              </ul>
            )}
          </div>

          {/* Mobil menü butonu ve Sağdaki Linkler (Garaj, Giriş Yap) */}
          <div className="flex items-center space-x-3">
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#6A3C96]" // Odak stili
                aria-label={isMobileMenuOpen ? "Menüyü Kapat" : "Menüyü Aç"}
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}> <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}> <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
                )}
              </button>
            </div>

            <div className="hidden md:flex items-center space-x-3">
              <Link href="/garaj" className="border border-[#6A3C96] text-[#6A3C96] px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-50 transition-colors"> {/* rounded-lg, text-sm, font-medium */}
                Garaj
              </Link>
              <Link
                href={userName ? "/profil" : "/giris"}
                className={`${
                  userName ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-[#6A3C96] text-white hover:bg-[#5a3080]"
                } px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center`} // rounded-lg, text-sm, font-medium
              >
                {userName || "Giriş Yap / Üye Ol"}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* NavigationMenu (Aynı kalıyor) */}
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
        <div className="bg-gray-50 p-3 border-t border-gray-200"> {/* Arka plan ve padding */}
          <form onSubmit={handleSearchFormSubmit} className="relative flex items-center">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
            <input
              type="text"
              placeholder="Araç Ara..." // Daha kısa placeholder
              className="w-full py-2.5 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6A3C96] focus:border-transparent transition-shadow duration-200 shadow-sm" // Aynı stil
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {/* Mobil için de arama butonu genellikle input içinde olmaz veya daha minimal olur.
                Enter ile arama burada da geçerli.
            */}
          </form>
          {/* Mobil için öneri listesi de masaüstündeki gibi gösterilebilir, ancak genellikle arama input'u odaklandığında tam ekran bir modal veya farklı bir UI ile sunulur.
              Şimdilik mobil öneri listesini bu tasarıma dahil etmiyorum, çünkü bu daha karmaşık bir UI değişikliği gerektirir.
              Eğer istenirse, masaüstündeki öneri listesi (`suggestions.length > 0 && ...`) mobil için de benzer şekilde (belki farklı konumlandırma ile) eklenebilir.
          */}
        </div>
      )}
    </header>
  );
}
