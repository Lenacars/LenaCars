import type React from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { LayoutDashboard, Car, Users, FileText, Settings, ImageIcon, MessageSquare, LogOut } from "lucide-react"

export const metadata: Metadata = {
  title: "LenaCars Admin Panel",
  description: "LenaCars yönetim paneli",
}

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-[#5d3b8b] text-white">
        <div className="p-4 border-b border-[#4a2e70]">
          <Link href="/admin" className="text-xl font-bold">
            LenaCars Admin
          </Link>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <Link href="/admin" className="flex items-center p-2 rounded-md hover:bg-[#4a2e70]">
                <LayoutDashboard className="h-5 w-5 mr-3" />
                Dashboard
              </Link>
            </li>
            <li>
              <Link href="/admin/araclar" className="flex items-center p-2 rounded-md hover:bg-[#4a2e70]">
                <Car className="h-5 w-5 mr-3" />
                Araçlar
              </Link>
            </li>
            <li>
              <Link href="/admin/uyeler" className="flex items-center p-2 rounded-md hover:bg-[#4a2e70]">
                <Users className="h-5 w-5 mr-3" />
                Üyeler
              </Link>
            </li>
            <li>
              <Link href="/admin/siparisler" className="flex items-center p-2 rounded-md hover:bg-[#4a2e70]">
                <FileText className="h-5 w-5 mr-3" />
                Siparişler
              </Link>
            </li>
            <li>
              <Link href="/admin/medya" className="flex items-center p-2 rounded-md hover:bg-[#4a2e70]">
                <ImageIcon className="h-5 w-5 mr-3" />
                Medya
              </Link>
            </li>
            <li>
              <Link href="/admin/yorumlar" className="flex items-center p-2 rounded-md hover:bg-[#4a2e70]">
                <MessageSquare className="h-5 w-5 mr-3" />
                Yorumlar
              </Link>
            </li>
            <li>
              <Link href="/admin/ayarlar" className="flex items-center p-2 rounded-md hover:bg-[#4a2e70]">
                <Settings className="h-5 w-5 mr-3" />
                Ayarlar
              </Link>
            </li>
            <li className="pt-6 mt-6 border-t border-[#4a2e70]">
              <Link href="/logout" className="flex items-center p-2 rounded-md hover:bg-[#4a2e70]">
                <LogOut className="h-5 w-5 mr-3" />
                Çıkış Yap
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  )
}

