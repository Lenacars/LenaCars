"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
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
          rating: 4.5,
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
    const results = vehicles.filter((v) =>
      (!filters.brand || v.brand === filters.brand) &&
      (!filters.segment || v.segment === filters.segment) &&
      (!filters.bodyType || v.bodyType === filters.bodyType) &&
      (!filters.yakit_turu || v.yakit_turu === filters.yakit_turu) &&
      (!filters.vites || v.vites === filters.vites) &&
      (!filters.durum || v.durum === filters.durum)
    );
    setFiltered(results);
  }, [filters, vehicles]);

  return (
    <>
      <HeroSlider />

      <div className="container mx-auto px-4 py-8">
        <Card className="mb-12">
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
              <select
                className="border p-2 rounded"
                value={filters.brand}
                onChange={(e) => setFilters({ ...filters, brand: e.target.value })}
              >
                <option value="">Marka</option>
                {Array.from(new Set(vehicles.map((v) => v.brand).filter(Boolean))).map((brand) => (
                  <option key={brand}>{brand}</option>
                ))}
              </select>

              <select
                className="border p-2 rounded"
                value={filters.segment}
                onChange={(e) => setFilters({ ...filters, segment: e.target.value })}
              >
                <option value="">Segment</option>
                {Array.from(new Set(vehicles.map((v) => v.segment).filter(Boolean))).map((segment) => (
                  <option key={segment}>{segment}</option>
                ))}
              </select>

              <select
                className="border p-2 rounded"
                value={filters.bodyType}
                onChange={(e) => setFilters({ ...filters, bodyType: e.target.value })}
              >
                <option value="">Kasa Tipi</option>
                {Array.from(new Set(vehicles.map((v) => v.bodyType).filter(Boolean))).map((body) => (
                  <option key={body}>{body}</option>
                ))}
              </select>

              <select
                className="border p-2 rounded"
                value={filters.yakit_turu}
                onChange={(e) => setFilters({ ...filters, yakit_turu: e.target.value })}
              >
                <option value="">Yakıt Türü</option>
                {Array.from(new Set(vehicles.map((v) => v.yakit_turu).filter(Boolean))).map((fuel) => (
                  <option key={fuel}>{fuel}</option>
                ))}
              </select>

              <select
                className="border p-2 rounded"
                value={filters.vites}
                onChange={(e) => setFilters({ ...filters, vites: e.target.value })}
              >
                <option value="">Vites</option>
                {Array.from(new Set(vehicles.map((v) => v.vites).filter(Boolean))).map((gear) => (
                  <option key={gear}>{gear}</option>
                ))}
              </select>

              <select
                className="border p-2 rounded"
                value={filters.durum}
                onChange={(e) => setFilters({ ...filters, durum: e.target.value })}
              >
                <option value="">Durum</option>
                {Array.from(new Set(vehicles.map((v) => v.durum).filter(Boolean))).map((status) => (
                  <option key={status}>{status}</option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>

        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Araç Filomuz</h2>
            <div className="flex items-center">
              <span className="mr-2 text-sm">{filtered.length} sonuç bulundu</span>
              <select className="p-2 border rounded-md text-sm">
                <option>Fiyata göre sırala: Düşükten yükseğe</option>
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
