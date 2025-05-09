"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import VehicleCard from "@/components/vehicle-card";
import HowItWorks from "@/components/how-it-works";
import HeroSlider from "@/components/hero-slider";

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

  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("arama")?.toLowerCase().trim() || "";

  useEffect(() => {
    const fetchVehicles = async () => {
      const res = await fetch("https://adminpanel-green-two.vercel.app/api/araclar", {
        cache: "no-store",
      });

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
          features: [],
          variations: aktifVaryasyonlar,
        };
      });

      setVehicles(transformed);
      setFiltered(transformed);
    };

    fetchVehicles();
  }, []);

  useEffect(() => {
    let results = vehicles.filter((v) =>
      (!filters.brand || v.brand === filters.brand) &&
      (!filters.segment || v.segment === filters.segment) &&
      (!filters.bodyType || v.bodyType === filters.bodyType) &&
      (!filters.yakit_turu || v.yakit_turu === filters.yakit_turu) &&
      (!filters.vites || v.vites === filters.vites) &&
      (!filters.durum || v.durum === filters.durum)
    );

    if (searchQuery) {
      results = results.filter((v) =>
        v.isim?.toLowerCase().includes(searchQuery) ||
        v.stok_kodu?.toLowerCase().includes(searchQuery)
      );
    }

    if (sortType === "price-asc") {
      results.sort((a, b) => a.price - b.price);
    } else if (sortType === "price-desc") {
      results.sort((a, b) => b.price - a.price);
    } else if (sortType === "rating") {
      results.sort((a, b) => b.rating - a.rating);
    }

    setFiltered(results);
  }, [filters, sortType, vehicles, searchQuery]);

  return (
    <>
      <HeroSlider />

      <div className="container mx-auto px-4 py-8">
        <Card className="mb-12">
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
              {[
                { key: "brand", label: "Marka" },
                { key: "segment", label: "Segment" },
                { key: "bodyType", label: "Kasa Tipi" },
                { key: "yakit_turu", label: "Yakıt Türü" },
                { key: "vites", label: "Vites" },
                { key: "durum", label: "Durum" },
              ].map(({ key, label }) => (
                <select
                  key={key}
                  className="border p-2 rounded"
                  value={filters[key as keyof typeof filters]}
                  onChange={(e) => setFilters({ ...filters, [key]: e.target.value })}
                >
                  <option value="">{label}</option>
                  {Array.from(new Set(vehicles.map((v) => v[key as keyof typeof filters]).filter(Boolean))).map((value) => (
                    <option key={value}>{value}</option>
                  ))}
                </select>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="mb-12">
          <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
            <h2 className="text-2xl font-bold">Araç Filomuz</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm">{filtered.length} sonuç bulundu</span>
              <select
                value={sortType}
                onChange={(e) => setSortType(e.target.value)}
                className="p-2 border rounded-md text-sm"
              >
                <option value="price-asc">Fiyat: Düşükten Yükseğe</option>
                <option value="price-desc">Fiyat: Yüksekten Düşüğe</option>
                <option value="rating">Puan: En Yüksek</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        </div>

        <HowItWorks />
      </div>
    </>
  );
}
