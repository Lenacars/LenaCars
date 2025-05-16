// app/api/hubspot-contact/route.ts

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { ad, soyad, email, telefon, firma, ownerId, accessToken } = body;

    const response = await fetch("https://api.hubapi.com/crm/v3/objects/contacts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`, // OAuth token
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        properties: {
          email,
          firstname: ad,
          lastname: soyad,
          phone: telefon,
          company: firma || "",
          hubspot_owner_id: ownerId, // 🔥 Owner ataması burada
        },
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("❌ HubSpot API Hatası:", result);
      return NextResponse.json({ error: result }, { status: 500 });
    }

    return NextResponse.json({ success: true, result });
  } catch (err) {
    console.error("❌ Sunucu hatası:", err);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
