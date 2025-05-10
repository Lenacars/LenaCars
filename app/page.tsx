"use client";

import Image from "next/image"; // VehicleCard içinde kullanılıyor olabilir
import { useEffect, useState } from "react";
// import { Button } from "@/components/ui/button"; // Kullanılmıyorsa kaldırılabilir
import { Card, CardContent } from "@/components/ui/card";
import VehicleCard from "@/components/vehicle-card";
import HowItWorks from "@/components/how-it-works";
import HeroSlider from "@/components/hero-slider";
import { useSearch } from "@/context/SearchContext";

export default function Home() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [filters, setFilters] = useState({
    brand: "",
    segment: "",
    bodyType: "",
    yakit_turu: "",
    vites: "",
    durum: "",
  });
  const [sortType, setSortType] = useState("price-asc");

  const { searchTerm } = useSearch();

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
      // setFiltered(transformed); // Filtreleme useEffect'i bunu zaten yapacak
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
                  {Array.from(new Set(vehicles.map((v) => v[key as keyof typeof v]).filter(Boolean))).map((value: any) => (
                    <option key={value} value={value}>{value}</option>
                  ))}
                </select>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Araç Filomuz bölümünün ana kapsayıcısına id="vehicle-list-section" (veya görseldeki gibi "vehicle-list") ekleniyor */}
        {/* Görseldeki ID "vehicle-list" olduğu için onu kullanıyorum. */}
        {/* Eğer MainHeader'da "vehicle-list-section" kullandıysanız, burayı da onunla eşleştirin. */}
        <div id="vehicle-list" className="mb-12"> {/* <--- ID BURAYA EKLENDİ */}
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
            // Araç kartlarının render edildiği grid'e ID vermek yerine,
            // bu grid'i de içeren bir üst kapsayıcıya ID vermek daha genel bir çözüm olabilir.
            // Görseldeki örnek direkt grid'e ID veriyor, ona uyuyorum.
            // Ancak, "Araç Filomuz" başlığını ve sıralama seçeneklerini de içeren
            // genel bir "Araç Listesi Bölümü"ne ID vermek daha mantıklı olabilir.
            // Bu yüzden yukarıdaki ana div'e id="vehicle-list" ekledim.
            // Eğer direkt grid'e eklenecekse: <div id="vehicle-list" className="grid...">
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
