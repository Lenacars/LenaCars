import { NextResponse } from "next/server";

export async function GET() {
  const token = process.env.HUBSPOT_PRIVATE_TOKEN;

  try {
    const response = await fetch("https://api.hubapi.com/crm/v3/owners", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("❌ HubSpot owner listesi hatası:", data);
      return NextResponse.json({ status: "error", data });
    }

    console.log("✅ Owner listesi:", data);
    return NextResponse.json(data);
  } catch (error) {
    console.error("❌ Bağlantı hatası:", error);
    return NextResponse.json({ status: "error", error });
  }
}
