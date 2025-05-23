"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-browser";
import Image from "next/image";
import { toast } from "@/hooks/use-toast";
import Link from "next/link";
import {
  Star,
  Fuel,
  Settings2,
  CalendarDays,
  Package,
  ShieldCheck,
  MessageCircle,
  Send,
  CarFront,
  Loader2,
  CheckCircle2,
  CreditCard,
} from "lucide-react";

interface Variation {
  kilometre: string;
  sure: string;
  fiyat: number;
  status: string;
}

interface Comment {
  id: string;
  user_id: string;
  yorum: string;
  puan: number;
  created_at: string;
  kullanici?: { ad: string; soyad: string };
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

interface Props {
  params: { id: string };
}

export default function Page({ params }: Props) {
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [variations, setVariations] = useState<Variation[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [session, setSession] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedKm, setSelectedKm] = useState("");
  const [selectedSure, setSelectedSure] = useState("");
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [isVehicleAddedToGarage, setIsVehicleAddedToGarage] = useState(false);
  const [isVehicleAddingToGarage, setIsVehicleAddingToGarage] = useState(false);

  const fetchData = async () => {
    const { data: aracData } = await supabase
      .from("Araclar")
      .select("*")
      .eq("id", params.id)
      .maybeSingle();

    if (!aracData) return;

    setVehicle(aracData as Vehicle);

    const { data: varData } = await supabase
      .from("variations")
      .select("*")
      .eq("arac_id", params.id);

    setVariations(varData || []);

    const { data: yorumlar } = await supabase
      .from("yorumlar")
      .select("*, kullanici:kullanicilar(ad,soyad)")
      .eq("arac_id", params.id)
      .order("created_at", { ascending: false });

    setComments(yorumlar || []);

    const { data: sessionData } = await supabase.auth.getSession();
    setSession(sessionData.session);

    const aktif = (varData || []).filter((v) => v.status === "Aktif");
    if (aktif.length > 0) {
      const enUcuz = aktif.reduce((prev, curr) => (curr.fiyat < prev.fiyat ? curr : prev), aktif[0]);
      setSelectedKm(enUcuz.kilometre);
      setSelectedSure(enUcuz.sure);
    }

    const imageUrl = aracData.cover_image
      ? `https://uxnpmdeizkzvnevpceiw.supabase.co/storage/v1/object/public/images/${aracData.cover_image.replace(/^\/+/, "")}`
      : "/placeholder.svg";

    setSelectedImage(imageUrl);
  };

  useEffect(() => {
    fetchData();
  }, [params.id]);

  const activeVariations = variations.filter((v) => v.status === "Aktif");

  const availableKms = [...new Set(activeVariations.map((v) => v.kilometre))];
  const availableSures = [...new Set(activeVariations.map((v) => v.sure))];

  const matchedVariation = activeVariations.find(
    (v) => v.kilometre === selectedKm && v.sure === selectedSure
  );

  const lowestPrice =
    activeVariations.length > 0
      ? Math.min(...activeVariations.map((v) => v.fiyat))
      : vehicle?.fiyat ?? null;

  const displayPrice = matchedVariation?.fiyat ?? lowestPrice ?? null;

  const gallery =
    vehicle?.gallery_images?.filter((img) => img) || [];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">{vehicle?.isim}</h1>
      <p className="text-sm text-gray-500 mb-4">{vehicle?.kisa_aciklama}</p>

      {/* Fiyat */}
      <div className="text-xl font-semibold text-[#6A3C96] mb-2">
        {displayPrice !== null && displayPrice !== undefined
          ? `${displayPrice.toLocaleString("tr-TR")} ₺`
          : "Fiyat Seçin"}
        <span className="text-xs text-gray-500 ml-1">/ Ay + KDV</span>
      </div>

      {/* Galeri */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
        {selectedImage && (
          <div className="w-full aspect-[4/3] bg-gray-100 relative rounded overflow-hidden border">
            <Image
              src={selectedImage}
              alt="Kapak"
              fill
              className="object-contain p-2"
            />
          </div>
        )}
        <div className="flex flex-wrap gap-2">
          {gallery.map((imgKey, i) => (
            <Image
              key={i}
              src={`https://uxnpmdeizkzvnevpceiw.supabase.co/storage/v1/object/public/images/${imgKey.replace(/^\/+/, "")}`}
              alt={`Galeri ${i + 1}`}
              width={100}
              height={100}
              className="rounded border object-cover"
              onClick={() =>
                setSelectedImage(
                  `https://uxnpmdeizkzvnevpceiw.supabase.co/storage/v1/object/public/images/${imgKey.replace(/^\/+/, "")}`
                )
              }
            />
          ))}
        </div>
      </div>

      {/* Teknik özellikler */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Teknik Özellikler</h2>
        <ul className="grid sm:grid-cols-2 gap-2 text-sm">
          <li><b>Marka:</b> {vehicle?.brand}</li>
          <li><b>Segment:</b> {vehicle?.segment}</li>
          <li><b>Yakıt:</b> {vehicle?.yakit_turu}</li>
          <li><b>Vites:</b> {vehicle?.vites}</li>
          <li><b>Durum:</b> {vehicle?.durum}</li>
          <li><b>Kasa Tipi:</b> {vehicle?.bodyType}</li>
        </ul>
      </div>

      {/* Açıklama */}
      {vehicle?.aciklama && (
        <div className="mt-8 prose max-w-none" dangerouslySetInnerHTML={{ __html: vehicle.aciklama }} />
      )}
    </div>
  );
}
