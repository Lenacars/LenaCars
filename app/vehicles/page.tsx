"use client";

import { useEffect, useState } from "react";
import VehicleCard from "@/components/vehicle-card";

// Variation tipi eksikti, ekliyoruz
interface Variation {
  fiyat: number;
  status: string;
  // Diğer varyasyon alanları (kilometre, sure) burada olmasa da olur,
  // çünkü dönüşümde sadece fiyat ve status kullanılıyor.
  // Ancak tamlık açısından eklenebilir:
  // kilometre?: string;
  // sure?: string;
}

interface RawVehicle {
  id: string;
  isim: string;
  aciklama?: string;
  cover_image?: string;
  fiyat?: number;
  variations?: Variation[]; // Görseldeki gibi variations alanı eklendi
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

        const json = await res.json();
        if (!res.ok) {
          console.error("❌ API hatası:", json.error);
          setLoading(false); // Hata durumunda da yükleniyor state'ini false yapalım
          return;
        }

        const transformed = json.data.map((item: RawVehicle): TransformedVehicle => { // item tipini RawVehicle olarak belirttik
          let lowestPrice = item.fiyat ?? 0;

          // Görseldeki gibi aktif varyasyonları filtreleyip en düşük fiyatı bulma mantığı zaten mevcuttu
          const aktifler = item.variations?.filter((v) => v.status === "Aktif") || [];

          if (aktifler.length > 0) {
            lowestPrice = Math.min(...aktifler.map((v) => v.fiyat));
          }

          return {
            id: item.id,
            name: item.isim || "Araç İsmi Yok",
            // Cover image URL'ini oluştururken path'in başındaki '/' işaretini temizledik
            image: `https://uxnpmdeizkzvnevpceiw.supabase.co/storage/v1/object/public/images/${item.cover_image?.replace(/^\/+/, "") || "placeholder.svg"}`, // Varsayılan görsel eklendi
            price: lowestPrice,
            rating: 4.5, // Sabit değer, ihtiyaca göre değiştirilebilir
            features: [], // Boş dizi, ihtiyaca göre özellikler eklenebilir
          };
        });

        setVehicles(transformed);
      } catch (err) {
        console.error("❌ Fetch hatası:", err);
        // Hata durumunda da loading state'ini false yapalım
        setLoading(false);
      } finally {
        // Başarılı veya hatalı olsa da yükleniyor state'ini kapat
        if (loading) setLoading(false); // Zaten hata durumunda false yapıyoruz, tekrar kontrol ettik.
      }
    };

    fetchVehicles();
  }, []); // useEffect bağımlılıkları boş dizi, sadece component mount olduğunda çalışır

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Araç Filomuz</h1>
      {loading ? (
        <p>Yükleniyor...</p>
      ) : vehicles.length === 0 ? (
         <p>Araç bulunamadı.</p> // Araç yoksa mesaj göster
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
