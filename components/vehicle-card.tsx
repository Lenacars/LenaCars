// components/VehicleCard.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, Fuel, Settings2, Info, Heart, Loader2, CheckCircle2 } from "lucide-react"; // Gerekli ikonlar
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase-browser";

interface Variation {
  fiyat: number;
  status: string;
}

interface VehicleCardProps {
  vehicle: {
    id: string;
    name: string; // Örn: "Fiat Egea Sedan 1.3 Multijet Easy Plus 95BG - 2022"
    make?: string; // Örn: "Fiat" (name'den türetilebilir veya ayrı prop)
    year?: string; // Örn: "2022" (name'den türetilebilir veya ayrı prop)
    image?: string;
    rating?: number;
    price?: number; // Aylık fiyat için temel
    variations?: Variation[];
    fuelType?: string; // İstenen: "Dizel", "Benzin"
    transmission?: string; // İstenen: "Manuel", "Otomatik"
    // Yeni proplar için vehicle objesine eklenebilir.
  };
}

export default function VehicleCard({ vehicle }: VehicleCardProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const {
    id,
    name,
    image,
    rating = 0,
    price = 0,
    variations = [],
    make = vehicle.name.split(" ")[0] || "Marka",
    // Yılı name'den almak için daha güvenli bir yol veya ayrı bir prop daha iyi olur.
    // Örnek: "Fiat Egea Sedan 1.3 Multijet Easy Plus 95BG - 2022" formatı varsayılıyor.
    year = vehicle.name.includes(" - ") ? vehicle.name.split(" - ").pop() : "",
    fuelType = "N/A",
    transmission = "N/A",
  } = vehicle;

  const aktifVaryasyonlar = variations.filter((v) => v.status === "Aktif");
  const enDusukFiyat = aktifVaryasyonlar.length
    ? Math.min(...aktifVaryasyonlar.map((v) => v.fiyat))
    : price;

  const imageUrl = image || "/placeholder.svg"; // Sizin placeholder'ınız

  const handleAddToGarage = async () => {
    setIsAdding(true);
    setIsAdded(false);

    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user?.id;

    try {
      if (userId) {
        const { data: existing } = await supabase
          .from("garaj")
          .select("id")
          .eq("user_id", userId)
          .eq("arac_id", id)
          .maybeSingle();

        if (existing) {
          toast({ title: "Zaten Garajda", description: "Bu araç zaten garajınızda." });
          setIsAdded(true);
          setIsAdding(false);
          return;
        }

        await supabase.from("garaj").insert([{ user_id: userId, arac_id: id }]);
        toast({ title: "Garaja Eklendi", description: `${name} başarıyla garajınıza eklendi.` });
        setIsAdded(true);
      } else {
        // Kullanıcı giriş yapmamışsa localStorage kullanılıyor (mevcut mantığınız)
        let stored: string[] = [];
        try {
          stored = JSON.parse(localStorage.getItem("guest_garaj") || "[]");
        } catch {
          stored = [];
        }

        if (stored.includes(id)) {
          toast({ title: "Zaten Garajda", description: "Bu araç zaten garajınızda." });
          setIsAdded(true);
          setIsAdding(false);
          return;
        }

        stored.push(id);
        localStorage.setItem("guest_garaj", JSON.stringify(stored));
        toast({ title: "Garaja Eklendi", description: `${name} başarıyla garajınıza eklendi.` });
        setIsAdded(true);
      }
    } catch (error) {
      toast({ title: "Hata", description: "Araç eklenirken bir sorun oluştu.", variant: "destructive" });
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="group flex flex-col w-full max-w-xs rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md overflow-hidden">
      {/* ÜST BİLGİ: Marka, Yakıt, Vites */}
      <div className="flex justify-between items-center px-3 py-2 bg-gray-50 border-b border-gray-200 text-xs text-gray-600">
        <span className="font-semibold text-gray-700">{make}</span>
        <div className="flex items-center gap-2">
          <span className="flex items-center">
            <Fuel size={14} className="mr-1 text-gray-500" />
            {fuelType}
          </span>
          <span className="flex items-center">
            <Settings2 size={14} className="mr-1 text-gray-500" />
            {transmission}
          </span>
        </div>
      </div>

      {/* Araç Resmi */}
      <div className="relative w-full aspect-[4/3] bg-gray-100 overflow-hidden">
        <Image
          src={imageUrl}
          alt={name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-contain transition-transform duration-300 ease-in-out group-hover:scale-105" // object-contain daha uygun olabilir
        />
      </div>

      {/* Kart İçeriği */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-sm font-semibold text-gray-800 leading-tight pr-2">
            {/* Yıl bilgisini name'den ayırıp daha belirgin göstermek isteyebilirsiniz */}
            {name.replace(` - ${year}`, "")} {year && <span className="text-xs text-gray-500 font-normal block sm:inline sm:ml-1">{`- ${year}`}</span>}
          </h3>
          {rating > 0 && (
            <div className="flex items-center text-xs bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded-full shrink-0">
              <Star size={12} className="text-yellow-500 fill-yellow-500 mr-1" />
              {rating.toFixed(1)}
            </div>
          )}
        </div>

        <div className="text-lg font-bold text-[#6A3C96] mb-3">
          {enDusukFiyat.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY', minimumFractionDigits: 0 })}
          <span className="text-xs font-normal text-gray-500 ml-1">/aylık + KDV</span>
        </div>

        {/* Butonlar */}
        <div className="flex flex-col sm:flex-row gap-2 mt-auto">
          <Link
            href={`/araclar/${id}`}
            className="flex-1 text-center text-xs sm:text-sm px-4 py-2 bg-[#6A3C96] text-white rounded-md hover:bg-[#58307d] transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#6A3C96] focus:ring-opacity-50 font-medium flex items-center justify-center"
          >
            <Info size={16} className="mr-1.5 hidden sm:inline-block" />
            Detaylar
          </Link>
          <button
            onClick={handleAddToGarage}
            disabled={isAdding || isAdded}
            className={`flex-1 text-center text-xs sm:text-sm px-4 py-2 border rounded-md transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-opacity-50 font-medium flex items-center justify-center min-h-[38px] ${
              isAdded
                ? "bg-green-500 text-white border-green-500 cursor-default"
                : isAdding
                ? "bg-gray-100 text-gray-400 border-gray-300 cursor-wait"
                : "border-gray-300 text-gray-700 hover:border-[#6A3C96] hover:text-[#6A3C96] focus:border-[#6A3C96] focus:text-[#6A3C96] focus:ring-[#6A3C96]"
            }`}
          >
            {isAdded ? (
              <>
                <CheckCircle2 size={16} className="mr-1.5" />
                Garajda
              </>
            ) : isAdding ? (
              <>
                <Loader2 size={16} className="mr-1.5 animate-spin" />
                Ekleniyor
              </>
            ) : (
              <>
                <Heart size={16} className="mr-1.5 hidden sm:inline-block" />
                Garaja Ekle
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
