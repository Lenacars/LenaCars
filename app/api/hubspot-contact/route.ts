import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  const { email, firstname, lastname, phone, company } = body;
  const token = process.env.HUBSPOT_PRIVATE_TOKEN;

  if (!token) {
    return NextResponse.json({ error: "HubSpot token eksik" }, { status: 500 });
  }

  const hubspotRes = await fetch("https://api.hubapi.com/crm/v3/objects/contacts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      properties: {
        email,
        firstname,
        lastname,
        phone,
        company,
      },
    }),
  });

  const hubspotData = await hubspotRes.json();

  if (!hubspotRes.ok) {
    return NextResponse.json({ error: hubspotData }, { status: 500 });
  }

  return NextResponse.json({ success: true, data: hubspotData });
}
