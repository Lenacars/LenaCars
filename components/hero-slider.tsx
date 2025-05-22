"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const banners = [
    {
      image: "/ANASAYFA-BANNER-1.webp",
      link: null,
    },
    {
      image: "/ANASAYFA-BANNER-2.webp",
      link: "/tasarrufunu-hesapla",
    },
    {
      image: "/ANASAYFA-BANNER-3.webp",
      link: "/kurumsal-uyelik-programi",
    },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === banners.length - 1 ? 0 : prev + 1))
    }, 5000)
    return () => clearInterval(interval)
  }, [banners.length])

  return (
    <section className="relative w-full bg-white">
      <div className="relative w-full aspect-[16/7] md:aspect-[16/5] lg:aspect-[16/4] overflow-hidden">
        {banners.map((banner, index) => {
          const bannerImage = (
            <Image
              src={banner.image}
              alt={`Banner ${index + 1}`}
              fill
              sizes="100vw"
              priority
              className="object-contain transition-opacity duration-1000"
            />
          )

          return (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            >
              {banner.link ? (
                <Link href={banner.link} aria-label={`Banner ${index + 1}`}>
                  {bannerImage}
                </Link>
              ) : (
                bannerImage
              )}
            </div>
          )
        })}
      </div>

      {/* Noktalar */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 z-20">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full ${
              index === currentSlide ? "bg-[#6A3C96]" : "bg-gray-300"
            }`}
            aria-label={`Slayt ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
