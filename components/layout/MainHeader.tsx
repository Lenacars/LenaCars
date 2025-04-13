"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

export default function MainHeader() {
  const [searchTerm, setSearchTerm] = useState("")

  return (
    <header>
      {/* Üst Bilgi Çubuğu - Tek bir tane */}
      <div className="bg-[#6A3C96] text-white py-3 px-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link href="/iletisim" className="flex items-center hover:text-gray-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </Link>
            <Link href="/iletisim" className="flex items-center hover:text-gray-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </Link>
            <Link href="/iletisim" className="flex items-center hover:text-gray-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
            </Link>
          </div>
          <div className="text-center hidden md:block">
            <h2 className="text-lg font-medium">Yüzlerce Araç Tek Ekranda Seç Beğen Güvenle Kirala</h2>
          </div>
          <div className="flex items-center space-x-3">
            {/* Sosyal Medya İkonları */}
            <Link href="https://facebook.com" target="_blank" className="hover:text-gray-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-5 w-5"
              >
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
              </svg>
            </Link>
            <Link href="https://instagram.com" target="_blank" className="hover:text-gray-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-5 w-5"
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </Link>
            <Link href="https://linkedin.com" target="_blank" className="hover:text-gray-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-5 w-5"
              >
                <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
              </svg>
            </Link>
            <Link href="https://youtube.com" target="_blank" className="hover:text-gray-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-5 w-5"
              >
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Ana Menü ve Logo */}
      <div className="bg-white py-4 px-4 shadow-sm">
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/LENACARS.svg"
              alt="LenaCars Logo"
              width={200}
              height={60}
              className="w-auto h-auto max-h-16"
              priority
              onError={(e) => {
                // SVG yüklenemezse PNG'ye geç
                const target = e.target as HTMLImageElement
                if (!target.src.includes(".png")) {
                  target.src = "/LENACARS.png"
                }
              }}
            />
          </Link>

          {/* Arama Kutusu */}
          <div className="flex-grow mx-4 max-w-md">
            <div className="relative">
              <input
                type="text"
                placeholder="Araç Ara"
                className="w-full py-2 px-4 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-[#6A3C96] focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                className="absolute right-0 top-0 h-full px-4 bg-[#E67E22] text-white rounded-r-md hover:bg-[#D35400] transition-colors"
                aria-label="Ara"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Garaj ve Giriş Butonları */}
          <div className="flex items-center space-x-3">
            <Link
              href="/garaj"
              className="border border-[#6A3C96] text-[#6A3C96] px-4 py-2 rounded-md flex items-center hover:bg-gray-50 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Garaj
            </Link>
            <Link
              href="/giris"
              className="bg-[#6A3C96] text-white px-4 py-2 rounded-md hover:bg-[#5a3080] transition-colors"
            >
              Giriş Yap / Üye Ol
            </Link>
          </div>
        </div>
      </div>

      {/* Alt Menü - Tek bir tane */}
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
    </header>
  )
}
