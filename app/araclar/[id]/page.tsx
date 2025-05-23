// app/araclar/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-browser";
import Image from "next/image";
import { toast } from "@/hooks/use-toast";
import Link from "next/link";
import {
  ChevronLeft, ChevronRight, Star, Users, Gauge, Fuel, Settings2, CalendarDays, Package, ShieldCheck, MessageCircle, Send,
  CarFront, Loader2, CheckCircle2, ShoppingCart, CreditCard, HelpCircle, FileText, BookOpen
} from "lucide-react";

// Interface'ler (önceki gibi)
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

// Yardımcı İkon Bileşeni (önceki gibi)
const SpecIcon = ({ iconName }: { iconName?: string }) => {
  switch (iconName?.toLowerCase()) {
    case "yakıt": case "yakit_turu": return <Fuel size={18} className="text-[#6A3C96]" />;
    case "vites": return <Settings2 size={18} className="text-[#6A3C96]" />;
    case "kapasite": case "kisi_kapasitesi": return <Users size={18} className="text-[#6A3C96]" />;
    case "segment": return <Package size={18} className="text-[#6A3C96]" />;
    case "marka": return <ShieldCheck size={18} className="text-[#6A3C96]" />;
    case "kasa tipi": case "bodytype": return <CarFront size={18} className="text-[#6A3C96]" />;
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
  const [selectedKm, setSelectedKm] = useState<string>("");
  const [selectedSure, setSelectedSure] = useState<string>("");
  const [newComment, setNewComment] = useState<string>("");
  const [newRating, setNewRating] = useState<number>(5);
  const [isVehicleAddingToGarage, setIsVehicleAddingToGarage] = useState<boolean>(false);
  const [isVehicleAddedToGarage, setIsVehicleAddedToGarage] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const { data: aracData, error: aracError } = await supabase
        .from("Araclar")
        .select("*")
        .eq("id", params.id)
        .maybeSingle();

      if (aracError) throw aracError;

      if (aracData) {
        const arac = aracData as Vehicle;
        setVehicle(arac);

        const { data: varData, error: varError } = await supabase
          .from("variations")
          .select("*")
          .eq("arac_id", params.id);
        if (varError) throw varError;
        setVariations(varData || []);

        const { data: yorumlar, error: yorumError } = await supabase
          .from("yorumlar")
          .select("*, kullanici:kullanicilar(ad,soyad)")
          .eq("arac_id", params.id)
          .order("created_at", { ascending: false });
        if (yorumError) throw yorumError;
        setComments(yorumlar || []);

        const { data: sessionDataVal, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        setSession(sessionDataVal.session);

        const aktif = (varData || []).filter(v => v.status === "Aktif");
        if (aktif.length > 0) {
          const enUcuz = aktif.reduce((prev, curr) => (curr.fiyat < prev.fiyat ? curr : prev), aktif[0]);
          if (enUcuz) {
            setSelectedKm(enUcuz.kilometre);
            setSelectedSure(enUcuz.sure);
          }
        }
        
        const initialImage = arac.cover_image
          ? `https://uxnpmdeizkzvnevpceiw.supabase.co/storage/v1/object/public/images/${arac.cover_image.replace(/^\/+/, "")}`
          : "/placeholder.svg";
        setSelectedImage(initialImage);

        if (sessionDataVal.session?.user?.id && arac) {
          await checkIfInGarage(sessionDataVal.session.user.id, arac.id);
        } else if (arac) {
          const storedGarage = JSON.parse(localStorage.getItem("guest_garaj") || "[]") as string[];
          if (storedGarage.includes(arac.id)) {
            setIsVehicleAddedToGarage(true);
          }
        }
      } else {
        setVehicle(null);
      }
    } catch (error) {
        console.error("Fetch data error:", error);
        setVehicle(null);
        toast({title: "Veri Yükleme Hatası", description: "Araç bilgileri yüklenirken bir sorun oluştu.", variant: "destructive"});
    } finally {
        setIsLoading(false);
    }
  };

  useEffect(() => {
    if (params.id) {
      fetchData();
    } else {
      setIsLoading(false);
      setVehicle(null);
    }
  }, [params.id]);

  const handleAddComment = async () => {
    const { data: sessionDataVal } = await supabase.auth.getSession();
    const userId = sessionDataVal.session?.user?.id;
    if (!userId) {
      toast({ title: "Giriş Yapmalısınız", description: "Yorum yapabilmek için giriş yapınız." });
      return;
    }
    if (!newComment.trim()) {
      toast({ title: "Uyarı", description: "Yorum alanı boş bırakılamaz.", variant: "destructive" });
      return;
    }
    const { error } = await supabase.from("yorumlar").insert([{ user_id: userId, arac_id: params.id, yorum: newComment, puan: newRating }]);
    if (!error) {
      toast({ title: "Yorum Eklendi" });
      setNewComment(""); setNewRating(5);
      await fetchData();
    } else {
      toast({ title: "Hata", description: error.message, variant: "destructive" });
    }
  };

  const checkIfInGarage = async (userId: string, vehicleId: string) => {
    const { data: existing, error } = await supabase.from("garaj").select("id").eq("user_id", userId).eq("arac_id", vehicleId).maybeSingle();
    if (error) {
        console.error("Error checking garage status:", error);
        return;
    }
    setIsVehicleAddedToGarage(!!existing);
  };

  const handleVehicleToggleGarage = async () => {
    if (!vehicle) return;
    setIsVehicleAddingToGarage(true);
    const { data: sessionDataVal } = await supabase.auth.getSession();
    const userId = sessionDataVal.session?.user?.id;
    try {
      if (userId) {
        if (isVehicleAddedToGarage) {
          toast({ title: "Zaten Garajda" }); 
        } else {
          const {error} = await supabase.from("garaj").insert([{ user_id: userId, arac_id: vehicle.id }]);
          if (error) throw error;
          toast({ title: "Garaja Eklendi" });
          setIsVehicleAddedToGarage(true);
        }
      } else {
        let stored: string[] = JSON.parse(localStorage.getItem("guest_garaj") || "[]");
        if (isVehicleAddedToGarage) {
           toast({ title: "Zaten Garajda" });
        } else {
          if (!stored.includes(vehicle.id)) stored.push(vehicle.id);
          toast({ title: "Garaja Eklendi" });
          setIsVehicleAddedToGarage(true);
        }
        localStorage.setItem("guest_garaj", JSON.stringify(stored));
      }
    } catch (error) {
      const specificError = error as Error;
      toast({ title: "Hata", description: `Bir sorun oluştu: ${specificError.message}`, variant: "destructive" });
    } finally {
      setIsVehicleAddingToGarage(false);
    }
  };
  
  // Bu değişkenler vehicle null değilken tanımlanmalı.
  // isLoading ve !vehicle kontrollerinden sonraya taşıyacağız veya burada null check yapacağız.
  // Şimdilik fonksiyonun sonunda, return'den hemen önceye taşıyalım.

  const handleRentNow = () => {
    toast({ title: "Hemen Kirala", description: "Kiralama işlem adımları burada başlayacak."});
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-[calc(100vh-200px)] text-xl"><Loader2 className="mr-2 h-6 w-6 animate-spin" /> Yükleniyor...</div>;
  }
  
  if (!vehicle) {
    return <div className="flex items-center justify-center min-h-[calc(100vh-200px)] text-xl p-6 text-center">Araç bilgileri bulunamadı veya yüklenirken bir sorun oluştu.</div>;
  }

  // vehicle null değilse bu değişkenler burada güvenle tanımlanabilir.
  const activeVariations = variations.filter(v => v.status === "Aktif");
  const availableKms = [...new Set(activeVariations.map(v => v.kilometre))].sort((a, b) => parseInt(a) - parseInt(b));
  const availableSures = [...new Set(activeVariations.map(v => v.sure))].sort((a,b) => parseInt(a.split(" ")[0]) - parseInt(b.split(" ")[0]));
  const matchedVariation = activeVariations.find(v => v.kilometre === selectedKm && v.sure === selectedSure);
  const lowestPriceFromVariations = activeVariations.length > 0 ? Math.min(...activeVariations.map(v => v.fiyat)) : null;
  const displayPrice = matchedVariation?.fiyat ?? lowestPriceFromVariations ?? vehicle.fiyat ?? null; // vehicle.fiyat burada kesin var.
  
  const gallery = [vehicle.cover_image, ...(vehicle.gallery_images || [])].filter(imgKey => typeof imgKey === 'string' && imgKey.trim() !== '') as string[];
  
  // DÜZELTME: `year` ve `vehicleDisplayName` burada tanımlanacak.
  const localYear = vehicle.isim.includes(" - ") ? vehicle.isim.split(" - ").pop()?.trim() : undefined;
  const vehicleDisplayName = localYear 
    ? vehicle.isim.substring(0, vehicle.isim.lastIndexOf(` - ${localYear}`)) 
    : vehicle.isim;

  const keySpecs = [
    { label: "Vites", value: vehicle.vites, iconName: "vites" },
    { label: "Yakıt", value: vehicle.yakit_turu, iconName: "yakit_turu" },
    { label: "Kapasite", value: vehicle.kisi_kapasitesi || "N/A", iconName: "kisi_kapasitesi" },
  ].filter(spec => spec.value && spec.value !== "N/A");

  const allSpecs = [
    { label: "Marka", value: vehicle.brand, iconName: "marka" },
    { label: "Segment", value: vehicle.segment, iconName: "segment" },
    { label: "Yakıt Türü", value: vehicle.yakit_turu, iconName: "yakit_turu" },
    { label: "Vites", value: vehicle.vites, iconName: "vites" },
    { label: "Kasa Tipi", value: vehicle.bodyType, iconName: "bodyType" },
    { label: "Kişi Kapasitesi", value: vehicle.kisi_kapasitesi, iconName: "kisi_kapasitesi"},
    { label: "Stok Kodu", value: vehicle.stok_kodu, iconName: "HelpCircle"},
    { label: "Durum", value: vehicle.durum, iconName: "durum" },
  ].filter(spec => spec.value);


  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <nav className="mb-4 text-sm text-gray-500">
          <Link href="/" className="hover:text-[#6A3C96]">Ana Sayfa</Link>
          <span className="mx-2">/</span>
          <Link href="/araclar" className="hover:text-[#6A3C96]">Kiralık Araçlar</Link>
          <span className="mx-2">/</span>
          {/* vehicle.brand null olabilir, kontrol ekleyelim */}
          <span className="text-gray-700">{vehicle.brand || ""} {vehicleDisplayName?.replace(vehicle.brand || "", "").trim()}</span>
        </nav>

        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
            <div className="lg:col-span-3">
                <div className="relative w-full aspect-[4/3] bg-gray-100">
                {selectedImage ? (
                    <Image src={selectedImage} alt={vehicle.isim || "Araç Kapak Fotoğrafı"} layout="fill" objectFit="contain" className="p-1" priority />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">Görsel Yok</div>
                )}
                </div>
                {gallery && gallery.length > 1 && (
                <div className="flex overflow-x-auto space-x-2 p-3 bg-gray-50 border-t border-gray-200">
                    {gallery.map((imgKey, i) => (
                    <button 
                        key={imgKey || i} 
                        onClick={() => imgKey && setSelectedImage(`https://uxnpmdeizkzvnevpceiw.supabase.co/storage/v1/object/public/images/${imgKey.replace(/^\/+/, "")}`)}
                        className={`shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-md overflow-hidden border-2 transition-all duration-150 ease-in-out transform hover:scale-105 ${selectedImage?.includes(imgKey?.replace(/^\/+/, "") || '###_NO_MATCH_###') ? 'border-[#6A3C96] ring-2 ring-[#6A3C96]/50' : 'border-transparent hover:border-gray-400'}`}
                    >
                        {imgKey && <Image 
                        src={`https://uxnpmdeizkzvnevpceiw.supabase.co/storage/v1/object/public/images/${imgKey.replace(/^\/+/, "")}`} 
                        alt={`Araç küçük görsel ${i + 1}`} 
                        width={80} 
                        height={80} 
                        className="object-cover w-full h-full" 
                        />}
                    </button>
                    ))}
                </div>
                )}
            </div>

            <div className="lg:col-span-2 p-6 flex flex-col bg-white">
                {/* vehicleDisplayName ve localYear JSX içinde kullanılacak */}
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
                    {vehicleDisplayName}
                    {localYear && <span className="text-lg text-gray-500 font-normal ml-2">{`- ${localYear}`}</span>}
                </h1>
                {vehicle.kisa_aciklama && <p className="text-sm text-gray-600 mt-2 mb-4">{vehicle.kisa_aciklama}</p>}

                {keySpecs.length > 0 && (
                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-700 my-4 border-t border-b border-gray-200 py-3">
                        {keySpecs.map(spec => (
                            <div key={spec.label} className="flex items-center">
                                <SpecIcon iconName={spec.iconName} />
                                <span className="ml-1.5">{spec.value}</span>
                            </div>
                        ))}
                    </div>
                )}

                {activeVariations.length > 0 && (
                <>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label htmlFor="kmSelect" className="block text-xs font-medium text-gray-700 mb-1">KM Limiti</label>
                            <select id="kmSelect" className="w-full text-sm border-gray-300 rounded-md shadow-sm px-3 py-2 focus:border-[#6A3C96] focus:ring focus:ring-[#6A3C96]/30" value={selectedKm} onChange={e => setSelectedKm(e.target.value)}>
                            <option value="" disabled>Seçiniz</option>
                            {availableKms.map((km, i) => <option key={i} value={km}>{km} km</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="sureSelect" className="block text-xs font-medium text-gray-700 mb-1">Süre</label>
                            <select id="sureSelect" className="w-full text-sm border-gray-300 rounded-md shadow-sm px-3 py-2 focus:border-[#6A3C96] focus:ring focus:ring-[#6A3C96]/30" value={selectedSure} onChange={e => setSelectedSure(e.target.value)}>
                            <option value="" disabled>Seçiniz</option>
                            {availableSures.map((sure, i) => <option key={i} value={sure}>{sure}</option>)}
                            </select>
                        </div>
                    </div>
                </>
                )}
                
                <div className="my-4 p-4 bg-gray-50 rounded-lg">
                    <div className="text-gray-600 text-sm mb-1">Aylık Kiralama Bedeli:</div>
                    <div className="text-[#6A3C96] text-3xl lg:text-4xl font-extrabold">
                        {displayPrice ? `${displayPrice.toLocaleString('tr-TR')} ₺` : (activeVariations.length > 0 ? "Seçim Yapın" : "Fiyat Yok")}
                    </div>
                    <div className="text-xs font-medium text-gray-500 ml-1">+ KDV / Ay</div>
                </div>
                
                <div className="mt-auto space-y-3">
                    <button 
                        onClick={handleRentNow}
                        className="w-full flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-[#6A3C96] hover:bg-[#58307d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6A3C96] transition-colors"
                    >
                        <CreditCard size={20} className="mr-2"/>
                        Hemen Kirala
                    </button>
                    <button 
                        onClick={handleVehicleToggleGarage}
                        disabled={isVehicleAddingToGarage}
                        className={`w-full flex items-center justify-center px-6 py-3 border rounded-md shadow-sm text-base font-medium transition-colors ${
                            isVehicleAddedToGarage 
                                ? "bg-green-100 text-green-700 border-green-300 hover:bg-green-200 cursor-default" 
                                : isVehicleAddingToGarage 
                                    ? "bg-gray-100 text-gray-400 border-gray-300 cursor-wait" 
                                    : "bg-white text-[#6A3C96] border-gray-300 hover:bg-purple-50 hover:border-[#6A3C96]"
                        } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6A3C96]`}
                    >
                        {isVehicleAddedToGarage ? (
                            <CheckCircle2 size={20} className="mr-2"/>
                        ) : isVehicleAddingToGarage ? (
                            <Loader2 size={20} className="mr-2 animate-spin"/>
                        ) : (
                            <CarFront size={20} className="mr-2"/>
                        )}
                        {isVehicleAddedToGarage ? "Garajda" : isVehicleAddingToGarage ? "Ekleniyor..." : "Garaja Ekle"}
                    </button>
                </div>
            </div>
            </div>
        </div>

      <div className="mt-8 sm:mt-12 bg-white shadow-lg rounded-lg p-6">
        <section id="teknik-ozellikler" className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200 flex items-center">
                <Settings2 size={24} className="mr-3 text-[#6A3C96]" /> Teknik Özellikler
            </h2>
            {allSpecs.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-3 text-sm">
                {allSpecs.map(spec => (
                    <div key={spec.label} className="flex items-start py-1.5">
                    <span className="mr-2 pt-0.5"><SpecIcon iconName={spec.iconName} /></span>
                    <div>
                        <span className="font-medium text-gray-500">{spec.label}:</span>
                        <span className="ml-1.5 text-gray-800 font-medium">{spec.value}</span>
                    </div>
                    </div>
                ))}
                </div>
            ) : <p className="text-gray-600">Bu araç için detaylı teknik özellik girilmemiş.</p>}
        </section>

        {vehicle.aciklama && (
            <section id="aciklama" className="mb-10 pt-6 border-t border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200 flex items-center">
                <FileText size={24} className="mr-3 text-[#6A3C96]" /> Araç Açıklaması
            </h2>
            <div className="text-gray-700 prose prose-sm sm:prose-base max-w-none leading-relaxed" dangerouslySetInnerHTML={{ __html: vehicle.aciklama }} />
            </section>
        )}

        <section id="degerlendirmeler" className="pt-6 border-t border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-900 mb-5 pb-2 border-b border-gray-200 flex items-center">
                <MessageCircle size={24} className="mr-3 text-[#6A3C96]" /> Değerlendirmeler ({comments.length})
            </h2>
            {comments.length === 0 && <p className="text-gray-600 mb-6">Bu araç için henüz değerlendirme yapılmamış. İlk yorumu siz yapın!</p>}
            <div className="space-y-6">
                {comments.map((c) => (
                <article key={c.id} className="border border-gray-200 rounded-lg p-4 shadow-sm bg-white">
                    <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-gray-800">{c.kullanici?.ad || "Kullanıcı"} {c.kullanici?.soyad || ""}</span>
                        <div className="flex items-center text-sm text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} size={16} className={i < c.puan ? "fill-yellow-400 text-yellow-400" : "fill-gray-300 text-gray-300"}/>
                            ))}
                            <span className="ml-2 text-gray-600 font-medium">({c.puan}.0)</span>
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">{new Date(c.created_at).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                    <p className="text-gray-700 text-sm leading-relaxed">{c.yorum}</p>
                </article>
                ))}
            </div>

            {session ? (
            <div className="mt-8 pt-6 border-t border-gray-300">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Değerlendirmenizi Ekleyin</h3>
                <textarea 
                    className="w-full border-gray-300 rounded-md shadow-sm p-3 mb-3 focus:border-[#6A3C96] focus:ring focus:ring-[#6A3C96]/50 text-sm" 
                    rows={4} 
                    placeholder="Yorumunuzu buraya yazın..." 
                    value={newComment} 
                    onChange={e => setNewComment(e.target.value)} 
                />
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center">
                        <span className="text-sm text-gray-700 mr-3">Puanınız:</span>
                        <div className="flex space-x-1">
                            {[5, 4, 3, 2, 1].map((r) => (
                                <button key={r} onClick={() => setNewRating(r)} className={`p-1.5 rounded-full transition-colors ${newRating === r ? 'bg-[#6A3C96] text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}>
                                    <Star size={18} className={newRating === r ? "fill-white" : "fill-transparent stroke-current"}/>
                                </button>
                            ))}
                        </div>
                    </div>
                    <button 
                        onClick={handleAddComment} 
                        disabled={!newComment.trim()}
                        className="bg-[#6A3C96] hover:bg-[#58307d] text-white px-6 py-2.5 rounded-md font-medium transition-colors text-sm flex items-center justify-center sm:w-auto disabled:opacity-50"
                    >
                        <Send size={16} className="inline mr-2" />
                        Yorumu Gönder
                    </button>
                </div>
            </div>
            ) : (
                <p className="mt-8 pt-6 border-t border-gray-300 text-sm text-gray-600 text-center">
                    Yorum yapabilmek için lütfen <Link href="/giris" className="text-[#6A3C96] hover:underline font-semibold">giriş yapın</Link> veya <Link href="/kayit" className="text-[#6A3C96] hover:underline font-semibold">kayıt olun</Link>.
                </p>
            )}
        </section>
      </div>

      <div className="md:hidden sticky bottom-0 left-0 right-0 bg-white p-3 border-t border-gray-200 shadow-lg z-40">
        <div className="flex items-center justify-between gap-3">
            <div className="flex-shrink-0 text-left">
                <div className="text-[#6A3C96] text-lg font-bold leading-tight">
                    {displayPrice ? `${displayPrice.toLocaleString('tr-TR')} ₺` : "Fiyat Seçin"}
                </div>
                <div className="text-xs text-gray-500 -mt-0.5">/ Ay + KDV</div>
            </div>
            <button 
                onClick={handleRentNow}
                className="w-auto flex-grow flex items-center justify-center px-4 py-2.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#6A3C96] hover:bg-[#58307d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6A3C96] transition-colors"
            >
                <CreditCard size={18} className="mr-1.5"/>
                Hemen Kirala
            </button>
        </div>
      </div>
    </div>
  );
}
