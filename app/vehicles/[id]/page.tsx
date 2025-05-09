"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-browser";
import Image from "next/image";
import { toast } from "@/hooks/use-toast";

interface Props {
  params: { id: string };
}

interface Variation {
  arac_id: string;
  kilometre: string;
  sure: string;
  fiyat: number;
  status: string;
}

interface Vehicle {
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
}

export default function Page({ params }: Props) {
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [variations, setVariations] = useState<Variation[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedKm, setSelectedKm] = useState("");
  const [selectedSure, setSelectedSure] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const { data: arac, error } = await supabase
        .from("Araclar")
        .select("*")
        .eq("id", params.id)
        .maybeSingle();

      const { data: varData } = await supabase
        .from("variations")
        .select("*")
        .eq("arac_id", params.id);

      if (error || !arac) return;

      setVehicle(arac);
      setVariations(varData || []);

      const image = arac.cover_image
        ? `https://uxnpmdeizkzvnevpceiw.supabase.co/storage/v1/object/public/images/${arac.cover_image}`
        : "/placeholder.svg";
      setSelectedImage(image);
    };

    fetchData();
  }, [params.id]);

  const activeVariations = variations.filter(v => v.status === "Aktif");
  const availableKms = [...new Set(activeVariations.map(v => v.kilometre))];
  const availableSures = [...new Set(activeVariations.map(v => v.sure))];

  const matched = activeVariations.find(
    (v) => v.kilometre === selectedKm && v.sure === selectedSure
  );
  const lowest = activeVariations.reduce((min, v) =>
    v.fiyat < min ? v.fiyat : min, activeVariations[0]?.fiyat || 0);

  const displayPrice = matched?.fiyat ?? lowest ?? vehicle?.fiyat ?? null;

  const handleAddToGarage = async () => {
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user?.id;

    if (userId) {
      const { data: existing } = await supabase
        .from("garaj")
        .select("id")
        .eq("user_id", userId)
        .eq("arac_id", vehicle?.id)
        .maybeSingle();

      if (existing) {
        toast({ title: "Zaten eklenmiş", description: "Bu araç zaten garajınızda." });
        return;
      }

      await supabase.from("garaj").insert([{ user_id: userId, arac_id: vehicle?.id }]);
      toast({ title: "Garaja Eklendi", description: `${vehicle?.isim} başarıyla garajınıza eklendi.` });
    } else {
      let stored: string[] = [];
      try {
        stored = JSON.parse(localStorage.getItem("guest_garaj") || "[]");
      } catch {
        stored = [];
      }
      if (!stored.includes(vehicle!.id)) {
        stored.push(vehicle!.id);
        localStorage.setItem("guest_garaj", JSON.stringify(stored));
        toast({ title: "Garaja Eklendi", description: `${vehicle?.isim} başarıyla garajınıza eklendi.` });
      }
    }
  };

  if (!vehicle) return <div className="p-10 text-center">Yükleniyor...</div>;

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
            {[vehicle.cover_image, ...vehicle.gallery_images].map((img, idx) => (
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

          <div className="text-[#5d3b8b] text-2xl font-semibold mb-4">
            {displayPrice ? `${displayPrice.toLocaleString()} ₺ / Aylık` : "Fiyat bilgisi yok"}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Kilometre Limiti</label>
            <select
              className="w-full border rounded px-3 py-2"
              value={selectedKm}
              onChange={(e) => setSelectedKm(e.target.value)}
            >
              <option value="">Seçiniz</option>
              {availableKms.map((km, i) => (
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
              {availableSures.map((sure, i) => (
                <option key={i} value={sure}>{sure}</option>
              ))}
            </select>
          </div>

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
            <div><strong>Stok Kodu:</strong> {vehicle.stok_kodu}</div>
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
