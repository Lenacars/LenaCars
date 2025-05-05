"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase-browser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, LogOut, Trash2, UploadCloud, Info } from "lucide-react";
import Link from "next/link";
import clsx from "clsx";

const tabs = [
  { key: "account", label: "Hesap Bilgileri" },
  { key: "favorites", label: "Favoriler" },
  { key: "offers", label: "Tekliflerim" },
  { key: "documents", label: "Evraklarım" },
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

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user?.id;
    if (!userId) return;

    const { data: profile } = await supabase
      .from("kullanicilar")
      .select("*")
      .eq("id", userId)
      .single();
    setUserData(profile);

    const { data: favs } = await supabase
      .from("favoriler")
      .select("*, araclar(*)")
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
    const userId = sessionData.session?.user?.id;
    if (!email || !userId) return;

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
      setMessage("Şifre güncellenemedi.");
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
        .from("documents")
        .upload(filePath, file);
      if (uploadError) {
        alert(`'${file.name}' yüklenemedi.`);
        continue;
      }

      const publicUrl = supabase.storage
        .from("documents")
        .getPublicUrl(filePath).data.publicUrl;
      await supabase.from("evraklar").insert({
        user_id: userData.id,
        file_name: file.name,
        file_url: publicUrl,
      });
    }

    setSelectedFiles(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    fetchUser();
  };

  const handleDeleteDocument = async (doc: any) => {
    const path = doc.file_url.split(
      "/storage/v1/object/public/documents/"
    )[1];
    await supabase.storage.from("documents").remove([path]);
    await supabase.from("evraklar").delete().eq("id", doc.id);
    fetchUser();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 flex gap-6">
      {/* Sol Menü */}
      <div className="w-64 space-y-4">
        <div className="text-center border p-4 rounded shadow-sm text-sm font-semibold text-gray-700">
          {userData?.ad} {userData?.soyad}
          {userData?.id && (
            <div className="text-xs text-gray-500">
              Kullanıcı ID: {userData.id}
            </div>
          )}
        </div>

        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={clsx(
              "w-full text-left px-4 py-2 rounded font-medium",
              activeTab === tab.key
                ? "bg-[#6A3C96] text-white"
                : "hover:bg-gray-100 text-gray-700"
            )}
          >
            {tab.label}
          </button>
        ))}

        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full mt-4 text-red-600 flex items-center justify-center gap-1 border-red-200 hover:bg-red-50"
        >
          <LogOut className="w-4 h-4" /> Çıkış Yap
        </Button>
      </div>

      {/* Sağ İçerik */}
      <div className="flex-1 space-y-6">
        <h1 className="text-3xl font-bold text-[#6A3C96]">Profilim</h1>

        {activeTab === "account" && (
          <Card>
            <CardHeader>
              <CardTitle>Kullanıcı Bilgileri</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p><strong>Ad Soyad:</strong> {userData?.ad} {userData?.soyad}</p>
              <p><strong>E-posta:</strong> {userData?.email}</p>
              <p><strong>Firma:</strong> {userData?.firma}</p>
              <p><strong>Kullanıcı ID:</strong> {userData?.id}</p>
            </CardContent>
          </Card>
        )}

        {activeTab === "favorites" && (
          <Card>
            <CardHeader><CardTitle>Favori Araçlarım</CardTitle></CardHeader>
            <CardContent>
              {favorites.length === 0 ? (
                <p>Favori listeniz boş.</p>
              ) : (
                <ul className="space-y-2">
                  {favorites.map((fav) => (
                    <li key={fav.id} className="border-b py-2">
                      <Link href={`/vehicles/${fav.araclar.id}`} className="text-[#6A3C96] hover:underline">
                        {fav.araclar.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === "offers" && (
          <Card>
            <CardHeader><CardTitle>Tekliflerim (PDF)</CardTitle></CardHeader>
            <CardContent>
              {offers.length === 0 ? (
                <p>Henüz PDF teklifiniz bulunmuyor.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {offers.map((offer) => {
                    const fileName = offer.pdf_url.split("/").pop();
                    const createdAt = new Date(offer.created_at).toLocaleDateString("tr-TR");

                    return (
                      <div key={offer.id} className="border rounded p-4 shadow-sm flex flex-col justify-between h-full">
                        <div className="mb-2 font-medium text-[#6A3C96] break-words">{fileName}</div>
                        <div className="text-sm text-gray-500 mb-2">Oluşturma: {createdAt}</div>
                        <a
                          href={offer.pdf_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-sm text-[#6A3C96] font-semibold hover:underline"
                        >
                          <Download className="w-4 h-4 mr-1" /> İndir
                        </a>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === "documents" && (
          <Card>
            <CardHeader><CardTitle>Evraklarım</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  ref={fileInputRef}
                  multiple
                  onChange={(e) => setSelectedFiles(e.target.files)}
                />
                <Button onClick={handleFileUpload} className="bg-[#6A3C96] text-white">
                  <UploadCloud className="w-4 h-4 mr-1" /> Yükle
                </Button>
              </div>

              <div className="flex items-center text-sm text-gray-500 italic gap-1">
                <Info className="w-4 h-4" /> Desteklenen dosya türleri: PDF, Word, Excel, ZIP, JPG, PNG ve diğer belgeler
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {documents.map((doc) => {
                  const ext = doc.file_name.split(".").pop()?.toLowerCase();
                  const icon = (() => {
                    if (!ext) return "📁";
                    if (["pdf"].includes(ext)) return "📄";
                    if (["doc", "docx"].includes(ext)) return "📝";
                    if (["xls", "xlsx", "csv"].includes(ext)) return "📊";
                    if (["jpg", "jpeg", "png", "webp"].includes(ext)) return "🖼️";
                    if (["zip", "rar", "7z"].includes(ext)) return "🗜️";
                    return "📁";
                  })();

                  return (
                    <div key={doc.id} className="border rounded p-4 shadow-sm flex flex-col">
                      <div className="text-4xl mb-2">{icon}</div>
                      <a href={doc.file_url} target="_blank" className="text-[#6A3C96] font-medium break-all hover:underline text-sm">
                        {doc.file_name}
                      </a>
                      <p className="text-xs text-gray-500 mt-1">.{ext}</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteDocument(doc)}
                        className="text-red-500 border-red-300 hover:bg-red-50 mt-2"
                      >
                        <Trash2 className="w-4 h-4 mr-1" /> Sil
                      </Button>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "password" && (
          <Card>
            <CardHeader><CardTitle>Şifre Değiştir</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="oldPassword">Mevcut Şifre</Label>
                <Input id="oldPassword" type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="newPassword">Yeni Şifre</Label>
                <Input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
              </div>
              {message && <p className="text-sm text-red-500">{message}</p>}
              <Button onClick={handlePasswordChange} className="bg-[#6A3C96] text-white hover:bg-[#4a2e70]">
                Şifreyi Güncelle
              </Button>
            </CardContent>
          </Card>
        )}

      </div>
    </div>
  );
}
