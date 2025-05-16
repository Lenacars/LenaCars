import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { ad, soyad, email, telefon, firma } = body;

    const response = await fetch("https://api.hubapi.com/crm/v3/objects/contacts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HUBSPOT_PRIVATE_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        properties: {
          email,
          firstname: ad,
          lastname: soyad,
          phone: telefon,
          company: firma || "",
        },
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("❌ HubSpot API Hatası:", error);
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("❌ Sunucu hatası:", err);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
