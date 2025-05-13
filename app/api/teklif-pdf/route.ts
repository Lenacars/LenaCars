import { NextResponse } from "next/server";
import { renderToBuffer, Font } from "@react-pdf/renderer";
import { createClient } from "@supabase/supabase-js";
import { TeklifPdf } from "@/components/TeklifPdf";
import { readFileSync } from "fs";
import { join } from "path";

// Fontu kaydet
const fontPath = join(process.cwd(), "public", "fonts", "OpenSans-Regular.ttf");
const fontData = readFileSync(fontPath);
Font.register({ family: "OpenSans", src: fontData });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { vehicleIds, userId } = body;

    const { data, error } = await supabase
      .from("Araclar")
      .select("id, isim, fiyat, vites, yakit_turu, km")
      .in("id", vehicleIds);

    if (error || !data) {
      return NextResponse.json({ error: "Araç bilgileri alınamadı." }, { status: 500 });
    }

    const { data: userProfile, error: userError } = await supabase
      .from("kullanicilar")
      .select("ad, soyad, firma")
      .eq("id", userId)
      .single();

    if (userError || !userProfile) {
      return NextResponse.json({ error: "Kullanıcı bilgileri alınamadı." }, { status: 500 });
    }

    const pdfBuffer = await renderToBuffer(TeklifPdf({ vehicles: data }));

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
    return NextResponse.json({ error: "PDF oluşturulamadı." }, { status: 500 });
  }
}
