"use client"

import Link from "next/link"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"

export default function NavigationMenuDesktop() {
  return (
    <div className="hidden md:flex mt-4 border-t border-b py-2">
      <NavigationMenu className="mx-auto">
        <NavigationMenuList className="flex items-center justify-center space-x-2">

          {/* Kurumsal */}
          <NavigationMenuItem className="relative">
            <NavigationMenuTrigger>Kurumsal</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[300px] gap-3 p-4">
                <li><Link href="/kurumsal/hakkimizda" className="block p-2 rounded hover:bg-accent text-sm font-medium">Hakkımızda</Link></li>
                <li><Link href="/kurumsal/liderlik-ekibimiz" className="block p-2 rounded hover:bg-accent text-sm font-medium">Liderlik Ekibimiz</Link></li>
                <li><Link href="/kurumsal/odullerimiz" className="block p-2 rounded hover:bg-accent text-sm font-medium">Ödüllerimiz</Link></li>
                <li><Link href="/kurumsal/insan-kaynaklari" className="block p-2 rounded hover:bg-accent text-sm font-medium">İnsan Kaynakları</Link></li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>

          {/* Kiralama */}
          <NavigationMenuItem className="relative">
            <NavigationMenuTrigger>Kiralama</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[300px] gap-3 p-4">
                <li><Link href="/kiralama/kisa-sureli-kiralama" className="block p-2 rounded hover:bg-accent text-sm font-medium">Kısa Süreli Kiralama</Link></li>
                <li><Link href="/kiralama/kiralamanin-avantajlari" className="block p-2 rounded hover:bg-accent text-sm font-medium">Kiralamanın Avantajları</Link></li>
                <li><Link href="/kiralama/kurumsal-uyelik-programi" className="block p-2 rounded hover:bg-accent text-sm font-medium">Kurumsal Üyelik Programı</Link></li>
                <li><Link href="/kiralama/lenacars-avantajlari" className="block p-2 rounded hover:bg-accent text-sm font-medium">LenaCars Avantajları</Link></li>
                <li><Link href="/kiralama/tasarrufunu-hesapla" className="block p-2 rounded hover:bg-accent text-sm font-medium">Tasarrufunu Hesapla</Link></li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>

          {/* İkinci El */}
          <NavigationMenuItem className="relative">
            <NavigationMenuTrigger>İkinci El</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[300px] gap-3 p-4">
                <li><Link href="/ikinci-el/satilik-araclarimiz" className="block p-2 rounded hover:bg-accent text-sm font-medium">Satılık Araçlarımız</Link></li>
                <li><Link href="/ikinci-el/karli-arac-satis-hizmeti" className="block p-2 rounded hover:bg-accent text-sm font-medium">Karlı Araç Satış Hizmeti</Link></li>
                <li><Link href="/ikinci-el/tasit-kredisi" className="block p-2 rounded hover:bg-accent text-sm font-medium">Taşıt Kredisi</Link></li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>

          {/* Elektrikli Araçlar */}
          <NavigationMenuItem>
            <Link href="/elektrikli-araclar" legacyBehavior passHref>
              <NavigationMenuLink className={cn("px-4 py-2 text-sm font-medium hover:text-accent-foreground")}>
                Elektrikli Araçlar
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>

          {/* Basın Köşesi */}
          <NavigationMenuItem>
            <Link href="/basin-kosesi" legacyBehavior passHref>
              <NavigationMenuLink className={cn("px-4 py-2 text-sm font-medium hover:text-accent-foreground")}>
                Basın Köşesi
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>

          {/* LenaCars Bilgilendiriyor */}
          <NavigationMenuItem className="relative">
            <NavigationMenuTrigger>LenaCars Bilgilendiriyor</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[300px] gap-3 p-4">
                <li><Link href="/bilgilendiriyor/blog" className="block p-2 rounded hover:bg-accent text-sm font-medium">Blog</Link></li>
                <li><Link href="/bilgilendiriyor/vlog" className="block p-2 rounded hover:bg-accent text-sm font-medium">Vlog</Link></li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>

          {/* S.S.S. */}
          <NavigationMenuItem>
            <Link href="/sss" legacyBehavior passHref>
              <NavigationMenuLink className={cn("px-4 py-2 text-sm font-medium hover:text-accent-foreground")}>
                S.S.S.
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>

          {/* Nasıl Çalışır */}
          <NavigationMenuItem>
            <Link href="/nasil-calisir" legacyBehavior passHref>
              <NavigationMenuLink className={cn("px-4 py-2 text-sm font-medium hover:text-accent-foreground")}>
                Nasıl Çalışır
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>

        </NavigationMenuList>
      </NavigationMenu>
    </div>
  )
}
