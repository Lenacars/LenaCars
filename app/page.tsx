"use client";

import Image from "next/image"; // Kullanılmıyorsa kaldırılabilir veya VehicleCard içinde kullanılıyordur.
import { useEffect, useState } from "react";
// import { Button } from "@/components/ui/button"; // Kullanılmıyorsa kaldırılabilir.
import { Card, CardContent } from "@/components/ui/card";
import VehicleCard from "@/components/vehicle-card";
import HowItWorks from "@/components/how-it-works";
import HeroSlider from "@/components/hero-slider";
import { useSearch } from "@/context/SearchContext"; // <--- 1. ADIM: SearchContext import edildi

export default function Home() {
  const [vehicles, setVehicles] = useState<any[]>([]); // API'den gelen orijinal araç listesi
  const [filtered, setFiltered] = useState<any[]>([]);  // Filtrelenmiş ve sıralanmış, gösterilecek araç listesi
  const [filters, setFilters] = useState({
    brand: "",
    segment: "",
    bodyType: "",
    yakit_turu: "",
    vites: "",
    durum: "",
  });
  const [sortType, setSortType] = useState("price-asc");

  const { searchTerm } = useSearch(); // <--- 2. ADIM: SearchContext'ten searchTerm alındı

  useEffect(() => {
    const fetchVehicles = async () => {
      const res = await fetch("https://adminpanel-green-two.vercel.app/api/araclar", {
        cache: "no-store", // SSR veya sık güncellenen içerik için
      });

      if (!res.ok) {
        console.error("API'den araç verisi çekilemedi. Status:", res.status);
        setVehicles([]); // Hata durumunda boş liste ata
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
            : vehicle.fiyat ?? 0; // vehicle.fiyat fallback'i de olabilir

        return {
          ...vehicle, // Diğer tüm vehicle özelliklerini koru (brand, segment vb. için önemli)
          id: vehicle.id,
          name: vehicle.isim || "Araç İsmi Yok", // Filtrelemede kullanılacak 'name' alanı
          image: vehicle.cover_image?.startsWith("http")
            ? vehicle.cover_image
            : vehicle.cover_image
              ? `https://uxnpmdeizkzvnevpceiw.supabase.co/storage/v1/object/public/images/${vehicle.cover_image.replace(/^\/+/, "")}`
              : "/placeholder.svg", // Varsayılan bir placeholder resmi
          price: enDusukFiyat,
          rating: vehicle.rating || 4.5, // Varsayılan rating
          features: vehicle.features || [], // features alanı yoksa boş dizi ata
          variations: aktifVaryasyonlar,
        };
      });

      setVehicles(transformed);
      // setFiltered(transformed); // İlk yüklemede filtreleme useEffect'i zaten çalışacak
    };

    fetchVehicles();
  }, []); // Sadece component mount olduğunda çalışır

  useEffect(() => {
    let results = [...vehicles]; // Her zaman orijinal 'vehicles' listesinden başla

    // 3. ADIM: SearchTerm (isimle arama) filtresi
    if (searchTerm && searchTerm.trim()) { // searchTerm boş değilse
      results = results.filter((vehicle) =>
        vehicle.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Mevcut diğer filtrelere göre filtreleme
    results = results.filter((v) =>
      (!filters.brand || v.brand === filters.brand) &&
      (!filters.segment || v.segment === filters.segment) &&
      (!filters.bodyType || v.bodyType === filters.bodyType) &&
      (!filters.yakit_turu || v.yakit_turu === filters.yakit_turu) &&
      (!filters.vites || v.vites === filters.vites) &&
      (!filters.durum || v.durum === filters.durum)
    );

    // Sıralama
    if (sortType === "price-asc") {
      results.sort((a, b) => a.price - b.price);
    } else if (sortType === "price-desc") {
      results.sort((a, b) => b.price - a.price);
    } else if (sortType === "rating") {
      results.sort((a, b) => b.rating - a.rating);
    }

    setFiltered(results);
  }, [filters, sortType, vehicles, searchTerm]); // <--- searchTerm'ü bağımlılıklara ekle

  return (
    <>
      <HeroSlider />

      <div className="container mx-auto px-4 py-8">
        <Card className="mb-12 shadow-lg">
          <CardContent className="p-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
              {[
                { key: "brand", label: "Marka Seçin" },
                { key: "segment", label: "Segment Seçin" },
                { key: "bodyType", label: "Kasa Tipi Seçin" },
                { key: "yakit_turu", label: "Yakıt Türü Seçin" },
                { key: "vites", label: "Vites Tipi Seçin" },
                { key: "durum", label: "Durum Seçin" },
              ].map(({ key, label }) => (
                <select
                  key={key}
                  className="border p-2 rounded-md focus:ring-2 focus:ring-indigo-500 transition-shadow"
                  value={filters[key as keyof typeof filters]}
                  onChange={(e) => setFilters({ ...filters, [key]: e.target.value })}
                >
                  <option value="">{label}</option>
                  {/* Dinamik olarak seçenekleri vehicles listesinden al */}
                  {Array.from(new Set(vehicles.map((v) => v[key as keyof typeof v]).filter(Boolean))).map((value: any) => (
                    <option key={value} value={value}>{value}</option>
                  ))}
                </select>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="mb-12">
          <div className="flex justify-between items-center mb-6 flex-wrap gap-y-4">
            <h2 className="text-3xl font-extrabold text-gray-800">Araç Filomuz</h2>
            <div className="flex items-center gap-x-3">
              <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">{filtered.length} sonuç bulundu</span>
              <select
                value={sortType}
                onChange={(e) => setSortType(e.target.value)}
                className="p-2 border rounded-md text-sm focus:ring-2 focus:ring-indigo-500 transition-shadow"
              >
                <option value="price-asc">Fiyat: Düşükten Yükseğe</option>
                <option value="price-desc">Fiyat: Yüksekten Düşüğe</option>
                <option value="rating">Puan: En Yüksek</option>
              </select>
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
              {/* İsteğe bağlı olarak filtreleri temizle butonu eklenebilir */}
            </div>
          )}
        </div>

        <HowItWorks />
      </div>
    </>
  );
}
