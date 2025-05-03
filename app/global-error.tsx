"use client"

import { Button } from "@/components/ui/button"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
          <h1 className="text-3xl font-bold mb-4">Kritik Bir Hata Oluştu</h1>
          <p className="text-gray-600 mb-6">Üzgünüz, uygulamada kritik bir hata oluştu. Lütfen tekrar deneyin.</p>
          <p className="text-sm text-gray-500 mb-6">Hata detayı: {error?.message || "Bilinmeyen hata"}</p>
          <Button onClick={() => reset()} className="bg-[#5d3b8b] hover:bg-[#4a2e70] text-white px-4 py-2 rounded">
            Tekrar Dene
          </Button>
        </div>
      </body>
    </html>
  )
}

