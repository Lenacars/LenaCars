import { NextResponse } from "next/server";
import { renderToBuffer, Font } from "@react-pdf/renderer";
import { createClient } from "@supabase/supabase-js";
import { TeklifPdf } from "@/components/TeklifPdf";
import fs from "fs";
import path from "path";

// ✅ Fontu doğrudan buffer ile kaydet
const fontPath = path.join(process.cwd(), "public", "fonts", "DejaVuSans.ttf");
const fontData = fs.readFileSync(fontPath);

Font.register({
  family: "DejaVu",
  src: fontData,
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { vehicleIds, userId } = body;

    if (!vehicleIds || !userId) {
      return NextResponse.json({ error: "Eksik veri gönderildi." }, { status: 400 });
    }

    const { data: vehicles, error: vehicleError } = await supabase
      .from("Araclar")
      .select("id, isim, fiyat, km, sure, model_yili")
      .in("id", vehicleIds);

    if (vehicleError || !vehicles) {
      return NextResponse.json({ error: "Araç bilgileri alınamadı." }, { status: 500 });
    }

    const { data: userProfile, error: userError } = await supabase
      .from("kullanicilar")
      .select("ad, soyad, firma")
      .eq("id", userId)
      .single();

    if (userError || !userProfile) {
      return NextResponse.json({ error: "Kullanıcı bulunamadı." }, { status: 500 });
    }

    const pdfBuffer = await renderToBuffer(
      TeklifPdf({
        vehicles,
        customerName: `${userProfile.ad} ${userProfile.soyad}`,
      })
    );

    const tarih = new Date().toISOString().slice(0, 10);
    const fileName = `teklifler/${userProfile.ad}-${tarih}-${Math.floor(Math.random() * 9000 + 1000)}.pdf`;

    const { error: uploadError } = await supabase.storage
      .from("pdf-teklif")
      .upload(fileName, pdfBuffer, {
        contentType: "application/pdf",
        upsert: true,
      });

    if (uploadError) {
      return NextResponse.json({ error: "PDF yüklenemedi." }, { status: 500 });
    }

    const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/pdf-teklif/${fileName}`;

    await supabase.from("teklif_dosyalar").insert({
      kullanici_id: userId,
      pdf_url: publicUrl,
      ad: userProfile.ad,
      soyad: userProfile.soyad,
      firma: userProfile.firma,
    });

    return NextResponse.json({ url: publicUrl });
  } catch (err) {
    console.error("🔴 PDF oluşturulurken hata:", err);
    return NextResponse.json({ error: "Sunucu hatası." }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: "PDF API çalışıyor!" });
}
