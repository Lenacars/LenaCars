"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Hata loglaması
    console.error("Error occurred:", error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-4">
      <h2 className="text-2xl font-bold mb-4">Bir şeyler yanlış gitti!</h2>
      <p className="text-muted-foreground mb-6">Üzgünüz, bir hata oluştu. Lütfen tekrar deneyin.</p>
      <p className="text-sm text-gray-500 mb-6">Hata detayı: {error?.message || "Bilinmeyen hata"}</p>
      <Button onClick={() => reset()} className="bg-[#5d3b8b] hover:bg-[#4a2e70]">
        Tekrar Dene
      </Button>
    </div>
  )
}

