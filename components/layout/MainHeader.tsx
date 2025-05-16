"use client";

export const dynamic = "force-dynamic";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase-browser";
import NavigationMenu from "@/components/layout/NavigationMenu";
import { useSearch } from "@/context/SearchContext";

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
  const [garageCount, setGarageCount] = useState(0); // <--- YENİ STATE

  const [suggestions, setSuggestions] = useState<VehicleSuggestion[]>([]);
  const [allVehiclesForSuggestions, setAllVehiclesForSuggestions] = useState<VehicleSuggestion[]>([]);
  const searchContainerRef = useRef<HTMLDivElement>(null);

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
      } else if (error) {
        console.error("Error fetching menu items:", error.message);
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
      } else if (error && error.code !== 'PGRST116') {
        console.error("Error fetching user name:", error.message);
      }
    };
    fetchUser();
  }, []);

  // Garajdaki araç sayısını getiren useEffect
  useEffect(() => {
    const fetchGarageCount = async () => {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        console.error("Error getting session for garage count:", sessionError.message);
        // Oturum hatası durumunda guest_garaj'a bakılabilir veya 0 olarak ayarlanabilir
        try {
            const stored = JSON.parse(localStorage.getItem("guest_garaj") || "[]");
            setGarageCount(stored.length);
        } catch (e) {
            console.error("Error parsing guest_garaj from localStorage", e);
            setGarageCount(0);
        }
        return;
      }

      const userId = sessionData.session?.user?.id;

      if (userId) {
        const { count, error: countError } = await supabase
          .from("garaj") // Tablo adınızın "garaj" olduğundan emin olun
          .select("id", { count: "exact", head: true })
          .eq("user_id", userId); // Kolon adınızın "user_id" olduğundan emin olun

        if (countError) {
          console.error("Error fetching garage count:", countError.message);
          setGarageCount(0);
        } else {
          setGarageCount(count || 0);
        }
      } else {
        try {
            const stored = JSON.parse(localStorage.getItem("guest_garaj") || "[]");
            setGarageCount(stored.length);
        } catch (e) {
            console.error("Error parsing guest_garaj from localStorage", e);
            setGarageCount(0);
        }
      }
    };

    fetchGarageCount();
    // Supabase auth state değişikliklerini dinlemek için:
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
        // Oturum durumu değiştiğinde (login, logout) garaj sayısını tekrar çek
        fetchGarageCount();
    });

    return () => {
        // Listener'ı component unmount olduğunda temizle
        if (authListener && authListener.subscription) {
            authListener.subscription.unsubscribe();
        }
    };
  }, []); // Bağımlılık dizisi boş, component mount olduğunda ve auth state değiştiğinde çalışır


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

  const mainMenuItems = menuItems.filter(item => item.menu_group === "main");

  return (
    <header>
      {/* Üst Bilgi Çubuğu */}
      <div className="bg-[#6A3C96] text-white py-3 px-4">
        {/* ... (mevcut üst bilgi çubuğu içeriği) */}
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
            {/* ... (mevcut arama formu) */}
          </div>

          <div className="md:hidden">
            {/* ... (mevcut mobil menü butonu) */}
          </div>

          <div className="hidden md:flex items-center space-x-3">
            <Link
              href="/garaj"
              className="border border-[#6A3C96] text-[#6A3C96] px-4 py-2 rounded-md flex items-center hover:bg-gray-50 transition-colors text-sm" // <--- GÜNCELLENDİ
            >
              Garaj {garageCount > 0 && `(${garageCount})`} {/* <--- GÜNCELLENDİ */}
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
        <form onSubmit={handleSearchFormSubmit} className="bg-white py-2 px-4 border-t border-gray-200 md:hidden"> {/* <--- md:hidden eklendi */}
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
