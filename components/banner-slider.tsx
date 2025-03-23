'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

export default function BannerSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)
  
  // Banner görselleri - dosya adlarını yüklediğiniz dosyalarla eşleştirdim
  const banners = [
    '/ANASAYFA-BANNER-1.webp',
    '/ANASAYFA-BANNER-2.webp',
    '/ANASAYFA-BANNER-3.webp'
  ]
  
  // Otomatik slayt geçişi için
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === banners.length - 1 ? 0 : prev + 1))
    }, 5000) // 5 saniyede bir değişecek
    
    return () => clearInterval(interval)
  }, [banners.length])
  
  return (
    <section className="relative h-[300px] md:h-[400px]">
      {/* Tüm bannerları göster ama sadece aktif olanı görünür yap */}
      {banners.map((banner, index) => (
        <div 
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            src={banner || "/placeholder.svg"}
            alt={`Banner ${index + 1}`}
            fill
            sizes="100vw"
            priority
            className="object-cover object-center"
          />
        </div>
      ))}
      
      {/* Slayt göstergeleri */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full ${
              index === currentSlide ? 'bg-purple-700' : 'bg-gray-300'
            }`}
            aria-label={`Slayt ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
