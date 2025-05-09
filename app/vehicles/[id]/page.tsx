"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-browser";
import Image from "next/image";
import { toast } from "@/hooks/use-toast";

interface Props {
  params: { id: string };
}

interface Variation {
  arac_id: string; // arac_id burada da tanımlı olmalı
  kilometre: string;
  sure: string;
  fiyat: number;
  status: string;
}

interface Vehicle { // Vehicle interface eklendi veya güncellendi
  id: string;
  isim: string;
  aciklama: string;
  kisa_aciklama: string;
  stok_kodu: string;
  segment: string;
  yakit_turu: string;
  vites: string;
  durum: string;
  brand: string;
  category: string;
  bodyType: string;
  fiyat: number;
  cover_image: string;
  gallery_images: string[];
  variations: Variation[]; // variations alanı eklendi
}


export default function Page({ params }: Props) {
  const [vehicle, setVehicle] = useState<Vehicle | null>(null); // Tipi Vehicle olarak güncellendi
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const [selectedKm, setSelectedKm] = useState("");
  const [selectedSure, setSelectedSure] = useState("");
  const [matchedPrice, setMatchedPrice] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("Araclar")
        .select("*, variations:variations(arac_id, kilometre, sure, fiyat, status)") // Değişiklik burada yapıldı
        .eq("id", params.id)
        .maybeSingle();

      if (error) {
        console.error("❌ Araç verisi çekme hatası:", error);
        setVehicle(null); // Hata durumunda aracı null yap
        return;
      }
      if (!data) {
         setVehicle(null); // Veri gelmezse aracı null yap
         return;
      }
      setVehicle(data);

      const initialImage = data.cover_image
        ? `https://uxnpmdeizkzvnevpceiw.supabase.co/storage/v1/object/public/images/${data.cover_image}`
        : "/placeholder.svg";
      setSelectedImage(initialImage);

      // Varyasyonlar yüklendiğinde ilk kilometre ve süreyi seçebiliriz
      if (data.variations && data.variations.length > 0) {
        const uniqueKms = [...new Set(data.variations.map(v => v.kilometre))];
        const uniqueSures = [...new Set(data.variations.map(v => v.sure))];
        if (uniqueKms.length > 0) setSelectedKm(uniqueKms[0]);
        if (uniqueSures.length > 0) setSelectedSure(uniqueSures[0]);
      }


    };

    fetchData();
  }, [params.id]); // vehicle dependency kaldırıldı, sadece params.id yeterli

  useEffect(() => {
    if (!vehicle || !selectedKm || !selectedSure) { // selectedKm ve selectedSure boşsa eşleştirme yapma
        setMatchedPrice(null);
        return;
    }
    const match = vehicle.variations?.find( // vehicle artık null olamayacağı için ?. kaldırıldı
      (v: any) => v.kilometre === selectedKm && v.sure === selectedSure
    );
    setMatchedPrice(match?.fiyat || null);
  }, [selectedKm, selectedSure, vehicle]);

  if (!vehicle) {
    // Yükleniyor veya araç bulunamadı durumları için daha belirgin bir mesaj
    return <div className="p-10 text-center text-gray-600">Araç bilgileri yükleniyor veya bulunamadı...</div>;
  }

  const gallery: string[] = vehicle.gallery_images || [];

  const handleAddToGarage = async () => {
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) console.error("❌ Session alma hatası:", sessionError);

    const userId = sessionData.session?.user?.id;
    if (userId) {
      const { data: existing } = await supabase
        .from("garaj")
        .select("id")
        .eq("user_id", userId)
        .eq("arac_id", vehicle.id)
        .maybeSingle();

      if (existing) {
        toast({
          title: "Zaten eklenmiş",
          description: "Bu araç zaten garajınızda.",
        });
        return;
      }

      const { error: insertError } = await supabase
        .from("garaj")
        .insert([{ user_id: userId, arac_id: vehicle.id }]);

      if (insertError) {
        toast({ title: "Hata", description: "Araç garaja eklenemedi.", variant: "destructive" });
      } else {
        toast({
          title: "Garaja Eklendi",
          description: `${vehicle.isim} başarıyla garajınıza eklendi.`,
        });
      }
    } else {
      let stored: string[] = [];
      try {
        stored = JSON.parse(localStorage.getItem("guest_garaj") || "[]");
      } catch {
        stored = [];
      }
      if (!stored.includes(vehicle.id)) {
        stored.push(vehicle.id);
        localStorage.setItem("guest_garaj", JSON.stringify(stored));
        toast({
          title: "Garaja Eklendi",
          description: `${vehicle.isim} başarıyla garajınıza eklendi.`,
        });
      } else { // Misafir kullanıcının garajında zaten varsa
         toast({
           title: "Zaten eklenmiş",
           description: "Bu araç zaten garajınızda.",
         });
       }
    }
  };

  // Kilometre ve Süre seçeneklerini alırken SADECE aktif varyasyonları göstermek için filtreleme yapalım
   const activeVariations = vehicle.variations?.filter(v => v.status === 'Aktif') || [];
   const availableKms = [...new Set(activeVariations.map(v => v.kilometre))];
   const availableSures = [...new Set(activeVariations.map(v => v.sure))];


  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div className="relative w-full h-[400px] rounded overflow-hidden border bg-white">
            <Image
              src={selectedImage || "/placeholder.svg"}
              alt="Kapak Görseli"
              fill
              className="object-contain p-4"
            />
          </div>

          <div className="grid grid-cols-4 gap-2 mt-4">
            {[vehicle.cover_image, ...gallery].map((img, idx) => (
              <button
                key={idx}
                onClick={() =>
                  setSelectedImage(
                    `https://uxnpmdeizkzvnevpceiw.supabase.co/storage/v1/object/public/images/${img}`
                  )
                }
                className="relative w-full aspect-square rounded overflow-hidden border hover:ring-2 ring-[#5d3b8b]"
              >
                <Image
                  src={`https://uxnpmdeizkzvnevpceiw.supabase.co/storage/v1/object/public/images/${img}`}
                  alt={`Galeri ${idx + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-2">{vehicle.isim}</h1>

          <div className="text-[#5d3b8b] text-2xl font-semibold mb-2">
            {/* Başlangıç fiyatı yerine varyasyon seçildiğinde fiyat gösterimi */}
            {selectedKm && selectedSure && matchedPrice !== null ? (
                `${matchedPrice.toLocaleString()} ₺ / Aylık`
            ) : (
                vehicle.fiyat ? `${vehicle.fiyat.toLocaleString()} ₺ / Aylık (Başlangıç)` : "Fiyat bilgisi yok"
            )}
          </div>

          {vehicle.kisa_aciklama && (
            <div className="text-sm text-gray-700 mb-4">{vehicle.kisa_aciklama}</div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Kilometre Limiti</label>
            <select
              className="w-full border rounded px-3 py-2"
              value={selectedKm}
              onChange={(e) => setSelectedKm(e.target.value)}
            >
              <option value="">Seçiniz</option>
              {availableKms.map((km, i) => ( // Aktif varyasyonların kilometreleri
                <option key={i} value={km}>{km}</option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Süre</label>
            <select
              className="w-full border rounded px-3 py-2"
              value={selectedSure}
              onChange={(e) => setSelectedSure(e.target.value)}
            >
              <option value="">Seçiniz</option>
              {availableSures.map((sure, i) => ( // Aktif varyasyonların süreleri
                <option key={i} value={sure}>{sure}</option>
              ))}
            </select>
          </div>

          {selectedKm && selectedSure && matchedPrice !== null && (
            <div className="text-[#5d3b8b] text-xl font-medium mb-4">
              Seçilen Paket Fiyatı: <strong>{matchedPrice.toLocaleString()} ₺ / Aylık</strong> {/* Metin güncellendi */}
            </div>
          )}

          <button
            onClick={handleAddToGarage}
            className="w-full bg-[#5d3b8b] hover:bg-[#432b6e] text-white font-semibold py-3 rounded transition"
          >
            Garaja Ekle
          </button>

          <div className="mt-6 grid grid-cols-2 gap-4 text-sm text-gray-600">
            <div><strong>Marka:</strong> {vehicle.brand}</div>
            <div><strong>Segment:</strong> {vehicle.segment}</div>
            <div><strong>Yakıt Türü:</strong> {vehicle.yakit_turu}</div>
            <div><strong>Vites:</strong> {vehicle.vites}</div>
            <div><strong>Gövde Tipi:</strong> {vehicle.bodyType}</div>
            <div><strong>Durum:</strong> {vehicle.durum}</div>
          </div>
        </div>
      </div>

      {vehicle.aciklama && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4 border-b pb-2">Araç Açıklaması</h2>
          <div
            className="text-gray-800 prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: vehicle.aciklama }}
          />
        </div>
      )}
    </div>
  );
}
