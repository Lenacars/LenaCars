"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, Heart, Info, Loader2, CheckCircle2 } from "lucide-react";
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
    name: string;
    image?: string;
    rating?: number;
    features?: string[];
    price?: number;
    variations?: Variation[];
  };
}

export default function VehicleCard({ vehicle }: VehicleCardProps) {
  const [isHovered, setIsHovered] = useState(false); // Bu state group-hover ile yönetildiği için kaldırılabilir veya farklı amaçlarla tutulabilir
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const {
    id,
    name,
    image,
    rating = 4.5,
    features = [],
    price = 0,
    variations = [],
  } = vehicle;

  const aktifVaryasyonlar = variations.filter((v) => v.status === "Aktif");
  const enDusukFiyat = aktifVaryasyonlar.length
    ? Math.min(...aktifVaryasyonlar.map((v) => v.fiyat))
    : price;

  const imageUrl = image || "/placeholder.svg";

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
    <div
      className="rounded-xl border bg-card text-card-foreground shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group flex flex-col" // DEĞİŞİKLİK: flex flex-col eklendi
      // onMouseEnter/Leave kaldırıldı, group-hover kullanılıyor
    >
      <div className="relative w-full aspect-[4/3] bg-gray-50 overflow-hidden">
        <Image
          src={imageUrl}
          alt={name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-contain transition-transform duration-300 ease-in-out group-hover:scale-105"
        />
      </div>

      {/* DEĞİŞİKLİK: Bu div'e flex flex-col flex-1 eklendi */}
      <div className="p-5 flex flex-col flex-1">
        {/* Bu sarmalayıcı div, butonlar hariç tüm içeriği kapsar ve butonların yukarı ittirilmesini engeller */}
        <div>
          <div className="flex justify-between items-start mb-2.5">
            <h3 className="text-lg font-semibold text-gray-800 group-hover:text-[#5d3b8b] transition-colors duration-200">{name}</h3>
            <div className="flex items-center text-sm bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
              {rating.toFixed(1)}
            </div>
          </div>

          {/* Özellikler için sabit bir yükseklik veya min-yükseklik vermek, hizalamaya yardımcı olabilir ama esnekliği azaltır.
              Şimdilik dinamik bırakıyoruz, flex-grow bunu yönetmeli.
              Eğer özellik sayısı çok değişken ise ve bu sorun yaratıyorsa,
              özellikler alanı için bir `min-h-[X]` veya `h-[X]` ile `overflow-y-auto` düşünülebilir.
              Ya da JS ile en uzun özellik alanının yüksekliği bulunup diğerleri eşitlenebilir (daha karmaşık).
          */}
          {features.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4 text-xs"> {/* min-h-[X] kaldırıldı, flex-grow'a güveniyoruz */}
              {features.slice(0, 3).map((feature, i) => (
                <span key={i} className="px-2.5 py-1 bg-purple-50 text-[#5d3b8b] rounded-full font-medium">
                  {feature}
                </span>
              ))}
              {features.length > 3 && (
                <span className="px-2.5 py-1 bg-gray-100 text-gray-500 rounded-full font-medium">
                  +{features.length - 3}
                </span>
              )}
            </div>
          )}

          <div className="text-2xl font-bold text-[#5d3b8b] mb-5">
            {enDusukFiyat.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY', minimumFractionDigits: 0 })}
            <span className="text-sm font-normal text-gray-500 ml-1">/ aylık</span>
          </div>
        </div> {/* Butonlar hariç içeriğin sonu */}

        {/* DEĞİŞİKLİK: Bu div'e mt-auto eklendi */}
        <div className="flex flex-col sm:flex-row justify-between gap-3 mt-auto">
          <Link
            href={`/araclar/${id}`}
            className="flex-1 text-center text-sm px-5 py-2.5 bg-[#5d3b8b] text-white rounded-lg hover:bg-[#4a2e70] transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#5d3b8b] focus:ring-opacity-50 font-medium flex items-center justify-center"
          >
            <Info className="w-4 h-4 mr-2 hidden sm:inline-block" />
            Detaylar
          </Link>
          <button
            onClick={handleAddToGarage}
            disabled={isAdding || isAdded}
            className={`flex-1 text-center text-sm px-5 py-2.5 border rounded-lg transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-opacity-50 font-medium flex items-center justify-center min-h-[42px] ${ // min-h-[42px] veya benzeri bir değer buton yüksekliğini eşitleyebilir
              isAdded
                ? "bg-green-500 text-white border-green-500 cursor-default"
                : isAdding
                ? "bg-gray-100 text-gray-500 border-gray-300 cursor-wait"
                : "border-gray-300 text-gray-700 hover:border-[#5d3b8b] hover:text-[#5d3b8b] focus:border-[#5d3b8b] focus:text-[#5d3b8b] focus:ring-[#5d3b8b]"
            }`}
          >
            {isAdded ? (
              <>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Garajda
              </>
            ) : isAdding ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Ekleniyor...
              </>
            ) : (
              <>
                <Heart className="w-4 h-4 mr-2 hidden sm:inline-block" />
                Garaja Ekle
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
