import { NextResponse } from "next/server";
import { renderToBuffer, Font } from "@react-pdf/renderer";
import { createClient } from "@supabase/supabase-js";
import { TeklifPdf } from "@/components/TeklifPdf";
import path from "path";
import { readFileSync } from "fs";

// ✅ FONT KAYDI (Türkçe karakterler için)
Font.register({
  family: "DejaVu",
  src: readFileSync(
    path.join(process.cwd(), "public", "fonts", "DejaVuSans.ttf")
  ),
});

// ✅ Supabase sunucu bağlantısı
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { vehicleIds, userId } = body;

    if (!vehicleIds || vehicleIds.length === 0) {
      return NextResponse.json(
        { error: "Araç ID'leri belirtilmedi." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("Araclar")
      .select("id, isim, fiyat, model_yili, km, sure")
      .in("id", vehicleIds);

    if (error || !data || data.length === 0) {
      return NextResponse.json(
        { error: "Araç bilgileri alınamadı veya bulunamadı." },
        { status: 500 }
      );
    }

    const { data: userProfile, error: userError } = await supabase
      .from("kullanicilar")
      .select("ad, soyad, firma")
      .eq("id", userId)
      .single();

    if (userError || !userProfile) {
      return NextResponse.json(
        { error: "Kullanıcı bilgileri alınamadı." },
        { status: 500 }
      );
    }

    // ✅ PDF Oluştur
    const pdfBuffer = await renderToBuffer(
      TeklifPdf({
        vehicles: data,
        customerName: `${userProfile.ad} ${userProfile.soyad}`,
      })
    );

    const teklifTarihi = new Date().toISOString().slice(0, 10);
    const teklifNo = Math.floor(1000 + Math.random() * 9000);

    const musteriIsmi = `${userProfile.ad} ${userProfile.soyad}`
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9\-]/g, "");

    const fileName = `teklifler/${musteriIsmi}-${teklifTarihi}-Teklif-${teklifNo}.pdf`;

    const { error: uploadError } = await supabase.storage
      .from("pdf-teklif")
      .upload(fileName, pdfBuffer, {
        contentType: "application/pdf",
        upsert: true,
      });

    if (uploadError) {
      console.error("PDF upload hatası:", uploadError);
      return NextResponse.json(
        { error: "PDF Supabase Storage'a yüklenemedi." },
        { status: 500 }
      );
    }

    const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/pdf-teklif/${fileName}`;

    const { error: insertError } = await supabase
      .from("teklif_dosyalar")
      .insert({
        kullanici_id: userId,
        pdf_url: publicUrl,
        ad: userProfile.ad || null,
        soyad: userProfile.soyad || null,
        firma: userProfile.firma || null,
      });

    if (insertError) {
      console.error("teklif_dosyalar tablosuna ekleme hatası:", insertError);
      return NextResponse.json(
        { error: "teklif_dosyalar tablosuna kayıt eklenemedi." },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: publicUrl });
  } catch (err) {
    console.error("PDF oluşturma hatası:", err);
    return NextResponse.json(
      { error: "PDF oluşturulamadı." },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ message: "Teklif PDF API çalışıyor!" });
}
