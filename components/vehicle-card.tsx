// components/VehicleCard.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, Fuel, Settings2, Info, Car, Loader2, CheckCircle2 } from "lucide-react"; // Heart yerine Car eklendi
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
    price?: number;
    variations?: Variation[];
    make?: string;
    year?: string;
    fuelType?: string;
    transmission?: string;
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
    year = vehicle.name.includes(" - ") ? vehicle.name.split(" - ").pop()?.trim() : "",
    fuelType = "N/A",
    transmission = "N/A",
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

  const vehicleDisplayName = year ? name.substring(0, name.lastIndexOf(` - ${year}`)) : name;

  return (
    <div className="group flex flex-col w-full max-w-sm rounded-lg border border-gray-300 bg-white shadow-sm transition-all duration-300 hover:shadow-md overflow-hidden">
      {/* ÜST BİLGİ: Marka, Yakıt, Vites - MOR ARKA PLAN, BEYAZ YAZI */}
      <div className="flex justify-between items-center px-3 py-1.5 bg-[#6A3C96] text-xs text-white border-b border-[#58307d]">
        <span className="font-semibold truncate pr-2">{make}</span>
        <div className="flex items-center gap-x-2 shrink-0">
          <span className="flex items-center">
            <Fuel size={13} className="mr-0.5 text-white opacity-90" />
            {fuelType}
          </span>
          <span className="flex items-center">
            <Settings2 size={13} className="mr-0.5 text-white opacity-90" />
            {transmission}
          </span>
        </div>
      </div>

      {/* Araç Resmi */}
      <div className="relative w-full aspect-[4/3] bg-white overflow-hidden">
        <Image
          src={imageUrl}
          alt={name}
          fill
          sizes="(max-width: 640px) 90vw, (max-width: 768px) 45vw, (max-width: 1024px) 30vw, 25vw"
          className="object-contain p-2 transition-transform duration-300 ease-in-out group-hover:scale-105"
        />
      </div>

      {/* Kart Ana İçeriği (Butonlar Hariç) */}
      <div className="p-3 flex flex-col flex-1">
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
          <span className="text-[0.7rem] font-normal text-gray-500 ml-1"> + KDV / Ay</span>
        </div>
        
        <div className="mt-auto"></div> {/* Bu div butonları aşağı iter */}
      </div>

      {/* BUTON ALANI - MOR ARKA PLAN */}
      <div className="bg-[#6A3C96] p-3">
        <div className="flex flex-col sm:flex-row gap-2">
          <Link
            href={`/araclar/${id}`}
            className="flex-1 text-center text-xs font-medium px-3 py-2 bg-white text-[#6A3C96] rounded-md hover:bg-gray-100 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-75 flex items-center justify-center"
          >
            <Info size={15} className="mr-1 sm:mr-1.5" />
            Detaylar
          </Link>
          <button
            onClick={handleAddToGarage}
            disabled={isAdding || isAdded}
            className={`flex-1 text-center text-xs font-medium px-3 py-2 border rounded-md transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-opacity-75 flex items-center justify-center min-h-[36px] ${
              isAdded
                ? "bg-green-500 text-white border-green-500 hover:bg-green-600 cursor-default"
                : isAdding
                ? "bg-white/30 text-white/70 border-white/50 cursor-wait"
                : "border-white text-white hover:bg-white hover:text-[#6A3C96] focus:ring-white"
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
                <Car size={15} className="mr-1 sm:mr-1.5" /> {/* KALP YERİNE ARABA İKONU */}
                Garaja Ekle
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
