"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase-browser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, LogOut, Trash2, UploadCloud, Info, CreditCard } from "lucide-react"; // CreditCard ikonu eklendi
import Link from "next/link";
import clsx from "clsx";

// 1. ADIM: tabs dizisini güncelle
const tabs = [
  { key: "account", label: "Hesap Bilgileri" },
  { key: "favorites", label: "Favoriler" },
  { key: "offers", label: "Tekliflerim" },
  { key: "documents", label: "Evraklarım" },
  { key: "payment", label: "Ödeme Yap" }, // <--- Yeni sekme eklendi
  { key: "password", label: "Şifre Değiştir" },
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("account");
  const [userData, setUserData] = useState<any>(null);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [offers, setOffers] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // 2. ADIM: useState bloklarının altına ekle
  const [amount, setAmount] = useState(""); // Ödeme tutarı
  const [iframeSrc, setIframeSrc] = useState(""); // iframe kaynağı

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user?.id;
    if (!userId) {
      // Kullanıcı yoksa ana sayfaya veya giriş sayfasına yönlendirilebilir
      // window.location.href = "/giris";
      return;
    }

    const { data: profile } = await supabase
      .from("kullanicilar")
      .select("*")
      .eq("id", userId)
      .single();
    setUserData(profile);

    const { data: favs } = await supabase
      .from("favoriler")
      .select("*, araclar(id, title)") // Sadece gerekli alanları seçmek daha iyi olabilir
      .eq("user_id", userId);
    setFavorites(favs || []);

    const { data: pdfs } = await supabase
      .from("pdfteklifler")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    setOffers(pdfs || []);

    const { data: evraks } = await supabase
      .from("evraklar")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    setDocuments(evraks || []);
  };

  const handlePasswordChange = async () => {
    setMessage("");
    const { data: sessionData } = await supabase.auth.getSession();
    const email = sessionData.session?.user?.email;
    if (!email) { // userId kontrolü de eklenebilir ama email üzerinden işlem yapılıyor
        setMessage("Kullanıcı e-postası bulunamadı.");
        return;
    }

    if (!oldPassword || !newPassword) {
        setMessage("Lütfen tüm şifre alanlarını doldurun.");
        return;
    }

    const loginAttempt = await supabase.auth.signInWithPassword({
      email,
      password: oldPassword,
    });
    if (loginAttempt.error) {
      setMessage("Mevcut şifre hatalı.");
      return;
    }

    const updateResult = await supabase.auth.updateUser({
      password: newPassword,
    });
    if (updateResult.error) {
      setMessage(`Şifre güncellenemedi: ${updateResult.error.message}`);
    } else {
      setMessage("Şifre başarıyla güncellendi.");
      setOldPassword("");
      setNewPassword("");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const handleFileUpload = async () => {
    if (!selectedFiles || !userData?.id) return;

    for (const file of Array.from(selectedFiles)) {
      const filePath = `evraklar/${userData.id}/${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("documents") // Bucket adınızın "documents" olduğundan emin olun
        .upload(filePath, file);
      if (uploadError) {
        alert(`'${file.name}' yüklenemedi: ${uploadError.message}`);
        continue;
      }

      const { data: publicUrlData } = supabase.storage
        .from("documents")
        .getPublicUrl(filePath);

      if (!publicUrlData?.publicUrl) {
        alert(`'${file.name}' için genel URL alınamadı.`);
        continue;
      }

      await supabase.from("evraklar").insert({
        user_id: userData.id,
        file_name: file.name,
        file_url: publicUrlData.publicUrl,
      });
    }

    setSelectedFiles(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    fetchUser(); // Evrak listesini güncelle
  };

  const handleDeleteDocument = async (doc: any) => {
    // URL'den path'i doğru şekilde çıkarmak önemli
    // Örnek URL: https://<project_id>.supabase.co/storage/v1/object/public/documents/evraklar/<user_id>/<file_name>
    // Path: evraklar/<user_id>/<file_name>
    try {
      const urlParts = new URL(doc.file_url);
      const path = urlParts.pathname.split("/documents/")[1]; // "documents/" bucket adından sonrasını alır
      if (!path) {
        throw new Error("Dosya yolu çıkarılamadı.");
      }

      const { error: storageError } = await supabase.storage.from("documents").remove([path]);
      if (storageError) throw storageError;

      const { error: dbError } = await supabase.from("evraklar").delete().eq("id", doc.id);
      if (dbError) throw dbError;

      fetchUser(); // Listeyi güncelle
    } catch (error: any) {
      console.error("Evrak silinirken hata:", error.message);
      alert(`Evrak silinemedi: ${error.message}`);
    }
  };

  // 3. ADIM: handlePaytrIframe fonksiyonu ekle (API çağrısı simüle)
  const handlePaytrIframe = async () => {
    if (!userData || !amount || parseFloat(amount) <= 0) {
      setMessage("Lütfen geçerli bir ödeme tutarı girin.");
      setIframeSrc(""); // Hata durumunda iframe'i temizle
      return;
    }
    setMessage(""); // Önceki mesajları temizle

    try {
      // GERÇEK KULLANIM: "/api/paytr-token" gibi bir backend endpoint'ine istek atılmalı.
      // Bu endpoint PayTR'a istek atıp token almalı ve iframe URL'ini oluşturmalı.
      // Bu örnekte bu kısım SİMÜLE EDİLMİŞTİR.
      // const response = await fetch("/api/paytr-token", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({
      //     user_id: userData.id,
      //     user_name: `${userData.ad} ${userData.soyad}`,
      //     user_email: userData.email,
      //     user_ip: "KULLANICI_IP_ADRESI", // Backend'de alınmalı
      //     payment_amount: parseFloat(amount) * 100, // Kuruş cinsinden
      //     // Diğer gerekli PayTR parametreleri
      //   }),
      // });

      // if (!response.ok) {
      //   const errorData = await response.json();
      //   throw new Error(errorData.message || "PayTR token alınamadı.");
      // }
      // const { iframe_token } = await response.json();
      // const paytrIframeUrl = `https://www.paytr.com/odeme/guvenli/${iframe_token}`;
      // setIframeSrc(paytrIframeUrl);

      // --- SİMÜLASYON BAŞLANGICI ---
      // Gerçek bir token ve URL yerine geçici bir placeholder veya test URL'i kullanıyoruz.
      // Gerçek entegrasyonda bu kısım yukarıdaki gibi backend çağrısıyla değiştirilmelidir.
      console.log("Simüle edilen PayTR token isteği:", {
        userId: userData.id,
        amount: parseFloat(amount) * 100,
      });
      const fakeToken = "testtoken123"; // Bu sadece bir placeholder
      const simuleIframeUrl = `https://www.paytr.com/odeme/guvenli/${fakeToken}`; // Bu URL gerçek değil!
      setMessage("Ödeme arayüzü yükleniyor (Simülasyon)... Gerçek entegrasyonda burası PayTR iframe'i olacak.");
      setIframeSrc(simuleIframeUrl); // Simüle edilmiş URL
      // --- SİMÜLASYON SONU ---

    } catch (error: any) {
      console.error("PayTR iframe oluşturma hatası:", error.message);
      setMessage(`Ödeme arayüzü yüklenemedi: ${error.message}`);
      setIframeSrc("");
    }
  };


  if (!userData && activeTab !== "account") { // userData yüklenene kadar diğer tabları gösterme (opsiyonel)
    // Veya bir yükleniyor durumu gösterilebilir.
    // Şimdilik, kullanıcı bilgileri yüklenmeden diğer tablara geçişi engellemek için
    // Eğer kullanıcı yoksa (örneğin token süresi dolmuşsa), fetchUser içinde yönlendirme yapılabilir.
  }


  return (
    <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col md:flex-row gap-6 md:gap-8">
      {/* Sol Menü */}
      <div className="w-full md:w-64 space-y-2 md:space-y-3 flex-shrink-0">
        {userData && ( // userData yüklendikten sonra göster
            <div className="text-center border p-4 rounded-lg shadow-sm bg-white">
                <p className="text-lg font-semibold text-gray-800">{userData.ad} {userData.soyad}</p>
                {userData.id && (
                    <div className="text-xs text-gray-500 mt-1">
                    Kullanıcı ID: <span className="font-mono">{userData.id.substring(0,8)}...</span>
                    </div>
                )}
            </div>
        )}

        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={clsx(
              "w-full text-left px-4 py-2.5 rounded-md font-medium transition-colors duration-150 flex items-center gap-3",
              activeTab === tab.key
                ? "bg-[#6A3C96] text-white shadow-md"
                : "hover:bg-gray-100 text-gray-700"
            )}
          >
            {/* İkonlar eklenebilir (opsiyonel) */}
            {tab.key === "payment" && <CreditCard className="w-4 h-4" />}
            {tab.key === "documents" && <UploadCloud className="w-4 h-4" />}
            {/* Diğer tablar için de ikonlar eklenebilir */}
            {tab.label}
          </button>
        ))}

        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full mt-6 text-red-600 flex items-center justify-center gap-2 border-red-300 hover:bg-red-100 hover:text-red-700 transition-colors duration-150"
        >
          <LogOut className="w-4 h-4" /> Çıkış Yap
        </Button>
      </div>

      {/* Sağ İçerik */}
      <div className="flex-1 space-y-6">
        <h1 className="text-2xl md:text-3xl font-bold text-[#6A3C96] mb-6 border-b pb-3">
          {tabs.find(t => t.key === activeTab)?.label || "Profilim"}
        </h1>

        {activeTab === "account" && userData && ( // userData kontrolü eklendi
          <Card>
            <CardHeader>
              <CardTitle>Kullanıcı Bilgileri</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p><strong>Ad Soyad:</strong> {userData.ad} {userData.soyad}</p>
              <p><strong>E-posta:</strong> {userData.email}</p>
              <p><strong>Firma:</strong> {userData.firma || "-"}</p>
              <p><strong>Telefon:</strong> {userData.telefon || "-"}</p>
              <p><strong>Kullanıcı ID:</strong> <span className="font-mono text-xs">{userData.id}</span></p>
            </CardContent>
          </Card>
        )}

        {activeTab === "favorites" && userData && (
          <Card>
            <CardHeader><CardTitle>Favori Araçlarım</CardTitle></CardHeader>
            <CardContent>
              {favorites.length === 0 ? (
                <p className="text-sm text-gray-500">Favori listeniz boş.</p>
              ) : (
                <ul className="space-y-3">
                  {favorites.map((fav) => (
                    <li key={fav.id} className="border-b pb-3 last:border-b-0">
                      {fav.araclar ? (
                        <Link href={`/vehicles/${fav.araclar.id}`} className="text-[#6A3C96] hover:underline font-medium">
                          {fav.araclar.title || "Araç Adı Yok"}
                        </Link>
                      ) : (
                        <span className="text-gray-500">Favori araç bilgisi bulunamadı.</span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === "offers" && userData && (
          <Card>
            <CardHeader><CardTitle>Tekliflerim (PDF)</CardTitle></CardHeader>
            <CardContent>
              {offers.length === 0 ? (
                <p className="text-sm text-gray-500">Henüz PDF teklifiniz bulunmuyor.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {offers.map((offer) => {
                    const fileName = offer.pdf_url ? offer.pdf_url.split("/").pop() : "Dosya Adı Yok";
                    const createdAt = offer.created_at ? new Date(offer.created_at).toLocaleDateString("tr-TR", { day: '2-digit', month: '2-digit', year: 'numeric' }) : "-";

                    return (
                      <div key={offer.id} className="border rounded-lg p-4 shadow-sm flex flex-col justify-between h-full bg-white">
                        <div className="mb-2 font-semibold text-[#5a3080] break-all line-clamp-2" title={fileName}>{fileName}</div>
                        <div className="text-xs text-gray-500 mb-3">Oluşturma: {createdAt}</div>
                        {offer.pdf_url && (
                            <a
                            href={offer.pdf_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center px-3 py-1.5 text-xs bg-[#6A3C96] text-white rounded-md hover:bg-[#502b74] transition-colors font-medium"
                            >
                            <Download className="w-3.5 h-3.5 mr-1.5" /> İndir
                            </a>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === "documents" && userData && (
          <Card>
            <CardHeader><CardTitle>Evraklarım</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-4 border rounded-lg bg-gray-50">
                <Input
                  type="file"
                  ref={fileInputRef}
                  multiple
                  onChange={(e) => setSelectedFiles(e.target.files)}
                  className="flex-grow file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#6A3C96] file:text-white hover:file:bg-[#502b74]"
                />
                <Button onClick={handleFileUpload} className="bg-[#6A3C96] text-white hover:bg-[#502b74] w-full sm:w-auto">
                  <UploadCloud className="w-4 h-4 mr-2" /> Yükle
                </Button>
              </div>

              <div className="flex items-center text-xs text-gray-500 italic gap-1.5 p-2 bg-blue-50 border border-blue-200 rounded-md">
                <Info className="w-3.5 h-3.5 flex-shrink-0 text-blue-500" />
                Desteklenen dosya türleri: PDF, Word, Excel, ZIP, JPG, PNG vb. Maksimum dosya boyutu: 5MB.
              </div>

              {documents.length === 0 ? (
                <p className="text-sm text-gray-500 py-4 text-center">Henüz yüklenmiş evrağınız bulunmuyor.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {documents.map((doc) => {
                    const ext = doc.file_name ? doc.file_name.split(".").pop()?.toLowerCase() : "";
                    const icon = (() => {
                      if (!ext) return "📁"; // Bilinmeyen dosya
                      if (["pdf"].includes(ext)) return "📄"; // PDF
                      if (["doc", "docx"].includes(ext)) return "📝"; // Word
                      if (["xls", "xlsx", "csv"].includes(ext)) return "📊"; // Excel
                      if (["jpg", "jpeg", "png", "webp", "gif"].includes(ext)) return "🖼️"; // Resim
                      if (["zip", "rar", "7z"].includes(ext)) return "🗜️"; // Arşiv
                      return "📁"; // Diğer
                    })();

                    return (
                      <div key={doc.id} className="border rounded-lg p-3 shadow-sm flex flex-col items-center text-center bg-white">
                        <div className="text-5xl mb-2 opacity-75">{icon}</div>
                        <a href={doc.file_url} target="_blank" rel="noopener noreferrer" className="text-[#6A3C96] font-medium break-all hover:underline text-sm mb-1 line-clamp-2" title={doc.file_name}>
                          {doc.file_name}
                        </a>
                        <p className="text-xs text-gray-400 mb-2">.{ext}</p>
                        <Button
                          variant="ghost" // Daha az dikkat çekici bir sil butonu
                          size="sm"
                          onClick={() => handleDeleteDocument(doc)}
                          className="text-red-500 hover:bg-red-100 hover:text-red-600 w-full mt-auto"
                        >
                          <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Sil
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* 4. ADIM: Sağ içerik alanına SEKME İÇERİĞİ ekle */}
        {activeTab === "payment" && userData && (
          <Card>
            <CardHeader><CardTitle>Ödeme Yap</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="amount">Ödenecek Tutar (₺)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Örn: 100"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="mt-1"
                />
              </div>
              <Button onClick={handlePaytrIframe} className="bg-[#6A3C96] text-white hover:bg-[#502b74] w-full sm:w-auto">
                <CreditCard className="w-4 h-4 mr-2" /> Ödemeye Geç
              </Button>

              {message && <p className={clsx("text-sm p-3 rounded-md", message.includes("başarıyla") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700")}>{message}</p>}

              {iframeSrc && (
                <div className="mt-6 border-t pt-6">
                  <h4 className="text-lg font-semibold mb-3 text-gray-700">PayTR Ödeme Sayfası</h4>
                  <iframe
                    src={iframeSrc}
                    frameBorder="0"
                    width="100%"
                    height="600" // Yüksekliği artırıldı
                    title="PayTR Güvenli Ödeme Sayfası"
                    className="rounded-md shadow-md"
                  ></iframe>
                </div>
              )}
            </CardContent>
          </Card>
        )}


        {activeTab === "password" && userData && (
          <Card>
            <CardHeader><CardTitle>Şifre Değiştir</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="oldPassword">Mevcut Şifre</Label>
                <Input id="oldPassword" type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="newPassword">Yeni Şifre</Label>
                <Input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="mt-1" />
              </div>
              {message && <p className={clsx("text-sm p-3 rounded-md", message.includes("başarıyla") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700")}>{message}</p>}
              <Button onClick={handlePasswordChange} className="bg-[#6A3C96] text-white hover:bg-[#4a2e70]">
                Şifreyi Güncelle
              </Button>
            </CardContent>
          </Card>
        )}
        {!userData && <p className="text-center text-gray-500">Kullanıcı bilgileri yükleniyor veya kullanıcı bulunamadı...</p>}

      </div>
    </div>
  );
}
