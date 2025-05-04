import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { supabase } from "@/lib/supabase-server";  // 🔥 server versiyonunu kullan
import { TeklifPdf } from "@/components/TeklifPdf";
import React from "react";

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
      .select("id, isim, fiyat")
      .in("id", vehicleIds);

    // 🚨 HEM HATA HEM DE BOŞ DATA KONTROLÜ:
    if (error || !data || data.length === 0) {
      return NextResponse.json(
        { error: "Araç bilgileri alınamadı veya eşleşen araç bulunamadı." },
        { status: 500 }
      );
    }

    const element = React.createElement(TeklifPdf, { vehicles: data });
    const pdfBuffer = await renderToBuffer(element);

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "inline; filename=teklif.pdf",
      },
    });
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
