"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

const menuItems = [
  {
    title: "Kurumsal",
    items: [
      { href: "/kurumsal/hakkimizda", label: "Hakkımızda" },
      { href: "/kurumsal/liderlik-ekibimiz", label: "Liderlik Ekibimiz" },
      { href: "/kurumsal/odullerimiz", label: "Ödüllerimiz" },
      { href: "/kurumsal/insan-kaynaklari", label: "İnsan Kaynakları" },
    ],
  },
  {
    title: "Kiralama",
    items: [
      { href: "/kiralama/kisa-sureli-kiralama", label: "Kısa Süreli Kiralama" },
      { href: "/kiralama/kiralamanin-avantajlari", label: "Kiralamanın Avantajları" },
      { href: "/kiralama/kurumsal-uyelik-programi", label: "Kurumsal Üyelik Programı" },
      { href: "/kiralama/lenacars-avantajlari", label: "LenaCars Avantajları" },
      { href: "/kiralama/tasarrufunu-hesapla", label: "Tasarrufunu Hesapla" },
    ],
  },
  {
    title: "İkinci El",
    items: [
      { href: "/ikinci-el/satilik-araclarimiz", label: "Satılık Araçlarımız" },
      { href: "/ikinci-el/karli-arac-satis-hizmeti", label: "Karlı Araç Satış Hizmeti" },
      { href: "/ikinci-el/tasit-kredisi", label: "Taşıt Kredisi" },
    ],
  },
  {
    title: "LenaCars Bilgilendiriyor",
    items: [
      { href: "/bilgilendiriyor/blog", label: "Blog" },
      { href: "/bilgilendiriyor/vlog", label: "Vlog" },
    ],
  },
]

export default function NavigationMenuMobile() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="md:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" aria-label="Mobil Menü">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>

        <SheetContent side="left" className="w-[300px] sm:w-[400px]">
          <nav className="flex flex-col gap-4 mt-6">
            {menuItems.map((menu) => (
              <div key={menu.title}>
                <p className="font-semibold text-sm">{menu.title}</p>
                <ul className="pl-2">
                  {menu.items.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className="text-sm block py-1"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <Link href="/elektrikli-araclar" onClick={() => setIsOpen(false)}>
              Elektrikli Araçlar
            </Link>
            <Link href="/basin-kosesi" onClick={() => setIsOpen(false)}>
              Basın Köşesi
            </Link>
            <Link href="/sss" onClick={() => setIsOpen(false)}>
              S.S.S.
            </Link>
            <Link href="/nasil-calisir" onClick={() => setIsOpen(false)}>
              Nasıl Çalışır
            </Link>
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  )
}

