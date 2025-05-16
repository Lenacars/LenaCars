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
    console.log("📤 HubSpot için kullanıcı verisi gönderiliyor:", {
      ad,
      soyad,
      email,
      telefon,
      firma,
    });

    const token = process.env.HUBSPOT_PRIVATE_TOKEN;

    if (!token) {
      console.error("❌ HUBSPOT_PRIVATE_TOKEN bulunamadı!");
      return;
    }

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
          hubspot_owner_id: "26066921" // ✅ userId
        },
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("❌ HubSpot API Hatası:", result);
    } else {
      console.log("✅ HubSpot kaydı başarılı:", result);
    }
  } catch (error) {
    console.error("❌ HubSpot bağlantı hatası:", error);
  }
}
