// components/layout/NavigationMenuMobile.tsx
"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"

// Menü verisi
const menuItems = [
  // ... mevcut menü verileri
];

const singleMenuItems = [
  // ... mevcut tek menü öğeleri
];

export default function NavigationMenuMobile() {
  const [isOpen, setIsOpen] = useState(false)

  return (
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
  )
}
