"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"

const NavigationMenuDesktop = () => {
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

  return (
    <NavigationMenu>
      <NavigationMenuList>
        {menuItems.map((menu) => (
          <NavigationMenuItem key={menu.title}>
            <NavigationMenuTrigger>{menu.title}</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[300px] gap-3 p-4">
                {menu.items.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="block p-2 rounded hover:bg-accent text-sm font-medium">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        ))}

        <NavigationMenuItem>
          <Link href="/elektrikli-araclar" legacyBehavior passHref>
            <NavigationMenuLink className={cn("px-4 py-2 text-sm font-medium hover:text-accent-foreground")}>
              Elektrikli Araçlar
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link href="/basin-kosesi" legacyBehavior passHref>
            <NavigationMenuLink className={cn("px-4 py-2 text-sm font-medium hover:text-accent-foreground")}>
              Basın Köşesi
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link href="/sss" legacyBehavior passHref>
            <NavigationMenuLink className={cn("px-4 py-2 text-sm font-medium hover:text-accent-foreground")}>
              S.S.S.
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link href="/nasil-calisir" legacyBehavior passHref>
            <NavigationMenuLink className={cn("px-4 py-2 text-sm font-medium hover:text-accent-foreground")}>
              Nasıl Çalışır
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

export default NavigationMenuDesktop

