export async function getVehicleById(id: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Araç bilgisi alınamadı.");
    }

    const data = await res.json();

    const found = data.find((item: any) => String(item.id) === id);

    if (!found) {
      console.warn("❗️Araç bulunamadı:", id);
    }

    return found;
  } catch (error) {
    console.error("getVehicleById hata:", error);
    return null;
  }
}

export async function getAllVehicles() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Araç listesi alınamadı.");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("getAllVehicles hata:", error);
    return [];
  }
}
