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

interface Yorum {
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

export default function Page({ params }: Props) {
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [variations, setVariations] = useState<Variation[]>([]);
  const [comments, setComments] = useState<Yorum[]>([]);
  const [session, setSession] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedKm, setSelectedKm] = useState("");
  const [selectedSure, setSelectedSure] = useState("");
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(5);

  useEffect(() => {
    const fetchData = async () => {
      const { data: arac } = await supabase
        .from("Araclar")
        .select("*")
        .eq("id", params.id)
        .maybeSingle();

      const { data: varData } = await supabase
        .from("variations")
        .select("*")
        .eq("arac_id", params.id);

      const { data: yorumlar } = await supabase
        .from("yorumlar")
        .select("*, kullanici:profiles(ad,soyad)")
        .eq("arac_id", params.id)
        .order("created_at", { ascending: false });

      const sessionRes = await supabase.auth.getSession();

      setSession(sessionRes.data.session);
      setVehicle(arac);
      setVariations(varData || []);
      setComments(yorumlar || []);

      if (arac?.cover_image) {
        setSelectedImage(`https://uxnpmdeizkzvnevpceiw.supabase.co/storage/v1/object/public/images/${arac.cover_image}`);
      }

      const aktif = (varData || []).filter(v => v.status === "Aktif");
      const enUcuz = aktif.reduce((prev, curr) =>
        curr.fiyat < prev.fiyat ? curr : prev, aktif[0]);

      if (enUcuz) {
        setSelectedKm(enUcuz.kilometre);
        setSelectedSure(enUcuz.sure);
      }
    };

    fetchData();
  }, [params.id]);

  const activeVariations = variations.filter(v => v.status === "Aktif");
  const availableKms = [...new Set(activeVariations.map(v => v.kilometre))];
  const availableSures = [...new Set(activeVariations.map(v => v.sure))];
  const matched = activeVariations.find(v => v.kilometre === selectedKm && v.sure === selectedSure);
  const lowest = activeVariations.reduce((min, v) =>
    v.fiyat < min ? v.fiyat : min, activeVariations[0]?.fiyat || 0);

  const displayPrice = matched?.fiyat ?? lowest ?? vehicle?.fiyat ?? null;

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    const { data, error } = await supabase.from("yorumlar").insert({
      arac_id: vehicle?.id,
      yorum: newComment,
      puan: newRating,
    });

    if (error) {
      toast({ title: "Hata", description: "Yorum eklenemedi", variant: "destructive" });
    } else {
      setNewComment("");
      setNewRating(5);
      toast({ title: "Yorum eklendi", description: "Teşekkürler!" });

      const updated = await supabase
        .from("yorumlar")
        .select("*, kullanici:profiles(ad,soyad)")
        .eq("arac_id", params.id)
        .order("created_at", { ascending: false });

      setComments(updated.data || []);
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
                  setSelectedImage(`https://uxnpmdeizkzvnevpceiw.supabase.co/storage/v1/object/public/images/${img}`)
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
              {availableSures.map((sure, i) => (
                <option key={i} value={sure}>{sure}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4 border-b pb-2">Araç Açıklaması</h2>
        <div
          className="text-gray-800 prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: vehicle.aciklama }}
        />
      </div>

      {/* Yorum Formu – sadece oturum varsa */}
      {session && (
        <div className="mt-12">
          <h3 className="text-xl font-bold mb-2">Yorum Yap</h3>
          <textarea
            className="w-full border rounded p-2 mb-2"
            rows={3}
            placeholder="Yorumunuzu yazın..."
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
          />
          <select
            className="border p-2 rounded mb-2"
            value={newRating}
            onChange={e => setNewRating(Number(e.target.value))}
          >
            {[5, 4, 3, 2, 1].map((r) => (
              <option key={r} value={r}>{r} ⭐</option>
            ))}
          </select>
          <button
            onClick={handleAddComment}
            className="bg-[#68399e] hover:bg-[#512e7e] text-white px-4 py-2 rounded"
          >
            Gönder
          </button>
        </div>
      )}

      {/* Yorumlar */}
      {comments.length > 0 && (
        <div className="mt-12">
          <h3 className="text-xl font-bold mb-4">Yorumlar</h3>
          <div className="space-y-4">
            {comments.map((c) => (
              <div key={c.id} className="border p-4 rounded bg-white">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{c.kullanici?.ad} {c.kullanici?.soyad}</span>
                  <span>{c.puan} ⭐</span>
                </div>
                <p className="mt-2">{c.yorum}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
