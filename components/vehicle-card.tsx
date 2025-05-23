// components/VehicleCard.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, Info, Fuel, Users, Settings2, Tag, Heart, Loader2, CheckCircle2 } from "lucide-react"; // İkonları güncelledik
import { useState } from "react";
import { toast } from "@/hooks/use-toast"; // toast importu korunuyor
import { supabase } from "@/lib/supabase-browser"; // supabase importu korunuyor

interface Variation {
  fiyat: number;
  status: string;
}

// Yeni tasarım için eksik olabilecek veya farklılaşacak propları ekliyoruz/güncelliyoruz
interface VehicleCardProps {
  vehicle: {
    id: string;
    name: string; // Citroen C-Elysee gibi
    make?: string; // Citroen (Opsiyonel, name'den ayrıştırılabilir veya ayrı prop)
    modelName?: string; // C-Elysee (Opsiyonel)
    image?: string;
    rating?: number; // Mevcut
    // features?: string[]; // Bu genel özellikler yerine daha spesifik olanları kullanacağız
    price?: number; // Varsayılan fiyat, enDusukFiyat için kullanılabilir
    variations?: Variation[]; // Mevcut

    // Yeni tasarım için eklenecek/güncellenecek proplar
    fuelType?: string; // Örn: "Dizel"
    transmission?: string; // Örn: "Manuel"
    capacity?: string; // Örn: "5 Kişilik" veya 5 (sayı)
    economicTag?: string; // Örn: "Ekonomik" (opsiyonel)
    depositPrice?: string; // Örn: "₺17.600"
    discountApplied?: string; // Örn: "₺1.539,74 İndirim Uygulandı" (opsiyonel)
    totalPriceLabel?: string; // Örn: "₺13.154,00 Toplam" (opsiyonel)
  };
}

export default function VehicleCard({ vehicle }: VehicleCardProps) {
  const [isAddingToGarage, setIsAddingToGarage] = useState(false); // Garaja ekleme için state'ler
  const [isAddedToGarage, setIsAddedToGarage] = useState(false);   // Eğer garaj işlevini farklı bir şekilde tutmak isterseniz

  const {
    id,
    name,
    make = name.split(" ")[0] || "Araç", // Basit bir ayrıştırma, daha iyisi prop olarak almak
    modelName = name.split(" ").slice(1).join(" ") || "Model",
    image,
    rating = 4.5,
    price = 0, // Bu, enDusukFiyat için bir temel olabilir
    variations = [],

    // Yeni proplar için varsayılan değerler veya prop'tan gelenler
    fuelType = "Belirtilmemiş", // Örnek veri
    transmission = "Belirtilmemiş", // Örnek veri
    capacity = "N/A", // Örnek veri
    economicTag, // Eğer gönderilmezse gösterilmez
    depositPrice = "Depozito Bilgisi Yok", // Örnek veri
    discountApplied, // Eğer gönderilmezse gösterilmez
    totalPriceLabel, // Eğer gönderilmezse gösterilmez
  } = vehicle;

  const aktifVaryasyonlar = variations.filter((v) => v.status === "Aktif");
  const enDusukFiyat = aktifVaryasyonlar.length
    ? Math.min(...aktifVaryasyonlar.map((v) => v.fiyat))
    : price;

  const imageUrl = image || "/placeholder.svg"; // Placeholder korunuyor

  // Not: handleAddToGarage fonksiyonu, "Garaja Ekle" butonu kaldırıldığı için
  // şimdilik kullanılmıyor. Eğer bu işlevi "Aracı Seç" butonuyla birleştirmek
  // veya farklı bir UI elemanıyla tetiklemek isterseniz, bu mantığı oraya taşıyabilirsiniz.
  // Örnek olması açısından fonksiyonu yorum satırı içinde bırakıyorum.
  /*
  const handleAddToGarage = async () => {
    setIsAddingToGarage(true);
    setIsAddedToGarage(false);
    // ... (mevcut garaja ekleme mantığınız) ...
    setIsAddingToGarage(false);
  };
  */

  return (
    <div className="flex flex-col rounded-lg border bg-white shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 group w-[320px]"> {/* Sabit genişlik veya responsive grid için */}
      {/* Kart Başlığı (Araç Adı ve Detay Linki) */}
      <div className="flex justify-between items-center px-4 pt-4 pb-2">
        <h3 className="text-base font-semibold text-gray-800">
          {make} <span className="font-normal">{modelName}</span>
        </h3>
        <Link
          href={`/araclar/${id}`} // Detaylar linki korunuyor
          className="text-xs font-medium text-[#6A3C96] hover:underline"
        >
          Detay
        </Link>
      </div>

      {/* Araç Resmi ve Ekonomik Etiketi */}
      <div className="relative w-full aspect-[16/10] bg-gray-50 overflow-hidden"> {/* Aspect ratio güncellendi */}
        <Image
          src={imageUrl}
          alt={name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105" // object-contain yerine object-cover
        />
        {economicTag && (
          <span className="absolute top-2.5 right-2.5 bg-gray-200 text-gray-700 px-2.5 py-1 text-[10px] font-semibold rounded-full">
            {economicTag}
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        {/* Özellikler (İkonlu) */}
        <div className="flex justify-start items-center gap-3 text-xs text-gray-600 mb-2.5">
          <span className="flex items-center">
            <Fuel className="w-3.5 h-3.5 mr-1 text-gray-500" />
            {fuelType}
          </span>
          <span className="flex items-center">
            <Settings2 className="w-3.5 h-3.5 mr-1 text-gray-500" /> {/* Vites için Settings2 veya başka bir ikon */}
            {transmission}
          </span>
          <span className="flex items-center">
            <Users className="w-3.5 h-3.5 mr-1 text-gray-500" />
            {capacity}
          </span>
        </div>

        {/* Depozito Bilgisi */}
        <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded mb-2.5 w-fit">
          Depozito: {depositPrice}
        </div>

        {/* İndirim Bandı (Opsiyonel) */}
        {discountApplied && (
          <div className="bg-[#E8DFF5] text-[#6A3C96] text-xs font-semibold px-3 py-1.5 rounded mb-3 flex items-center justify-center w-full">
            <Tag className="w-3.5 h-3.5 mr-1.5" />
            {discountApplied}
          </div>
        )}

        {/* Fiyat Bölümü */}
        <div className="mb-4 text-left">
          <div className="text-xl font-bold text-[#6A3C96]">
            {enDusukFiyat.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY', minimumFractionDigits: 0 })}
            <span className="text-xs font-normal text-gray-500 ml-1">/ Günlük</span>
          </div>
          {totalPriceLabel && (
            <div className="text-xs text-gray-500 mt-0.5">
              {totalPriceLabel}
            </div>
          )}
        </div>

        {/* Eylem Butonu */}
        <div className="mt-auto"> {/* Butonu en alta iter */}
          <Link
            href={`/araclar/${id}`} // "Aracı Seç" butonu da detay sayfasına yönlendirebilir veya farklı bir eylemi olabilir
            className="w-full text-center text-sm font-medium px-4 py-2.5 bg-[#6A3C96] text-white rounded-md hover:bg-[#58307d] transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#6A3C96] focus:ring-opacity-50 flex items-center justify-center"
          >
            {/* <Info className="w-4 h-4 mr-2 hidden sm:inline-block" /> // İkonu kaldırabiliriz veya farklı bir ikon */}
            Aracı Seç
          </Link>
        </div>
      </div>
    </div>
  );
}
