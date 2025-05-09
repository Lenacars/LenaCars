"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-browser";
import Image from "next/image";
import { toast } from "@/hooks/use-toast";

interface Props {
  params: { id: string };
}

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
  const [comments, setComments] = useState<Comment[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedKm, setSelectedKm] = useState("");
  const [selectedSure, setSelectedSure] = useState("");
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(5);

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
      .select("*")
      .eq("arac_id", params.id)
      .order("created_at", { ascending: false });

    if (arac) {
      setVehicle(arac);
      setVariations(varData || []);
      setComments(yorumlar || []);

      const aktif = (varData || []).filter(v => v.status === "Aktif");
      const enUcuz = aktif.reduce((prev, curr) => (curr.fiyat < prev.fiyat ? curr : prev), aktif[0]);

      if (enUcuz) {
        setSelectedKm(enUcuz.kilometre);
        setSelectedSure(enUcuz.sure);
      }

      const image = arac.cover_image
        ? `https://uxnpmdeizkzvnevpceiw.supabase.co/storage/v1/object/public/images/${arac.cover_image}`
        : "/placeholder.svg";
      setSelectedImage(image);
    }
  };

  useEffect(() => {
    fetchData();
  }, [params.id]);

  const handleAddComment = async () => {
    const session = await supabase.auth.getSession();
    const userId = session.data.session?.user?.id;
    if (!userId) {
      toast({ title: "Giriş Yapmalısınız", description: "Yorum yapabilmek için giriş yapınız." });
      return;
    }

    const { error } = await supabase.from("yorumlar").insert([
      {
        user_id: userId,
        arac_id: params.id,
        yorum: newComment,
        puan: newRating,
      },
    ]);

    if (!error) {
      toast({ title: "Yorum Eklendi" });
      setNewComment("");
      setNewRating(5);
      fetchData();
    } else {
      toast({ title: "Hata", description: error.message });
    }
  };

  const activeVariations = variations.filter(v => v.status === "Aktif");
  const availableKms = [...new Set(activeVariations.map(v => v.kilometre))];
  const availableSures = [...new Set(activeVariations.map(v => v.sure))];
  const matched = activeVariations.find(v => v.kilometre === selectedKm && v.sure === selectedSure);
  const lowest = activeVariations.reduce((min, v) => v.fiyat < min ? v.fiyat : min, activeVariations[0]?.fiyat || 0);
  const displayPrice = matched?.fiyat ?? lowest ?? vehicle?.fiyat ?? null;

  if (!vehicle) return <div className="p-10 text-center">Yükleniyor...</div>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div className="relative w-full h-[400px] rounded overflow-hidden border bg-white">
            <Image src={selectedImage || "/placeholder.svg"} alt="Kapak" fill className="object-contain p-4" />
          </div>
          <div className="grid grid-cols-4 gap-2 mt-4">
            {[vehicle.cover_image, ...vehicle.gallery_images].map((img, i) => (
              <button key={i} onClick={() =>
                setSelectedImage(`https://uxnpmdeizkzvnevpceiw.supabase.co/storage/v1/object/public/images/${img}`)
              }>
                <Image src={`https://uxnpmdeizkzvnevpceiw.supabase.co/storage/v1/object/public/images/${img}`} alt={`Görsel ${i}`} width={80} height={80} className="object-cover border rounded" />
              </button>
            ))}
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-2">{vehicle.isim}</h1>
          <div className="text-[#5d3b8b] text-2xl font-semibold mb-4">
            {displayPrice ? `${displayPrice.toLocaleString()} ₺ / Aylık` : "Fiyat bilgisi yok"}
          </div>

          <label className="block text-sm font-medium mb-1">Kilometre Limiti</label>
          <select className="w-full border rounded px-3 py-2 mb-4" value={selectedKm} onChange={e => setSelectedKm(e.target.value)}>
            {availableKms.map((km, i) => <option key={i}>{km}</option>)}
          </select>

          <label className="block text-sm font-medium mb-1">Süre</label>
          <select className="w-full border rounded px-3 py-2 mb-4" value={selectedSure} onChange={e => setSelectedSure(e.target.value)}>
            {availableSures.map((sure, i) => <option key={i}>{sure}</option>)}
          </select>

          <button onClick={handleAddComment} className="w-full bg-[#5d3b8b] hover:bg-[#432b6e] text-white py-3 rounded">Garaja Ekle</button>

          <div className="mt-6 grid grid-cols-2 gap-4 text-sm text-gray-600">
            <div><strong>Marka:</strong> {vehicle.brand}</div>
            <div><strong>Segment:</strong> {vehicle.segment}</div>
            <div><strong>Yakıt Türü:</strong> {vehicle.yakit_turu}</div>
            <div><strong>Vites:</strong> {vehicle.vites}</div>
            <div><strong>Kasa:</strong> {vehicle.bodyType}</div>
            <div><strong>Durum:</strong> {vehicle.durum}</div>
          </div>
        </div>
      </div>

      {/* Yorumlar */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Yorumlar</h2>
        {comments.length === 0 && <p className="text-gray-600">Henüz yorum yapılmamış.</p>}
        {comments.map((c) => (
          <div key={c.id} className="border rounded p-4 mb-4">
            <div className="flex justify-between items-center mb-2">
              <strong>{c.puan} ⭐</strong>
              <span className="text-sm text-gray-500">{new Date(c.created_at).toLocaleDateString()}</span>
            </div>
            <p>{c.yorum}</p>
          </div>
        ))}
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-2">Yorum Yap</h3>
          <textarea className="w-full border rounded p-2 mb-2" rows={3} placeholder="Yorumunuzu yazın..." value={newComment} onChange={e => setNewComment(e.target.value)} />
          <select className="border p-2 rounded mb-2" value={newRating} onChange={e => setNewRating(Number(e.target.value))}>
            {[5, 4, 3, 2, 1].map((r) => (
              <option key={r} value={r}>{r} ⭐</option>
            ))}
          </select>
          <button onClick={handleAddComment} className="bg-[#68399e] hover:bg-[#512e7e] text-white px-4 py-2 rounded">Gönder</button>
        </div>
      </div>

      {/* Açıklama */}
      {vehicle.aciklama && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4 border-b pb-2">Araç Açıklaması</h2>
          <div className="text-gray-800 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: vehicle.aciklama }} />
        </div>
      )}
    </div>
  );
}
