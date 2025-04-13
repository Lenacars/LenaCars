"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isKurumsalOpen, setIsKurumsalOpen] = useState(false)

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/">
                <Image src="/lenacars.svg" alt="LenaCars Logo" width={150} height={40} className="h-8 w-auto" />
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/"
                className="border-transparent text-gray-500 hover:border-[#6A3C96] hover:text-[#6A3C96] inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Ana Sayfa
              </Link>
              <div className="relative">
                <button
                  onClick={() => setIsKurumsalOpen(!isKurumsalOpen)}
                  className="border-transparent text-gray-500 hover:border-[#6A3C96] hover:text-[#6A3C96] inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Kurumsal
                  <svg
                    className="ml-2 h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                {isKurumsalOpen && (
                  <div className="absolute z-10 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-1">
                      <Link
                        href="https://kirala.lenacars.com/"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsKurumsalOpen(false)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Kısa Süreli Kiralama
                      </Link>
                      <Link
                        href="/kiralama/avantajlar"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsKurumsalOpen(false)}
                      >
                        Kiralamanın Avantajları
                      </Link>
                      <Link
                        href="/kiralama/kurumsal-uyelik"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsKurumsalOpen(false)}
                      >
                        Kurumsal Üyelik Programı
                      </Link>
                      <Link
                        href="/kiralama/lenacars-avantajlari"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsKurumsalOpen(false)}
                      >
                        LenaCars Avantajları
                      </Link>
                      <Link
                        href="/kiralama/tasarruf-hesapla"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsKurumsalOpen(false)}
                      >
                        Tasarrufunu Hesapla
                      </Link>
                    </div>
                  </div>
                )}
              </div>
              <Link
                href="/arac-kiralama"
                className="border-transparent text-gray-500 hover:border-[#6A3C96] hover:text-[#6A3C96] inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Araç Kiralama
              </Link>
              <Link
                href="/ikinci-el"
                className="border-transparent text-gray-500 hover:border-[#6A3C96] hover:text-[#6A3C96] inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                İkinci El
              </Link>
              <Link
                href="/iletisim"
                className="border-transparent text-gray-500 hover:border-[#6A3C96] hover:text-[#6A3C96] inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                İletişim
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <Link
              href="/arac-kiralama"
              className="bg-[#6A3C96] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#5a3080] transition-colors"
            >
              Hemen Kirala
            </Link>
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#6A3C96]"
            >
              <span className="sr-only">Menüyü Aç</span>
              {isMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobil Menü */}
      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              href="/"
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-[#6A3C96] hover:text-[#6A3C96]"
              onClick={() => setIsMenuOpen(false)}
            >
              Ana Sayfa
            </Link>
            <button
              onClick={() => setIsKurumsalOpen(!isKurumsalOpen)}
              className="w-full text-left pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-[#6A3C96] hover:text-[#6A3C96] flex justify-between items-center"
            >
              Kurumsal
              <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            {isKurumsalOpen && (
              <div className="pl-6">
                <Link
                  href="https://kirala.lenacars.com/"
                  className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-[#6A3C96] hover:text-[#6A3C96]"
                  onClick={() => setIsMenuOpen(false)}
                  target="_blank"
                >
                  Kısa Süreli Kiralama
                </Link>
                <Link
                  href="/kiralama/avantajlar"
                  className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-[#6A3C96] hover:text-[#6A3C96]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Kiralamanın Avantajları
                </Link>
                <Link
                  href="/kiralama/kurumsal-uyelik"
                  className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-[#6A3C96] hover:text-[#6A3C96]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Kurumsal Üyelik Programı
                </Link>
                <Link
                  href="/kiralama/lenacars-avantajlari"
                  className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-[#6A3C96] hover:text-[#6A3C96]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  LenaCars Avantajları
                </Link>
                <Link
                  href="/kiralama/tasarruf-hesapla"
                  className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-[#6A3C96] hover:text-[#6A3C96]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Tasarrufunu Hesapla
                </Link>
              </div>
            )}
            <Link
              href="/arac-kiralama"
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-[#6A3C96] hover:text-[#6A3C96]"
              onClick={() => setIsMenuOpen(false)}
            >
              Araç Kiralama
            </Link>
            <Link
              href="/ikinci-el"
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-[#6A3C96] hover:text-[#6A3C96]"
              onClick={() => setIsMenuOpen(false)}
            >
              İkinci El
            </Link>
            <Link
              href="/iletisim"
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-[#6A3C96] hover:text-[#6A3C96]"
              onClick={() => setIsMenuOpen(false)}
            >
              İletişim
            </Link>
            <Link
              href="/arac-kiralama"
              className="block text-center mx-3 my-2 bg-[#6A3C96] text-white px-4 py-2 rounded-md text-base font-medium hover:bg-[#5a3080] transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Hemen Kirala
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
