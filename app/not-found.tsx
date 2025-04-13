import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-4">
      <h2 className="text-3xl font-bold mb-4">404 - Sayfa Bulunamadı</h2>
      <p className="text-muted-foreground mb-6">Aradığınız sayfa bulunamadı veya taşınmış olabilir.</p>
      <Link href="/">
        <Button className="bg-[#5d3b8b] hover:bg-[#4a2e70]">Ana Sayfaya Dön</Button>
      </Link>
    </div>
  )
}

