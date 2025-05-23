// app/araclar/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-browser";
import Image from "next/image";
import Link from "next/link";
import { toast } from "@/hooks/use-toast";
import {
  Star, Users, Fuel, Settings2, CalendarDays, Package, ShieldCheck,
  MessageCircle, Send, CarFront, Loader2, CheckCircle2, CreditCard, HelpCircle, FileText
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
  kisi_kapasitesi?: string;
}

interface Props {
  params: { id: string };
}

const SpecIcon = ({ iconName }: { iconName?: string }) => {
  switch (iconName?.toLowerCase()) {
    case "yakıt": case "yakit_turu": return <Fuel size={18} className="text-[#6A3C96]" />;
    case "vites": return <Settings2 size={18} className="text-[#6A3C96]" />;
    case "kapasite": case "kisi_kapasitesi": return <Users size={18} className="text-[#6A3C96]" />;
    case "segment": return <Package size={18} className="text-[#6A3C96]" />;
    case "marka": return <ShieldCheck size={18} className="text-[#6A3C96]" />;
    case "bodytype": case "kasa tipi": return <CarFront size={18} className="text-[#6A3C96]" />;
    case "durum": return <CalendarDays size={18} className="text-[#6A3C96]" />;
    default: return <HelpCircle size={18} className="text-gray-400" />;
  }
};

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
  const [isVehicleAddingToGarage, setIsVehicleAddingToGarage] = useState(false);
  const [isVehicleAddedToGarage, setIsVehicleAddedToGarage] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const { data: arac } = await supabase.from("Araclar").select("*").eq("id", params.id).maybeSingle();
      if (!arac) return setVehicle(null);

      setVehicle(arac);
      const imageUrl = `https://uxnpmdeizkzvnevpceiw.supabase.co/storage/v1/object/public/images/${arac.cover_image?.replace(/^\/+/, "")}`;
      setSelectedImage(arac.cover_image ? imageUrl : "/placeholder.svg");

      const { data: varData } = await supabase.from("variations").select("*").eq("arac_id", params.id);
      setVariations(varData || []);

      const { data: yorumlar } = await supabase
        .from("yorumlar")
        .select("*, kullanici:kullanicilar(ad,soyad)")
        .eq("arac_id", params.id)
        .order("created_at", { ascending: false });
      setComments(yorumlar || []);

      const { data: sessionData } = await supabase.auth.getSession();
      setSession(sessionData?.session || null);

      if (sessionData?.session?.user?.id) {
        const { data: existing } = await supabase
          .from("garaj")
          .select("id")
          .eq("user_id", sessionData.session.user.id)
          .eq("arac_id", arac.id)
          .maybeSingle();
        setIsVehicleAddedToGarage(!!existing);
      } else {
        const stored = JSON.parse(localStorage.getItem("guest_garaj") || "[]");
        if (stored.includes(arac.id)) setIsVehicleAddedToGarage(true);
      }

      const aktif = (varData || []).filter(v => v.status === "Aktif");
      if (aktif.length > 0) {
        const enUcuz = aktif.reduce((prev, curr) => (curr.fiyat < prev.fiyat ? curr : prev), aktif[0]);
        setSelectedKm(enUcuz.kilometre);
        setSelectedSure(enUcuz.sure);
      }

      setIsLoading(false);
    };

    fetchData();
  }, [params.id]);

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Yükleniyor...</div>;
  }

  if (!vehicle) {
    return <div className="flex justify-center items-center min-h-screen text-xl">Araç bulunamadı.</div>;
  }

  const activeVariations = variations.filter(v => v.status === "Aktif");
  const availableKms = [...new Set(activeVariations.map(v => v.kilometre))];
  const availableSures = [...new Set(activeVariations.map(v => v.sure))];
  const matched = activeVariations.find(v => v.kilometre === selectedKm && v.sure === selectedSure);
  const fiyat = matched?.fiyat ?? activeVariations[0]?.fiyat ?? vehicle.fiyat;

  const handleAddComment = async () => {
    if (!session?.user?.id || !newComment.trim()) return;
    const { error } = await supabase.from("yorumlar").insert([{ arac_id: vehicle.id, user_id: session.user.id, yorum: newComment, puan: newRating }]);
    if (!error) {
      setNewComment(""); setNewRating(5);
      toast({ title: "Yorum eklendi" });
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-2">{vehicle.isim}</h1>
      <Image src={selectedImage || "/placeholder.svg"} alt="Kapak" width={800} height={600} className="rounded-lg" />

      <div className="my-4">
        <div className="text-xl font-semibold text-[#6A3C96]">{fiyat.toLocaleString("tr-TR")} ₺ <span className="text-sm text-gray-500">/ Ay + KDV</span></div>
        <div className="mt-2 grid grid-cols-2 gap-3">
          <select className="border rounded p-2" value={selectedKm} onChange={(e) => setSelectedKm(e.target.value)}>
            <option value="">KM Seç</option>
            {availableKms.map((v, i) => <option key={i} value={v}>{v}</option>)}
          </select>
          <select className="border rounded p-2" value={selectedSure} onChange={(e) => setSelectedSure(e.target.value)}>
            <option value="">Süre Seç</option>
            {availableSures.map((v, i) => <option key={i} value={v}>{v}</option>)}
          </select>
        </div>
      </div>

      <div className="my-6">
        <h2 className="text-xl font-semibold mb-3">Açıklama</h2>
        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: vehicle.aciklama }} />
      </div>

      <div className="my-6">
        <h2 className="text-xl font-semibold mb-3">Yorumlar ({comments.length})</h2>
        {comments.map((c) => (
          <div key={c.id} className="mb-4 p-3 border rounded bg-white">
            <div className="flex justify-between">
              <strong>{c.kullanici?.ad} {c.kullanici?.soyad}</strong>
              <span>{[...Array(5)].map((_, i) => <Star key={i} className={i < c.puan ? "text-yellow-500" : "text-gray-300"} size={16} />)}</span>
            </div>
            <p className="text-sm text-gray-700 mt-1">{c.yorum}</p>
          </div>
        ))}

        {session ? (
          <div className="mt-4">
            <textarea className="w-full border rounded p-2 mb-2" rows={3} value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Yorumunuz..." />
            <button onClick={handleAddComment} className="bg-[#6A3C96] text-white px-4 py-2 rounded">Yorumu Gönder</button>
          </div>
        ) : (
          <p className="text-sm text-gray-500 mt-2">Yorum yapmak için <Link href="/giris" className="text-[#6A3C96] underline">giriş yapın</Link>.</p>
        )}
      </div>
    </div>
  );
}
