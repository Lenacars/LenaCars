"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu } from 'lucide-react'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { menuItems, singleMenuItems } from "@/lib/menu-data"

export default function NavigationMenuComponent() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Masaüstü Menüsü */}
      <div className="hidden md:flex justify-center border-t border-b py-2">
        <NavigationMenu className="mx-auto">
          <NavigationMenuList className="space-x-6">
            {menuItems.map((menu) => (
              <NavigationMenuItem key={menu.title}>
                <NavigationMenuTrigger>{menu.title}</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[300px] gap-3 p-4">
                    {menu.items.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className="block p-2 rounded hover:bg-accent text-sm font-medium"
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            ))}
            
            {singleMenuItems.map((item) => (
              <NavigationMenuItem key={item.href}>
                <Link href={item.href} legacyBehavior passHref>
                  <NavigationMenuLink className={cn("px-4 py-2 text-sm font-medium hover:text-accent-foreground")}>
                    {item.label}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      {/* Mobil Menü */}
      <div className="md:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Menü</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[260px] sm:w-[300px] p-4">
            <nav className="flex flex-col gap-4">
              {menuItems.map((menu) => (
                <div key={menu.title}>
                  <p className="font-bold text-sm mb-1">{menu.title}</p>
                  <ul className="pl-2 space-y-1">
                    {menu.items.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={() => setIsOpen(false)}
                          className="text-sm text-muted-foreground hover:text-foreground"
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              
              {singleMenuItems.map((item) => (
                <Link 
                  key={item.href}
                  href={item.href} 
                  onClick={() => setIsOpen(false)}
                  className="text-sm font-medium"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}
