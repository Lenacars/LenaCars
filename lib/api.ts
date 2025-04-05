export async function getVehicleById(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/vehicles/${id}`, {
    cache: "no-store",
  })

  if (!res.ok) {
    throw new Error("Araç bilgisi alınamadı.")
  }

  return res.json()
}
