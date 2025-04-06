"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, ChevronDown } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { menuItems, singleMenuItems } from "@/lib/menu-data"

export default function NavigationMenuComponent() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Masaüstü Menüsü */}
      <div className="hidden md:flex justify-center border-t border-b py-2">
        <div className="flex items-center justify-center space-x-6">
          {menuItems.map((menu) => (
            <DropdownMenu key={menu.title}>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center px-4 py-2 text-sm font-medium hover:text-[#6A3C96] group">
                  {menu.title}
                  <ChevronDown className="ml-1 h-4 w-4 transition duration-200 group-data-[state=open]:rotate-180" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[300px]">
                {menu.items.map((item) => (
                  <DropdownMenuItem key={item.href} asChild>
                    <Link
                      href={item.href}
                      className="w-full p-2 rounded hover:bg-accent text-sm font-medium"
                    >
                      {item.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ))}
          
          {singleMenuItems.map((item) => (
            <Link 
              key={item.href}
              href={item.href}
              className="px-4 py-2 text-sm font-medium hover:text-[#6A3C96]"
            >
              {item.label}
            </Link>
          ))}
        </div>
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
