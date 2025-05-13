import { NextResponse } from "next/server";
import { renderToBuffer, Font } from "@react-pdf/renderer";
import { createClient } from "@supabase/supabase-js";
import { TeklifPdf } from "@/components/TeklifPdf";
import { readFileSync } from "fs";
import { join } from "path";

let isFontRegistered = false;

function registerFontOnce() {
  if (!isFontRegistered) {
    try {
      const fontPath = join(process.cwd(), "app", "fonts", "OpenSans-Regular.ttf");
      const fontData = readFileSync(fontPath);
      Font.register({ family: "OpenSans", src: fontData });
      console.log("✅ OpenSans fontu başarıyla yüklendi.");
      isFontRegistered = true;
    } catch (err) {
      console.error("❌ Font yükleme hatası:", err);
      throw err; // PDF üretimini durdurur
    }
  }
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    registerFontOnce();

    const body = await req.json();
    const { vehicleIds, userId } = body;

    if (!vehicleIds || !userId) {
      console.error("🚫 Eksik parametre: vehicleIds veya userId boş.");
      return NextResponse.json({ error: "Eksik veri" }, { status: 400 });
    }

    const { data: vehicles, error } = await supabase
      .from("Araclar")
      .select("id, isim, fiyat, vites, yakit_turu, km")
      .in("id", vehicleIds);

    if (error || !vehicles || vehicles.length === 0) {
      console.error("❌ Araçlar alınamadı:", error);
      return NextResponse.json({ error: "Araç bilgisi alınamadı." }, { status: 500 });
    }

    const { data: userProfile, error: userError } = await supabase
      .from("kullanicilar")
      .select("ad, soyad, firma")
      .eq("id", userId)
      .single();

    if (userError || !userProfile) {
      console.error("❌ Kullanıcı bilgisi alınamadı:", userError);
      return NextResponse.json({ error: "Kullanıcı bilgisi alınamadı." }, { status: 500 });
    }

    let pdfBuffer;
    try {
      pdfBuffer = await renderToBuffer(TeklifPdf({ vehicles }));
      console.log("✅ PDF başarıyla oluşturuldu.");
    } catch (renderErr) {
      console.error("❌ PDF render hatası:", renderErr);
      return NextResponse.json({ error: "PDF oluşturulamadı." }, { status: 500 });
    }

    const date = new Date().toISOString().slice(0, 10);
    const teklifNo = Math.floor(1000 + Math.random() * 9000);
    const musteriIsmi = `${userProfile.ad} ${userProfile.soyad}`.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9\-]/g, "");
    const fileName = `teklifler/${musteriIsmi}-${date}-Teklif-${teklifNo}.pdf`;

    const { error: uploadError } = await supabase.storage
      .from("pdf-teklif")
      .upload(fileName, pdfBuffer, {
        contentType: "application/pdf",
        upsert: true,
      });

    if (uploadError) {
      console.error("❌ PDF Supabase'e yüklenemedi:", uploadError);
      return NextResponse.json({ error: "PDF yükleme hatası" }, { status: 500 });
    }

    const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/pdf-teklif/${fileName}`;

    const { error: dbError } = await supabase.from("teklif_dosyalar").insert({
      kullanici_id: userId,
      pdf_url: publicUrl,
      ad: userProfile.ad,
      soyad: userProfile.soyad,
      firma: userProfile.firma,
    });

    if (dbError) {
      console.error("❌ PDF veritabanına kaydedilemedi:", dbError);
      return NextResponse.json({ error: "Veritabanı hatası" }, { status: 500 });
    }

    console.log("✅ PDF başarıyla Supabase'e yüklendi ve kaydedildi:", publicUrl);
    return NextResponse.json({ url: publicUrl });

  } catch (err) {
    console.error("❌ Genel PDF oluşturma hatası:", err);
    return NextResponse.json({ error: "Sunucu hatası: PDF oluşturulamadı." }, { status: 500 });
  }
}
