// app/araclar/[id]/page.tsx

// ... (importlar ve interface'leriniz burada kalacak)
// Örnek importlar (sizde daha fazlası olabilir, sadece temel olanları gösteriyorum):
// import { useEffect, useState } from "react";
// import { supabase } from "@/lib/supabase-browser";
// import Image from "next/image";
// import { toast } from "@/hooks/use-toast";
// import Link from "next/link";
// import { Loader2, Star, Fuel, Settings2, ... } from "lucide-react";

// SpecIcon helper component'i burada veya import edilmiş olabilir
// const SpecIcon = ({ iconName }: { iconName?: string }) => { ... };

export default function Page({ params }: Props) {
  // 1. TÜM STATE'LERİ GERİ EKLEYELİM
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [variations, setVariations] = useState<Variation[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [session, setSession] = useState<any>(null); // Supabase session tipi kullanılabilir
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedKm, setSelectedKm] = useState<string>("");
  const [selectedSure, setSelectedSure] = useState<string>("");
  const [newComment, setNewComment] = useState<string>("");
  const [newRating, setNewRating] = useState<number>(5);
  const [isVehicleAddingToGarage, setIsVehicleAddingToGarage] = useState<boolean>(false);
  const [isVehicleAddedToGarage, setIsVehicleAddedToGarage] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Garaj durumunu kontrol eden fonksiyonu buraya alalım (fetchData içinde kullanılacak)
  const checkIfInGarage = async (userId: string, vehicleId: string) => {
    try {
      const { data: existing, error } = await supabase
        .from("garaj")
        .select("id")
        .eq("user_id", userId)
        .eq("arac_id", vehicleId)
        .maybeSingle();
      if (error) {
        console.error("Garaj durumu kontrol hatası:", error);
        // toast({ title: "Hata", description: "Garaj durumu kontrol edilirken bir sorun oluştu.", variant: "destructive" });
        return; // Hata durumunda state'i değiştirmeyebiliriz veya farklı bir işlem yapabiliriz
      }
      setIsVehicleAddedToGarage(!!existing);
    } catch (checkError) {
        console.error("checkIfInGarage içinde genel hata:", checkError);
    }
  };

  // 2. fetchData FONKSİYONUNU GÜNCELLEYELİM
  const fetchData = async () => {
    setIsLoading(true);
    // State'leri sıfırlayarak başlayalım (opsiyonel, ID değiştiğinde temiz bir başlangıç için)
    setVehicle(null);
    setVariations([]);
    setComments([]);
    setSelectedImage(null);
    setSelectedKm("");
    setSelectedSure("");
    setIsVehicleAddedToGarage(false);

    try {
      if (!params.id) {
        console.error("Araç ID bulunamadı.");
        toast({ title: "Hata", description: "Araç ID'si bulunamadı.", variant: "destructive" });
        setIsLoading(false);
        return;
      }

      // Araç verisini çek
      const { data: aracData, error: aracError } = await supabase
        .from("Araclar")
        .select("*") // İhtiyaç duyduğunuz tüm alanları seçin
        .eq("id", params.id)
        .maybeSingle();

      if (aracError) {
        console.error("Araç verisi çekme hatası:", aracError);
        toast({ title: "Veri Hatası", description: `Araç detayları yüklenemedi: ${aracError.message}`, variant: "destructive" });
        setVehicle(null); // Hata durumunda aracı null yap
        setIsLoading(false);
        return;
      }

      if (aracData) {
        const arac = aracData as Vehicle; // Gerekirse tip ataması
        setVehicle(arac);

        // Varyasyonları çek
        const { data: varData, error: varError } = await supabase
          .from("variations")
          .select("*")
          .eq("arac_id", params.id);
        if (varError) throw varError; // Hata varsa yakalanacak
        setVariations(varData || []);

        // Yorumları çek
        const { data: yorumlar, error: yorumError } = await supabase
          .from("yorumlar")
          .select("*, kullanici:kullanicilar(ad,soyad)")
          .eq("arac_id", params.id)
          .order("created_at", { ascending: false });
        if (yorumError) throw yorumError;
        setComments(yorumlar || []);

        // Session bilgisini çek
        const { data: sessionDataVal, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        setSession(sessionDataVal.session);

        // Aktif varyasyonlardan en ucuzunu bul ve state'leri ayarla
        const aktif = (varData || []).filter(v => v.status === "Aktif");
        if (aktif.length > 0) {
          const enUcuz = aktif.reduce((prev, curr) => (curr.fiyat < prev.fiyat ? curr : prev), aktif[0]);
          if (enUcuz) {
            setSelectedKm(enUcuz.kilometre);
            setSelectedSure(enUcuz.sure);
          }
        }
        
        // Kapak resmini ayarla
        const initialImage = arac.cover_image
          ? `https://uxnpmdeizkzvnevpceiw.supabase.co/storage/v1/object/public/images/${arac.cover_image.replace(/^\/+/, "")}`
          : "/placeholder.svg";
        setSelectedImage(initialImage);

        // Garaj durumunu kontrol et
        if (sessionDataVal.session?.user?.id && arac) {
          await checkIfInGarage(sessionDataVal.session.user.id, arac.id);
        } else if (arac) { // Misafir kullanıcı için localStorage kontrolü
          const storedGarage = JSON.parse(localStorage.getItem("guest_garaj") || "[]") as string[];
          if (storedGarage.includes(arac.id)) {
            setIsVehicleAddedToGarage(true);
          }
        }
      } else {
        // Araç bulunamadıysa
        setVehicle(null);
        toast({title: "Araç Bulunamadı", description: "Belirtilen ID ile eşleşen bir araç bulunamadı.", variant: "warning"});
      }
    } catch (error) {
        const specificError = error as Error;
        console.error("FetchData içinde genel hata:", specificError);
        setVehicle(null); // Hata durumunda aracı null yap
        toast({title: "Beklenmedik Hata", description: `Veriler yüklenirken bir sorun oluştu: ${specificError.message}`, variant: "destructive"});
    } finally {
        setIsLoading(false);
    }
  };

  // 3. useEffect'i fetchData ile GÜNCELLEYELİM
  useEffect(() => {
    fetchData();
  }, [params.id]); // params.id değiştiğinde fetchData'yı tekrar çağır


  // ----- ŞİMDİLİK DİĞER FONKSİYONLARI (handleAddComment, handleVehicleToggleGarage, handleRentNow) VE JSX İÇİN GEREKLİ DEĞİŞKENLERİ EKLEMİYORUZ -----
  // ----- ONLARI BİR SONRAKİ ADIMDA EKLEYECEĞİZ -----


  // Mevcut yükleniyor ve araç yok durumları
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)] text-xl">
        <Loader2 className="mr-2 h-6 w-6 animate-spin" /> Veriler Yükleniyor...
      </div>
    );
  }
  
  if (!vehicle) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-xl p-6 text-center">
        <p className="text-red-500 font-semibold mb-2">Araç Bilgisi Bulunamadı!</p>
        <p className="text-gray-600 text-base">Aradığınız araç mevcut değil veya bir sorun oluştu.</p>
        <Link href="/araclar" className="mt-6 px-6 py-2 bg-[#6A3C96] text-white rounded-md hover:bg-[#58307d] transition-colors">
            Tüm Araçlara Göz At
        </Link>
      </div>
    );
  }

  // ----- MİNİMAL JSX (Sadece temel araç ismini gösterelim) -----
  // Bu ana return satırı (Vercel loglarındaki hata veren satıra denk gelen)
  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          {vehicle.isim} (Minimal Test - Adım 1 Başarılı)
        </h1>
        <p className="text-gray-700">
          Eğer bu sayfayı görüyorsanız, state tanımlamaları ve temel fetchData fonksiyonu Vercel'de build hatası vermeden çalıştı.
        </p>
        <p className="mt-2 text-sm text-gray-500">
          Şimdi diğer fonksiyonları ve karmaşık değişkenleri adım adım ekleyerek hatanın kaynağını bulacağız.
        </p>
        <div className="mt-4">
            <h2 className="text-lg font-semibold">Mevcut State Değerleri (Test Amaçlı):</h2>
            <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-x-auto">
                {JSON.stringify({
                    selectedKm,
                    selectedSure,
                    isVehicleAddedToGarage,
                    variationsCount: variations.length,
                    commentsCount: comments.length,
                }, null, 2)}
            </pre>
        </div>
      </div>
    </div>
  );
}
