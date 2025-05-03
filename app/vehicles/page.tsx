"use client";

import { useEffect, useState } from "react";
import VehicleCard from "@/components/vehicle-card";

interface RawVehicle {
  id: string;
  isim: string;
  aciklama?: string;
  cover_image?: string;
  fiyat?: number;
}

interface TransformedVehicle {
  id: string;
  name: string;
  image: string;
  price: number;
  rating: number;
  features: string[];
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

        console.log("📦 İstek atıldı. Status:", res.status);
        const json = await res.json();
        console.log("📊 API'den dönen veri:", json);

        if (!res.ok) {
          console.error("❌ API hatası:", json.error);
          return;
        }

        const transformed = json.data.map((item: RawVehicle): TransformedVehicle => ({
          id: item.id,
          name: item.isim || "Araç İsmi Yok",
          image: `https://uxnpmdeizkzvnevpceiw.supabase.co/storage/v1/object/public/images/${item.cover_image}`,
          price: item.fiyat ?? 0,
          rating: 4.5,
          features: [],
        }));

        setVehicles(transformed);
      } catch (err) {
        console.error("❌ Fetch hatası:", err);
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
