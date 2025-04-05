export async function getVehicleById(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
    cache: "no-store",
  })

  if (!res.ok) {
    throw new Error("Araç bilgisi alınamadı.")
  }

  const data = await res.json()

  // ID'ye göre filtreleme yapıyoruz
  return data.find((item: any) => String(item.id) === id)
}
