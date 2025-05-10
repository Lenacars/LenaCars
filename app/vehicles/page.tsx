"use client";

import { useEffect, useState, Suspense } from "react"; // <--- Suspense eklendi (opsiyonel ama iyi pratik)
import { useSearchParams } from "next/navigation"; // <--- 1. useSearchParams import edildi
import { supabase } from "@/lib/supabase-browser"; // <--- 2. supabase import edildi
import VehicleCard from "@/components/vehicle-card";

interface Variation {
  fiyat: number;
  status: string;
}

// RawVehicle interface'i Supabase'den gelen ham veriye daha çok benzeyebilir.
// 'isim' alanı için görseldeki örnekte 'title' kullanılmış, bu tutarlılığa dikkat edin.
// Şimdilik 'isim' ve 'aciklama' üzerinden arama yapacağız.
interface RawVehicleFromSupabase {
  id: string;
  isim: string;        // Arama için kullanılacak alan (Supabase'de 'title' olabilir)
  aciklama?: string;    // Arama için kullanılabilecek diğer bir alan
  cover_image?: string;
  fiyat?: number;       // Bu alan doğrudan kullanılmıyor gibi, varyasyonlardan alınıyor
  variations?: any[];   // Supabase'den variations JSON olarak veya ilişkili tablo olarak gelebilir
  // stok_kodu?: string; // Eğer stok_kodu'na göre de arama yapılacaksa eklenmeli
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

// Suspense ile kullanmak için bileşeni ayrı bir fonksiyona taşıyabiliriz
function VehicleListContent() {
  const [vehicles, setVehicles] = useState<TransformedVehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams(); // <--- 3. URL parametrelerini oku
  const searchQuery = searchParams.get('search'); // <--- 'search' parametresini al

  useEffect(() => {
    const fetchVehicles = async () => {
      setLoading(true);
      try {
        // <--- 4. Supabase sorgusu oluşturma
        let query = supabase.from("Araclar").select(`
          id,
          isim,
          aciklama,
          cover_image,
          variations ( fiyat, status ) 
        `); // Gerekli tüm alanları ve ilişkili varyasyonları seçin

        if (searchQuery) {
          // Arama terimi varsa, 'isim' ve 'aciklama' alanlarında arama yap
          // Görseldeki örnekte 'title' ve 'stok_kodu' kullanılmış.
          // Supabase tablonuzdaki doğru alan adlarını kullanmalısınız.
          // Örnek: query = query.or(`isim.ilike.%${searchQuery}%,aciklama.ilike.%${searchQuery}%`);
          // Veya sadece isimde arama:
          query = query.ilike("isim", `%${searchQuery}%`);
        }

        const { data, error } = await query;

        if (error) {
          console.error("❌ Supabase sorgu hatası:", error);
          setVehicles([]); // Hata durumunda araçları temizle
          return; // setLoading(false) finally bloğunda
        }

        if (!data) {
          setVehicles([]);
          return;
        }
        
        // Veri dönüştürme
        const transformed: TransformedVehicle[] = data.map((item: RawVehicleFromSupabase) => {
          // Gelen item.variations'ın bir dizi olduğundan ve doğru formatta olduğundan emin olun
          const variationsData = Array.isArray(item.variations) ? item.variations : [];
          const aktifler: Variation[] = variationsData.filter((v: any) => v.status === "Aktif") || [];

          const lowestPrice = aktifler.length > 0
            ? Math.min(...aktifler.map((v: any) => v.fiyat))
            : item.fiyat ?? 0; // item.fiyat fallback, eğer Supabase'den geliyorsa

          return {
            id: item.id,
            name: item.isim || "Araç İsmi Yok",
            image: `https://uxnpmdeizkzvnevpceiw.supabase.co/storage/v1/object/public/images/${item.cover_image?.replace(/^\/+/, "") || "placeholder.svg"}`,
            price: lowestPrice,
            rating: 4.5, // Bu değer dinamik olabilir
            features: [], // Bu değer dinamik olabilir
            variations: aktifler,
          };
        });

        setVehicles(transformed);
      } catch (err) {
        console.error("❌ Fetch/transform hatası:", err);
        setVehicles([]); // Hata durumunda araçları temizle
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, [searchQuery]); // <--- 5. searchQuery değiştiğinde useEffect'i tekrar çalıştır

  if (loading) {
    return <div className="text-center py-8">Araçlar Yükleniyor...</div>;
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
    // Suspense, useSearchParams hook'unun client tarafında çalışmasını beklerken
    // bir fallback UI göstermek için kullanılır. Next.js App Router'da bu iyi bir pratiktir.
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Araç Filomuz</h1>
      <Suspense fallback={<div className="text-center py-8">Yükleniyor...</div>}>
        <VehicleListContent />
      </Suspense>
    </div>
  );
}
