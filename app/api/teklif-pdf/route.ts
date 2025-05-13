import { NextResponse } from "next/server";
import { renderToBuffer, Font } from "@react-pdf/renderer";
import { createClient } from "@supabase/supabase-js";
import { TeklifPdf } from "@/components/TeklifPdf";
import path from "path";
import { readFileSync } from "fs";

Font.register({
  family: "DejaVu",
  src: readFileSync(path.resolve(process.cwd(), "public/fonts/DejaVuSans.ttf")),
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { vehicleIds, userId } = body;

    if (!vehicleIds || vehicleIds.length === 0) {
      return NextResponse.json({ error: "Araç ID'leri eksik." }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("Araclar")
      .select("id, isim, fiyat, km, sure, model_yili")
      .in("id", vehicleIds);

    if (error || !data) {
      return NextResponse.json({ error: "Araçlar alınamadı." }, { status: 500 });
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
      TeklifPdf({ vehicles: data, customerName: userProfile.ad + " " + userProfile.soyad })
    );

    const tarih = new Date().toISOString().slice(0, 10);
    const dosya = `teklifler/${userProfile.ad}-${tarih}-${Math.floor(Math.random() * 10000)}.pdf`;

    const { error: uploadError } = await supabase.storage
      .from("pdf-teklif")
      .upload(dosya, pdfBuffer, {
        contentType: "application/pdf",
        upsert: true,
      });

    if (uploadError) {
      return NextResponse.json({ error: "PDF yüklenemedi." }, { status: 500 });
    }

    const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/pdf-teklif/${dosya}`;

    await supabase.from("teklif_dosyalar").insert({
      kullanici_id: userId,
      pdf_url: publicUrl,
      ad: userProfile.ad,
      soyad: userProfile.soyad,
      firma: userProfile.firma,
    });

    return NextResponse.json({ url: publicUrl });

  } catch (err) {
    console.error("🔴 Sunucu PDF oluşturma hatası:", err);
    return NextResponse.json({ error: "Sunucu hatası oluştu." }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: "PDF API hazır." });
}
