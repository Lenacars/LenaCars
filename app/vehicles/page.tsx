"use client";

import { useEffect, useState } from "react";
import VehicleCard from "@/components/vehicle-card";

interface Variation {
  fiyat: number;
  status: string;
}

interface RawVehicle {
  id: string;
  isim: string;
  aciklama?: string;
  cover_image?: string;
  fiyat?: number;
  variations?: Variation[];
}

interface TransformedVehicle {
  id: string;
  name: string;
  image: string;
  price: number;
  rating: number;
  features: string[];
  variations: Variation[]; // 🔧 Gerekli alan
}

export default function VehicleListPage() {
  const [vehicles, setVehicles] = useState<TransformedVehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const res = await fetch("https://adminpanel-green-two.vercel.app/api/araclar", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const json = await res.json();
        if (!res.ok) {
          console.error("❌ API hatası:", json.error);
          setLoading(false);
          return;
        }

        const transformed = json.data.map((item: RawVehicle): TransformedVehicle => {
          const aktifler = item.variations?.filter((v) => v.status === "Aktif") || [];
          const lowestPrice = aktifler.length > 0
            ? Math.min(...aktifler.map((v) => v.fiyat))
            : item.fiyat ?? 0;

          return {
            id: item.id,
            name: item.isim || "Araç İsmi Yok",
            image: `https://uxnpmdeizkzvnevpceiw.supabase.co/storage/v1/object/public/images/${item.cover_image?.replace(/^\/+/, "") || "placeholder.svg"}`,
            price: lowestPrice,
            rating: 4.5,
            features: [],
            variations: item.variations || [],
          };
        });

        setVehicles(transformed);
      } catch (err) {
        console.error("❌ Fetch hatası:", err);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Araç Filomuz</h1>
      {loading ? (
        <p>Yükleniyor...</p>
      ) : vehicles.length === 0 ? (
        <p>Araç bulunamadı.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      )}
    </div>
  );
}
