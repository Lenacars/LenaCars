"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const banners = [
    {
      image: "/ANASAYFA-BANNER-1.webp",
      link: null, // Tıklanmasın
    },
    {
      image: "/ANASAYFA-BANNER-2.webp",
      link: "/tasarrufunu-hesapla", // Sayfa adresini burada belirt
    },
    {
      image: "/ANASAYFA-BANNER-3.webp",
      link: "/kurumsal-uyelik-programi", // Sayfa adresini burada belirt
    },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === banners.length - 1 ? 0 : prev + 1))
    }, 5000)

    return () => clearInterval(interval)
  }, [banners.length])

  return (
    <section className="relative h-[300px] md:h-[400px]">
      {banners.map((banner, index) => {
        const bannerImage = (
          <Image
            src={banner.image}
            alt={`Banner ${index + 1}`}
            fill
            sizes="100vw"
            priority
            className="object-cover object-center"
          />
        )

        return (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            {banner.link ? (
              <Link href={banner.link}>{bannerImage}</Link>
            ) : (
              bannerImage
            )}
          </div>
        )
      })}

      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full ${
              index === currentSlide ? "bg-purple-700" : "bg-gray-300"
            }`}
            aria-label={`Slayt ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}