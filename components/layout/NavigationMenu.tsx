"use client"

import Link from "next/link"
import { useState, useEffect } from "react"

export default function NavigationMenu() {
  const [isMobile, setIsMobile] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => {
      window.removeEventListener("resize", checkMobile)
    }
  }, [])

  const toggleDropdown = (menu: string) => {
    if (activeDropdown === menu) {
      setActiveDropdown(null)
    } else {
      setActiveDropdown(menu)
    }
  }

  // Mobil menü
  if (isMobile) {
    return (
      <nav className="bg-white border-t border-b border-gray-200">
        <div className="container mx-auto px-4">
          {/* Hamburger Menü */}
          <div className="flex justify-between items-center py-3">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="flex items-center text-gray-800">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
              <span className="ml-2 font-medium">Menü</span>
            </button>
          </div>

          {/* Mobil Menü */}
          {isMenuOpen && (
            <div className="py-2">
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => toggleDropdown("kurumsal")}
                    className="w-full flex justify-between items-center py-2 text-gray-800"
                  >
                    <span className="font-medium">Kurumsal</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-4 w-4 transition-transform ${activeDropdown === "kurumsal" ? "rotate-180" : ""}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {activeDropdown === "kurumsal" && (
                    <ul className="pl-4 mt-2 space-y-2 border-l-2 border-gray-200">
                      <li>
                        <Link href="/kurumsal/hakkimizda" className="block py-1 text-gray-600">
                          Hakkımızda
                        </Link>
                      </li>
                      <li>
                        <Link href="/kurumsal/insan-kaynaklari" className="block py-1 text-gray-600">
                          İnsan Kaynakları
                        </Link>
                      </li>
                      <li>
                        <Link href="/kurumsal/liderlik-ekibimiz" className="block py-1 text-gray-600">
                          Liderlik Ekibimiz
                        </Link>
                      </li>
                      <li>
                        <Link href="/kurumsal/odullerimiz" className="block py-1 text-gray-600">
                          Ödüllerimiz
                        </Link>
                      </li>
                    </ul>
                  )}
                </li>

                {/* Diğer menü öğeleri benzer şekilde eklenir */}
                <li>
                  <button
                    onClick={() => toggleDropdown("kiralama")}
                    className="w-full flex justify-between items-center py-2 text-gray-800"
                  >
                    <span className="font-medium">Kiralama</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-4 w-4 transition-transform ${activeDropdown === "kiralama" ? "rotate-180" : ""}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {activeDropdown === "kiralama" && (
                    <ul className="pl-4 mt-2 space-y-2 border-l-2 border-gray-200">
                      <li>
                        <Link
                          href="https://kirala.lenacars.com/"
                          className="block py-1 text-gray-600"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Kısa Süreli Kiralama
                        </Link>
                      </li>
                      <li>
                        <Link href="/kiralama/avantajlar" className="block py-1 text-gray-600">
                          Kiralamanın Avantajları
                        </Link>
                      </li>
                      <li>
                        <Link href="/kiralama/kurumsal-uyelik" className="block py-1 text-gray-600">
                          Kurumsal Üyelik Programı
                        </Link>
                      </li>
                      <li>
                        <Link href="/kiralama/lenacars-avantajlari" className="block py-1 text-gray-600">
                          LenaCars Avantajları
                        </Link>
                      </li>
                      <li>
                        <Link href="/kiralama/tasarruf-hesapla" className="block py-1 text-gray-600">
                          Tasarrufunu Hesapla
                        </Link>
                      </li>
                    </ul>
                  )}
                </li>

                <li>
                  <Link href="/elektrikli-araclar" className="block py-2 text-gray-800 font-medium">
                    Elektrikli Araçlar
                  </Link>
                </li>

                <li>
                  <Link href="/basin-kosesi" className="block py-2 text-gray-800 font-medium">
                    Basın Köşesi
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </div>
      </nav>
    )
  }

  // Masaüstü menü
  return (
    <nav className="bg-white border-t border-b border-gray-200">
      <div className="container mx-auto px-4">
        <ul className="flex flex-wrap justify-center md:justify-start space-x-1 md:space-x-6">
          <li className="relative group py-4">
            <Link
              href="/kurumsal"
              className="flex items-center text-gray-800 hover:text-[#6A3C96] font-medium transition-colors"
            >
              Kurumsal
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 ml-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </Link>
            <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
              <ul className="py-2">
                <li>
                  <Link
                    href="/kurumsal/hakkimizda"
                    className="block px-4 py-2 text-gray-800 hover:bg-[#6A3C96] hover:text-white"
                  >
                    Hakkımızda
                  </Link>
                </li>
                <li>
                  <Link
                    href="/kurumsal/insan-kaynaklari"
                    className="block px-4 py-2 text-gray-800 hover:bg-[#6A3C96] hover:text-white"
                  >
                    İnsan Kaynakları
                  </Link>
                </li>
                <li>
                  <Link
                    href="/kurumsal/liderlik-ekibimiz"
                    className="block px-4 py-2 text-gray-800 hover:bg-[#6A3C96] hover:text-white"
                  >
                    Liderlik Ekibimiz
                  </Link>
                </li>
                <li>
                  <Link
                    href="/kurumsal/odullerimiz"
                    className="block px-4 py-2 text-gray-800 hover:bg-[#6A3C96] hover:text-white"
                  >
                    Ödüllerimiz
                  </Link>
                </li>
              </ul>
            </div>
          </li>

          <li className="relative group py-4">
            <Link
              href="/kiralama"
              className="flex items-center text-gray-800 hover:text-[#6A3C96] font-medium transition-colors"
            >
              Kiralama
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 ml-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </Link>
            <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
              <ul className="py-2">
                <li>
                  <Link
                    href="https://kirala.lenacars.com/"
                    className="block px-4 py-2 text-gray-800 hover:bg-[#6A3C96] hover:text-white"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Kısa Süreli Kiralama
                  </Link>
                </li>
                <li>
                  <Link
                    href="/kiralama/avantajlar"
                    className="block px-4 py-2 text-gray-800 hover:bg-[#6A3C96] hover:text-white"
                  >
                    Kiralamanın Avantajları
                  </Link>
                </li>
                <li>
                  <Link
                    href="/kiralama/kurumsal-uyelik"
                    className="block px-4 py-2 text-gray-800 hover:bg-[#6A3C96] hover:text-white"
                  >
                    Kurumsal Üyelik Programı
                  </Link>
                </li>
                <li>
                  <Link
                    href="/kiralama/lenacars-avantajlari"
                    className="block px-4 py-2 text-gray-800 hover:bg-[#6A3C96] hover:text-white"
                  >
                    LenaCars Avantajları
                  </Link>
                </li>
                <li>
                  <Link
                    href="/kiralama/tasarruf-hesapla"
                    className="block px-4 py-2 text-gray-800 hover:bg-[#6A3C96] hover:text-white"
                  >
                    Tasarrufunu Hesapla
                  </Link>
                </li>
              </ul>
            </div>
          </li>

          <li className="relative group py-4">
            <Link
              href="/ikinci-el"
              className="flex items-center text-gray-800 hover:text-[#6A3C96] font-medium transition-colors"
            >
              İkinci El
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 ml-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </Link>
            <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
              <ul className="py-2">
                <li>
                  <Link
                    href="/ikinci-el/satilik-araclar"
                    className="block px-4 py-2 text-gray-800 hover:bg-[#6A3C96] hover:text-white"
                  >
                    Satılık Araçlar
                  </Link>
                </li>
                <li>
                  <Link
                    href="/ikinci-el/aracimi-sat"
                    className="block px-4 py-2 text-gray-800 hover:bg-[#6A3C96] hover:text-white"
                  >
                    Aracımı Sat
                  </Link>
                </li>
              </ul>
            </div>
          </li>

          <li className="relative group py-4">
            <Link
              href="/lenacars-bilgilendiriyor"
              className="flex items-center text-gray-800 hover:text-[#6A3C96] font-medium transition-colors"
            >
              LenaCars Bilgilendiriyor
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 ml-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </Link>
            <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
              <ul className="py-2">
                <li>
                  <Link
                    href="/lenacars-bilgilendiriyor/blog"
                    className="block px-4 py-2 text-gray-800 hover:bg-[#6A3C96] hover:text-white"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="/lenacars-bilgilendiriyor/haberler"
                    className="block px-4 py-2 text-gray-800 hover:bg-[#6A3C96] hover:text-white"
                  >
                    Haberler
                  </Link>
                </li>
              </ul>
            </div>
          </li>

          <li className="py-4">
            <Link
              href="/elektrikli-araclar"
              className="text-gray-800 hover:text-[#6A3C96] font-medium transition-colors"
            >
              Elektrikli Araçlar
            </Link>
          </li>

          <li className="py-4">
            <Link href="/basin-kosesi" className="text-gray-800 hover:text-[#6A3C96] font-medium transition-colors">
              Basın Köşesi
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}
