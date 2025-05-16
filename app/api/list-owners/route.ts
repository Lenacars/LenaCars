import { NextResponse } from "next/server";

export async function GET() {
  const token = process.env.HUBSPOT_PRIVATE_TOKEN;

  const response = await fetch("https://api.hubapi.com/owners/v2/owners", {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();
  console.log("📋 HubSpot sahipleri:", data);
  return NextResponse.json(data);
}
