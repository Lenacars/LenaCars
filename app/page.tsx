"use client";

import Image from "next/image"; // VehicleCard içinde kullanılıyor olabilir
import { useEffect, useState } from "react";
// import { Button } from "@/components/ui/button"; // Kullanılmıyorsa kaldırılabilir
import { Card, CardContent } from "@/components/ui/card";
import VehicleCard from "@/components/vehicle-card";
import HowItWorks from "@/components/how-it-works";
import HeroSlider from "@/components/hero-slider";
import { useSearch } from "@/context/SearchContext";
// import { ChevronDown } from "lucide-react"; // Paket kullanmayacağız

// Filtrelerin state tipi (Home bileşenine özel)
interface HomeFiltersState {
  brand: string;
  segment: string;
  bodyType: string;
  yakit_turu: string; // Ana sayfa state'inde bu şekilde
  vites: string;
  durum: string;
}

export default function Home() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [filters, setFilters] = useState<HomeFiltersState>({ // Tip güncellendi
    brand: "",
    segment: "",
    bodyType: "",
    yakit_turu: "",
    vites: "",
    durum: "",
  });
  const [sortType, setSortType] = useState("price-asc");

  const { searchTerm } = useSearch();

  // Araçları çekme ve filtreleme useEffect'leri aynı kalıyor...
  useEffect(() => {
    const fetchVehicles = async () => {
      const res = await fetch("https://adminpanel-green-two.vercel.app/api/araclar", {
        cache: "no-store",
      });

      if (!res.ok) {
        console.error("API'den araç verisi çekilemedi. Status:", res.status);
        setVehicles([]);
        setFiltered([]);
        return;
      }

      const json = await res.json();
      const rawVehicles = json.data || [];

      const transformed = rawVehicles.map((vehicle: any) => {
        const aktifVaryasyonlar = vehicle.variations?.filter((v: any) => v.status === "Aktif") || [];
        const enDusukFiyat =
          aktifVaryasyonlar.length > 0
            ? Math.min(...aktifVaryasyonlar.map((v: any) => v.fiyat))
            : vehicle.fiyat ?? 0;

        return {
          ...vehicle,
          id: vehicle.id,
          name: vehicle.isim || "Araç İsmi Yok",
          image: vehicle.cover_image?.startsWith("http")
            ? vehicle.cover_image
            : vehicle.cover_image
              ? `https://uxnpmdeizkzvnevpceiw.supabase.co/storage/v1/object/public/images/${vehicle.cover_image.replace(/^\/+/, "")}`
              : "/placeholder.svg",
          price: enDusukFiyat,
          rating: vehicle.rating || 4.5,
          features: vehicle.features || [],
          variations: aktifVaryasyonlar,
        };
      });
      setVehicles(transformed);
    };
    fetchVehicles();
  }, []);

  useEffect(() => {
    let results = [...vehicles];

    if (searchTerm && searchTerm.trim()) {
      results = results.filter((vehicle) =>
        vehicle.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    results = results.filter((v) =>
      (!filters.brand || v.brand === filters.brand) &&
      (!filters.segment || v.segment === filters.segment) &&
      (!filters.bodyType || v.bodyType === filters.bodyType) &&
      (!filters.yakit_turu || v.yakit_turu === filters.yakit_turu) &&
      (!filters.vites || v.vites === filters.vites) &&
      (!filters.durum || v.durum === filters.durum)
    );

    if (sortType === "price-asc") {
      results.sort((a, b) => a.price - b.price);
    } else if (sortType === "price-desc") {
      results.sort((a, b) => b.price - a.price);
    } else if (sortType === "rating") {
      results.sort((a, b) => b.rating - a.rating);
    }
    setFiltered(results);
  }, [filters, sortType, vehicles, searchTerm]);


  // --- TASARIM GÜNCELLEMELERİ BURADAN BAŞLIYOR ---
  const selectBaseClasses = "w-full bg-white border border-gray-300 text-gray-700 py-2.5 px-4 pr-8 rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-150 ease-in-out appearance-none";
  const selectPlaceholderClasses = "text-gray-400";

  const ChevronDownIcon = () => (
    <svg
      className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      strokeWidth="2"
    >
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  );
  // --- TASARIM GÜNCELLEMELERİ BURADA BİTİYOR ---

  return (
    <>
      <HeroSlider />

      <div className="container mx-auto px-4 py-8">
        {/* Filtreler bölümü bg-gray-50 ve daha fazla padding ile güncellendi */}
        <Card className="mb-12 shadow-xl bg-gray-50 rounded-xl">
          <CardContent className="p-5 sm:p-6"> {/* Padding ayarlandı */}
            {/* Grid yapısı ve gap ayarlandı */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                // Filtre key'leri Home bileşenindeki `filters` state'i ile eşleşmeli
                { key: "brand", label: "Marka Seçin" },
                { key: "segment", label: "Segment Seçin" },
                { key: "bodyType", label: "Kasa Tipi Seçin" },
                { key: "yakit_turu", label: "Yakıt Türü Seçin" },
                { key: "vites", label: "Vites Tipi Seçin" },
                { key: "durum", label: "Durum Seçin" },
              ].map(({ key, label }) => (
                // Her select için relative div ve ChevronDownIcon eklendi
                <div className="relative" key={key}>
                  <select
                    className={`${selectBaseClasses} ${filters[key as keyof HomeFiltersState] === "" ? selectPlaceholderClasses : "text-gray-800 font-medium"}`}
                    value={filters[key as keyof HomeFiltersState]}
                    onChange={(e) => setFilters({ ...filters, [key]: e.target.value })}
                  >
                    <option value="" className="text-gray-500">{label}</option>
                    {/* Options are dynamically generated from 'vehicles' data */}
                    {Array.from(new Set(vehicles.map((v) => v[key as keyof typeof v]).filter(Boolean))).sort().map((value: any) => (
                      <option key={value} value={value}>{value}</option>
                    ))}
                  </select>
                  <ChevronDownIcon />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div id="vehicle-list" className="mb-12">
          <div className="flex justify-between items-center mb-6 flex-wrap gap-y-4">
            <h2 className="text-3xl font-extrabold text-gray-800">Araç Filomuz</h2>
            <div className="flex items-center gap-x-3">
              <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">{filtered.length} sonuç bulundu</span>
              {/* Sıralama select'i için de aynı stil uygulanabilir */}
              <div className="relative">
                <select
                  value={sortType}
                  onChange={(e) => setSortType(e.target.value)}
                  className={`${selectBaseClasses} ${sortType === "" ? selectPlaceholderClasses : "text-gray-800 font-medium"}`} // Stil uygulandı
                >
                  <option value="price-asc">Fiyat: Düşükten Yükseğe</option>
                  <option value="price-desc">Fiyat: Yüksekten Düşüğe</option>
                  <option value="rating">Puan: En Yüksek</option>
                </select>
                <ChevronDownIcon />
              </div>
            </div>
          </div>

          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-xl text-gray-500">Aradığınız kriterlere uygun araç bulunamadı.</p>
            </div>
          )}
        </div>

        <HowItWorks />
      </div>
    </>
  );
}
