"use client";

export const dynamic = "force-dynamic";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef, FormEvent } from "react"; // FormEvent eklendi
import { supabase } from "@/lib/supabase-browser";
import NavigationMenu from "@/components/layout/NavigationMenu";
import { useSearch } from "@/context/SearchContext";
import { getMenuPages } from "@/lib/getMenuPages";

// toTitleCase Fonksiyonu (loglar şimdilik duruyor)
function toTitleCase(str: string | null | undefined) {
  console.log("toTitleCase GİRDİ:", str, "| Tip:", typeof str);
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
  console.log("toTitleCase ÇIKTI ('" + str + "' için):", result);
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
        const data = await getMenuPages(); 
        console.log("getMenuPages'den gelen veri:", data); 
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
                return { title: "Hatalı Veri", slug: "#", isExternal: false, group_sort_order:0, subItems: [] };
              }
              console.log("İŞLENECEK PARENT.TITLE:", parent.title, "| Tip:", typeof parent.title);
              const processedTitle = toTitleCase(parent.title);
              console.log("İŞLENMİŞ PARENT.TITLE ('" + parent.title + "' için):", processedTitle);
              return {
                title: processedTitle,
                slug: parent.external_url || parent.slug,
                isExternal: !!parent.external_url,
                group_sort_order: parent.group_sort_order ?? parent.sort_order ?? 0,
                subItems: data
                  .filter((child) => child && child.parent === parent.id)
                  .map((sub) => {
                    if (!sub || typeof sub.title === 'undefined') {
                      console.warn("Tanımsız sub veya sub.title tanımsız:", sub);
                      return { title: "Hatalı Alt Veri", slug: "#", isExternal: false };
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
        if (!res.ok) { console.error("Failed to fetch vehicles for suggestions. Status:", res.status); setAllVehiclesForSuggestions([]); return; }
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
      } catch (error) { console.error("Error fetching all vehicles for suggestions:", error); setAllVehiclesForSuggestions([]); }
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

  const handleSearchFormSubmit = (e: FormEvent<HTMLFormElement>) => { // FormEvent React'ten import edilmeli
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
    <header className="sticky top-0 z-50 bg-white"> {/* Header'a sticky ve z-index, shadow kaldırıldı (alttaki bar'da var) */}
      {/* Üst Bilgi Çubuğu */}
      <div className="bg-[#6A3C96] text-white py-2.5 px-4 text-sm"> {/* Hafif padding ayarı */}
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3 md:space-x-4"> {/* Responsive boşluk */}
            <Link href="/iletisim" className="flex items-center hover:text-gray-200 transition-colors" aria-label="Adres">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </Link>
            <Link href="/iletisim" className="flex items-center hover:text-gray-200 transition-colors" aria-label="E-posta">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </Link>
            <Link href="/iletisim" className="flex items-center hover:text-gray-200 transition-colors" aria-label="Telefon">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </Link>
          </div>
          <div className="text-center hidden md:block">
            <h2 className="text-sm md:text-base font-medium">Yüzlerce Araç Tek Ekranda Seç Beğen Güvenle Kirala</h2>
          </div>
          <div className="hidden md:flex items-center space-x-2.5">
            {/* Sosyal Medya Linkleri */}
            <Link href="https://facebook.com" target="_blank" className="text-white hover:text-gray-300 transition-colors" aria-label="Facebook"><svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" /></svg></Link>
            <Link href="https://instagram.com" target="_blank" className="text-white hover:text-gray-300 transition-colors" aria-label="Instagram"><svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg></Link>
            {/* LinkedIn ve YouTube ikonları da benzer şekilde eklenebilir */}
          </div>
        </div>
      </div>

      <div className="bg-white py-3.5 px-4 shadow-sm border-b border-gray-100">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/LENACARS.svg"
              alt="LenaCars Logo"
              width={170} // Biraz küçültüldü
              height={48}
              className="w-auto h-auto max-h-12" // Max yükseklik
              priority
              onError={(e) => { const target = e.target as HTMLImageElement; if (target.src.endsWith(".svg")) { target.src = "/LENACARS.png"; }}}
            />
          </Link>

          {/* MASAÜSTÜ ARAMA KUTUSU */}
          <div ref={searchContainerRef} className="hidden md:flex flex-grow items-center mx-6 max-w-xl relative"> {/* flex eklendi */}
            <form onSubmit={handleSearchFormSubmit} className="relative w-full flex items-center group"> {/* group eklendi */}
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#6A3C96] transition-colors pointer-events-none"> {/* Odaklanınca ikon rengi */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Araç Ara (Model, Marka vb.)" // Placeholder güncellendi
                className="w-full py-3 pl-12 pr-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6A3C96] focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md focus:shadow-md text-sm" // py-3, pl-12, rounded-lg, border-gray-200, text-sm
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => { if (searchTerm.trim().length > 1 && allVehiclesForSuggestions.length > 0) { /* ... */ } }}
              />
              {/* Arama butonu yorum satırında kalabilir veya isteğe bağlı eklenebilir */}
            </form>
            {suggestions.length > 0 && (
              <ul className="absolute top-full left-0 right-0 mt-1.5 z-30 w-full bg-white border border-gray-200 rounded-lg shadow-xl max-h-[calc(100vh-200px)] overflow-y-auto py-1.5"> {/* max-h ayarlandı, py-1.5 */}
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
                        width={72} // Boyut artırıldı
                        height={48} // Boyut artırıldı
                        className="object-cover rounded-md flex-shrink-0 bg-gray-100 aspect-[3/2]" // aspect ratio
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
                      className="block text-center py-2.5 text-sm font-medium text-[#6A3C96] hover:bg-purple-50 transition-colors duration-150 rounded-b-md" // hover:underline kaldırıldı, bg eklendi
                    >
                      Tüm sonuçları gör "{searchTerm}"
                    </a>
                  </li>
                )}
              </ul>
            )}
          </div>

          {/* Sağ Kısım: Mobil Menü Butonu ve Linkler */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="md:hidden"> {/* Mobil menü butonu */}
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
          <form onSubmit={handleSearchFormSubmit} className="relative flex items-center group">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#6A3C96] transition-colors pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
            <input
              type="text"
              placeholder="Araç Ara..."
              className="w-full py-2.5 pl-12 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6A3C96] focus:border-transparent transition-shadow duration-200 shadow-sm text-sm" // text-sm eklendi
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {/* Mobil arama butonu genellikle olmaz, enter ile arama yapılır */}
          </form>
          {/* Mobil için öneri listesi, eğer istenirse, masaüstündeki gibi ama farklı bir UI ile eklenebilir.
              Örneğin, input'a tıklandığında tam ekran bir overlay içinde görünebilir.
              Bu örnekte, basitlik adına mobil öneri listesi UI'ı eklenmemiştir.
          */}
           {isMobile && suggestions.length > 0 && (
              <ul className="mt-1.5 z-30 w-full bg-white border border-gray-200 rounded-lg shadow-xl max-h-[calc(100vh-250px)] overflow-y-auto py-1.5">
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
