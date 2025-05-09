"use client";

import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
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
    variations?: Variation[]; // 🔑 Varyasyonlar buradan alınacak
  };
}

export default function VehicleCard({ vehicle }: VehicleCardProps) {
  const [isHovered, setIsHovered] = useState(false);

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
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user?.id;

    if (userId) {
      const { data: existing } = await supabase
        .from("garaj")
        .select("id")
        .eq("user_id", userId)
        .eq("arac_id", id)
        .maybeSingle();

      if (existing) {
        toast({ title: "Zaten eklenmiş", description: "Bu araç zaten garajınızda." });
        return;
      }

      await supabase.from("garaj").insert([{ user_id: userId, arac_id: id }]);
      toast({ title: "Garaja Eklendi", description: `${name} başarıyla garajınıza eklendi.` });
    } else {
      let stored: string[] = [];
      try {
        stored = JSON.parse(localStorage.getItem("guest_garaj") || "[]");
      } catch {
        stored = [];
      }

      if (stored.includes(id)) {
        toast({ title: "Zaten eklenmiş", description: "Bu araç zaten garajınızda." });
        return;
      }

      stored.push(id);
      localStorage.setItem("guest_garaj", JSON.stringify(stored));
      toast({ title: "Garaja Eklendi", description: `${name} başarıyla garajınıza eklendi.` });
    }
  };

  return (
    <div
      className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden transition-all duration-300 hover:shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative w-full aspect-[4/3] bg-white">
        <Image
          src={imageUrl}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-contain transition-transform duration-300"
          style={{ transform: isHovered ? "scale(1.05)" : "scale(1)" }}
        />
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold">{name}</h3>
          <div className="flex items-center text-sm">
            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
            {rating}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4 text-xs text-muted-foreground">
          {features.map((feature, i) => (
            <span key={i} className="px-2 py-1 bg-gray-100 rounded">
              {feature}
            </span>
          ))}
        </div>

        <div className="text-xl font-bold text-[#5d3b8b] mb-4">
          {enDusukFiyat.toLocaleString()} ₺{" "}
          <span className="text-sm font-normal text-gray-500">/ aylık</span>
        </div>

        <div className="flex justify-between gap-2">
          <Link
            href={`/vehicles/${id}`}
            className="text-sm px-4 py-2 bg-[#5d3b8b] text-white rounded hover:bg-[#4a2e70]"
          >
            Detaylar
          </Link>
          <button
            onClick={handleAddToGarage}
            className="text-sm px-4 py-2 border rounded"
          >
            Garaja Ekle
          </button>
        </div>
      </div>
    </div>
  );
}
