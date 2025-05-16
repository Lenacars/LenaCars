// lib/hubspot.ts
export async function createHubspotContact({
  ad,
  soyad,
  email,
  telefon,
  firma,
}: {
  ad: string;
  soyad: string;
  email: string;
  telefon: string;
  firma?: string | null;
}) {
  try {
    const token = process.env.HUBSPOT_PRIVATE_TOKEN;
    const response = await fetch("https://api.hubapi.com/crm/v3/objects/contacts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
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
      const err = await response.json();
      console.error("❌ HubSpot API Error:", err);
    } else {
      console.log("✅ HubSpot kaydı başarılı");
    }
  } catch (error) {
    console.error("❌ HubSpot bağlantı hatası:", error);
  }
}
