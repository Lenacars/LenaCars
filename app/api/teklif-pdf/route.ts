import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { createClient } from "@supabase/supabase-js";
import { TeklifPdf } from "@/components/TeklifPdf";

// Supabase sunucu tarafı bağlantısı
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

    // Supabase'den araç bilgilerini çek
    const { data, error } = await supabase
      .from("Araclar")
      .select("id, isim, fiyat, vites, yakit_turu, km")
      .in("id", vehicleIds);

    if (error || !data || data.length === 0) {
      return NextResponse.json(
        { error: "Araç bilgileri alınamadı veya bulunamadı." },
        { status: 500 }
      );
    }

    // PDF oluştur (!!! JSX DEĞİL FONKSİYON OLARAK ÇAĞIR !!!)
    const pdfBuffer = await renderToBuffer(
      TeklifPdf({ vehicles: data }) // ✅ JSX değil, function call
    );

    // Dosya adını belirle
    const fileName = `teklifler/teklif-${Date.now()}.pdf`;

    // Storage'a yükle (bucket: pdf-teklif)
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("pdf-teklif")
      .upload(fileName, pdfBuffer, {
        contentType: "application/pdf",
        upsert: true
      });

    if (uploadError) {
      console.error("PDF upload hatası:", uploadError);
      return NextResponse.json(
        { error: "PDF Supabase Storage'a yüklenemedi." },
        { status: 500 }
      );
    }

    // PUBLIC URL OLUŞTUR
    const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/pdf-teklif/${fileName}`;

    // ✅ TEKLİFLER tablosuna kaydet
    const { error: insertError } = await supabase
      .from("teklifler")
      .insert({
        user_id: userId,
        pdf_url: publicUrl  // 🔥 Doğru kolon adı
      });

    if (insertError) {
      console.error("Teklifler tablosuna ekleme hatası:", insertError);
      return NextResponse.json(
        { error: "Teklifler tablosuna kayıt eklenemedi." },
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
