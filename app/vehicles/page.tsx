"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase-browser";
import VehicleCard from "@/components/vehicle-card";

interface Variation {
  fiyat: number;
  status: string;
}

interface RawVehicle {
  id: string;
  isim: string;
  stok_kodu?: string;
  brand?: string;
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
  variations: Variation[];
}

function VehicleListContent() {
  const [vehicles, setVehicles] = useState<TransformedVehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search")?.toLowerCase() || "";

  useEffect(() => {
    const fetchVehicles = async () => {
      setLoading(true);

      try {
        let query = supabase
          .from("Araclar")
          .select(`
            id,
            isim,
            stok_kodu,
            brand,
            aciklama,
            cover_image,
            fiyat,
            variations:fk_arac_id (
              fiyat,
              status
            )
          `);

        if (searchQuery) {
          query = query.or(
            `isim.ilike.%${searchQuery}%,stok_kodu.ilike.%${searchQuery}%,brand.ilike.%${searchQuery}%`
          );
        }

        const { data, error } = await query;

        console.log("🟢 Supabase'den gelen araç verisi:", data);

        if (error) {
          console.error("❌ Supabase sorgu hatası:", error);
          setVehicles([]);
          return;
        }

        if (!data) {
          setVehicles([]);
          return;
        }

        const transformed: TransformedVehicle[] = data.map((item: RawVehicle) => {
          const aktifler = item.variations?.filter((v) => v.status === "Aktif") || [];

          const lowestPrice =
            aktifler.length > 0
              ? Math.min(...aktifler.map((v) => v.fiyat))
              : item.fiyat ?? 0;

          return {
            id: item.id,
            name: item.isim || "Araç İsmi Yok",
            image: `https://uxnpmdeizkzvnevpceiw.supabase.co/storage/v1/object/public/images/${item.cover_image?.replace(/^\/+/, "") || "placeholder.svg"}`,
            price: lowestPrice,
            rating: 4.5,
            features: [],
            variations: aktifler,
          };
        });

        setVehicles(transformed);
      } catch (err) {
        console.error("❌ Fetch/transform hatası:", err);
        setVehicles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, [searchQuery]);

  if (loading) {
    return <div className="text-center py-8">Araçlar yükleniyor...</div>;
  }

  if (vehicles.length === 0) {
    return <div className="text-center py-8">Arama kriterlerinize uygun araç bulunamadı.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {vehicles.map((vehicle) => (
        <VehicleCard key={vehicle.id} vehicle={vehicle} />
      ))}
    </div>
  );
}

export default function VehicleListPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Araç Filomuz</h1>
      <Suspense fallback={<div className="text-center py-8">Yükleniyor...</div>}>
        <VehicleListContent />
      </Suspense>
    </div>
  );
}
