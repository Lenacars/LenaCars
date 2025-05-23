// components/VehicleCard.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, Fuel, Settings2, Info, Heart, Loader2, CheckCircle2 } from "lucide-react";
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
    image?: string;
    rating?: number;
    price?: number; // Aylık fiyat için temel
    variations?: Variation[];
    // Yeni ve güncellenmiş proplar
    make?: string; // Örn: "Fiat" (name'den türetilebilir veya ayrı prop)
    year?: string; // Örn: "2022" (name'den türetilebilir veya ayrı prop)
    fuelType?: string; // İstenen: "Dizel", "Benzin"
    transmission?: string; // İstenen: "Manuel", "Otomatik"
    // features?: string[]; // Bu tasarımda genel 'features' dizisi yerine spesifik bilgiler kullanılıyor.
                          // Eğer yine de ihtiyaç varsa ekleyebilirsiniz.
  };
}

export default function VehicleCard({ vehicle }: VehicleCardProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const {
    id,
    name,
    image,
    rating = 0, // Varsayılan 0, veri varsa gösterilir
    price = 0,
    variations = [],
    // Varsayılan değerler veya name'den türetme (en iyisi ayrı prop olarak almak)
    make = vehicle.name.split(" ")[0] || "Marka",
    // Yılı name'den almak için daha güvenli bir yol veya ayrı bir prop daha iyi olur.
    // Örnek: "Fiat Egea Sedan 1.3 Multijet Easy Plus 95BG - 2022" formatı varsayılıyor.
    year = vehicle.name.includes(" - ") ? vehicle.name.split(" - ").pop()?.trim() : "",
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

  // Yıl olmadan sadece araç adını almak için (name prop'u "Model Adı - YYYY" formatında varsayıldı)
  const vehicleDisplayName = year ? name.substring(0, name.lastIndexOf(` - ${year}`)) : name;


  return (
    <div className="group flex flex-col w-full max-w-sm rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md overflow-hidden">
      {/* ÜST BİLGİ: Marka, Yakıt, Vites */}
      <div className="flex justify-between items-center px-3 py-1.5 bg-gray-50 border-b border-gray-200 text-xs text-gray-600">
        <span className="font-semibold text-gray-700 truncate pr-2">{make}</span>
        <div className="flex items-center gap-x-2 shrink-0">
          <span className="flex items-center">
            <Fuel size={13} className="mr-0.5 text-gray-500" />
            {fuelType}
          </span>
          <span className="flex items-center">
            <Settings2 size={13} className="mr-0.5 text-gray-500" />
            {transmission}
          </span>
        </div>
      </div>

      {/* Araç Resmi */}
      <div className="relative w-full aspect-[4/3] bg-white overflow-hidden"> {/* Arka planı beyaz yaptım, placeholder için bg-gray-50 olabilir */}
        <Image
          src={imageUrl}
          alt={name}
          fill
          sizes="(max-width: 640px) 90vw, (max-width: 768px) 45vw, (max-width: 1024px) 30vw, 25vw" // Yeni kart genişliğine göre güncellendi
          className="object-contain p-2 transition-transform duration-300 ease-in-out group-hover:scale-105"
        />
      </div>

      {/* Kart İçeriği */}
      <div className="p-3 flex flex-col flex-1"> {/* Padding'i biraz azalttım, p-4 de olabilir */}
        <div className="flex justify-between items-start mb-1.5">
          <h3 className="text-[0.9rem] font-semibold text-gray-700 leading-tight pr-2 group-hover:text-[#6A3C96]">
            {vehicleDisplayName}
            {year && <span className="text-[0.7rem] text-gray-500 font-normal block">{`- ${year}`}</span>}
          </h3>
          {rating > 0 && (
            <div className="flex items-center text-xs bg-yellow-100 text-yellow-600 px-1.5 py-0.5 rounded-full shrink-0 ml-1">
              <Star size={13} className="text-yellow-500 fill-yellow-500 mr-0.5" />
              {rating.toFixed(1)}
            </div>
          )}
        </div>

        <div className="text-lg font-bold text-[#6A3C96] mb-2.5">
          {enDusukFiyat.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY', minimumFractionDigits: 0 })}
          <span className="text-[0.7rem] font-normal text-gray-500 ml-1">/aylık + KDV</span>
        </div>

        {/* Butonlar */}
        <div className="flex flex-col sm:flex-row gap-2 mt-auto">
          <Link
            href={`/araclar/${id}`}
            className="flex-1 text-center text-xs font-medium px-3 py-2 bg-[#6A3C96] text-white rounded-md hover:bg-[#58307d] transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#6A3C96] focus:ring-opacity-50 flex items-center justify-center"
          >
            <Info size={15} className="mr-1 sm:mr-1.5" />
            Detaylar
          </Link>
          <button
            onClick={handleAddToGarage}
            disabled={isAdding || isAdded}
            className={`flex-1 text-center text-xs font-medium px-3 py-2 border rounded-md transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-opacity-50 flex items-center justify-center min-h-[36px] ${ // Buton yüksekliklerini eşitlemek için min-h
              isAdded
                ? "bg-green-500 text-white border-green-500 hover:bg-green-600 cursor-default"
                : isAdding
                ? "bg-gray-100 text-gray-400 border-gray-300 cursor-wait"
                : "border-gray-300 text-gray-700 hover:border-[#6A3C96] hover:text-[#6A3C96] focus:border-[#6A3C96] focus:text-[#6A3C96] focus:ring-[#6A3C96]"
            }`}
          >
            {isAdded ? (
              <>
                <CheckCircle2 size={15} className="mr-1 sm:mr-1.5" />
                Garajda
              </>
            ) : isAdding ? (
              <>
                <Loader2 size={15} className="mr-1 sm:mr-1.5 animate-spin" />
                Ekleniyor
              </>
            ) : (
              <>
                <Heart size={15} className="mr-1 sm:mr-1.5" />
                Garaja Ekle
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
