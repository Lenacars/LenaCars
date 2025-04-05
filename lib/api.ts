export async function getVehicleById(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Araç bilgisi alınamadı.");
  }

  const data = await res.json();

  const found = data.find((item: any) => String(item.id) === id);

  if (!found) {
    console.log("Araç bulunamadı:", id); // ← bu satır hataları anlamak için çok faydalı
  }

  return found;
}
export async function getAllVehicles() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
    cache: "no-store",
  })

  if (!res.ok) {
    throw new Error("Araç listesi alınamadı.")
  }

  return res.json()
}
