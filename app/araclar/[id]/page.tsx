// app/araclar/[id]/page.tsx (MİNİMAL TEST KODU)
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-browser";
import Image from "next/image";
import Link from "next/link";
import { Loader2 } from "lucide-react"; // Sadece Loader2 ikonu kullanıldı

// Sadece temel Vehicle interface'i
interface Vehicle {
  id: string;
  isim: string;
  cover_image: string;
  brand?: string; 
}

interface Props {
  params: { id: string };
}

export default function Page({ params }: Props) {
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchMinimalVehicleData = async () => {
      setIsLoading(true);
      if (!params.id) {
        console.error("Minimal Test: Araç ID'si bulunamadı.");
        setVehicle(null);
        setIsLoading(false);
        return;
      }
      try {
        // Sadece birkaç temel alan çekiliyor
        const { data: aracData, error } = await supabase
          .from("Araclar")
          .select("id, isim, cover_image, brand") 
          .eq("id", params.id)
          .maybeSingle();

        if (error) {
          console.error("Minimal Test: Supabase hata:", error);
          throw error; // Hata fırlatılıyor ki catch bloğu yakalasın
        }
        
        if (aracData) {
            setVehicle(aracData as Vehicle);
        } else {
            setVehicle(null);
            console.log("Minimal Test: Araç bulunamadı (ID:", params.id, ")");
        }

      } catch (error) {
        console.error("Minimal Test: Araç verisi çekilirken genel hata:", error);
        setVehicle(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMinimalVehicleData();
  }, [params.id]); // params.id değiştiğinde tekrar veri çek

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-xl bg-gray-100">
        <Loader2 className="mr-2 h-8 w-8 animate-spin text-purple-600" /> 
        <span className="text-gray-700">Minimal Test Yükleniyor...</span>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-xl p-6 text-center bg-gray-100">
        <p className="text-red-600 font-semibold">Araç Bilgisi Bulunamadı.</p>
        <p className="text-sm text-gray-500 mt-2">Lütfen araç ID'sini kontrol edin veya daha sonra tekrar deneyin.</p>
        <Link href="/araclar" className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors">
            Araç Listesine Dön
        </Link>
      </div>
    );
  }

  // ----- ANA RETURN BAŞLANGICI (Hata alınan satır burasıydı) -----
  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <nav className="mb-4 text-sm">
          <Link href="/" className="text-purple-600 hover:underline">Ana Sayfa</Link>
          <span className="mx-1.5 text-gray-400">/</span>
          <Link href="/araclar" className="text-purple-600 hover:underline">Araçlar</Link>
          <span className="mx-1.5 text-gray-400">/</span>
          <span className="text-gray-600">{vehicle.brand || "Marka"} - {vehicle.isim}</span>
        </nav>
        
        <h1 className="text-3xl font-bold text-gray-800 mb-4">{vehicle.isim}</h1>
        
        {vehicle.cover_image && (
          <div className="mt-4 mb-6 relative w-full aspect-video bg-gray-100 rounded overflow-hidden">
            <Image
              src={`https://uxnpmdeizkzvnevpceiw.supabase.co/storage/v1/object/public/images/${vehicle.cover_image.replace(/^\/+/, "")}`}
              alt={vehicle.isim || "Araç görseli"}
              layout="fill"
              objectFit="contain"
              className="p-2"
            />
          </div>
        )}
        
        <p className="text-gray-700">
          Bu, sözdizimi hatasını ayıklamak için kullanılan minimal bir test sayfasıdır.
        </p>
        <p className="mt-2 text-sm text-gray-500">
          Eğer bu sayfa Vercel'de başarılı bir şekilde build oluyorsa, sorun daha önce kaldırdığımız karmaşık JavaScript mantığındadır.
        </p>
      </div>
    </div>
  );
}
