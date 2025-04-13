"use client"

import Image from "next/image"
import Link from "next/link"
import { Linkedin } from 'lucide-react'
import { useState } from "react"

export default function LiderlikEkibimizPage() {
  const [isHoveredFunda, setIsHoveredFunda] = useState(false)
  const [isHoveredSelcuk, setIsHoveredSelcuk] = useState(false)

  return (
    <div className="space-y-16 px-4 sm:px-6 md:px-8 lg:px-20 py-10">
      {/* Hero Banner */}
      <div className="w-full overflow-hidden rounded-xl">
        <div className="relative w-full" style={{ aspectRatio: "4443/950" }}>
          <Image
            src="/liderlikekibimiz.webp"
            alt="LenaCars Liderlik Ekibimiz"
            fill
            className="object-cover"
            sizes="100vw"
            priority
            onError={(e) => {
              // Eğer görsel yoksa mor arka plan göster
              const target = e.target as HTMLImageElement
              target.style.display = "none"
              target.parentElement!.style.backgroundColor = "#6A3C96"
            }}
          />
        </div>
        {/* Başlık - Banner'ın altında */}
        <h1 className="text-[#6A3C96] text-3xl md:text-5xl font-bold mt-6 mb-2">Liderlik Ekibimiz</h1>
      </div>

      {/* Açıklama Metni */}
      <section className="max-w-4xl mx-auto">
        <p className="text-lg text-gray-700 leading-relaxed">
          LenaCars'ın liderlik ekibi, öncü iş insanlarından oluşuyor. LenaCars markasının kurucuları Dr. Funda Lena
          Nazik ve Selçuk Nazik, yenilikçi vizyonları ile markanın global başarısını inşa ediyor.
        </p>
      </section>

      {/* Liderlik Ekibi Kartları */}
      <section className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Dr. Funda Lena Nazik Kartı */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
            <div className="relative h-80 bg-gradient-to-r from-[#6A3C96] to-[#9B59B6]">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-48 h-48 rounded-full border-4 border-white overflow-hidden">
                  <Image src="/Funda-Lena.webp" alt="Dr. Funda Lena Nazik" fill className="object-cover" />
                </div>
              </div>
            </div>
            <div className="p-8">
              <h2 className="text-2xl font-bold text-[#6A3C96] mb-2 text-center">Dr. Funda Lena Nazik</h2>
              <p className="text-gray-600 text-center mb-6">Kurucu Ortak / Founder</p>

              <div className="space-y-4 text-gray-700 mb-8">
                <p>
                  Dr. Funda Lena Nazik, Boğaziçi Üniversitesi'nde ekonomi alanında lisans ve yüksek lisans eğitimini
                  dereceyle ve iki ödülle tamamlamıştır. 2012 yılında İstanbul Bilgi Üniversitesi'nde başladığı
                  doktorasını 2017 yılında birincilikle bitirmiştir.
                </p>
                <p>
                  Dr. Nazik, 2015 yılında KREKSA Araştırma ve Danışmanlık Şirketi'ni kurarak araştırma ve yenilik odaklı
                  projelere imza atmıştır. 2018 yılında Lena & Mama Yayıncılık'ı hayata geçirerek Annelerden Masallar
                  projesiyle Lions Türkiye Konfederasyonu Fark Yaratan Kadın Girişimci ödülünü almıştır.
                </p>
                <p>
                  2022 yılında ARTENPRENEUR Sanatçılar İçin Girişimcilik Eğitimleri ve 2023 yılında Sisters Music Chain
                  Platformu'nu kurmuş, 2024 yılında Kadın Dostu Markalar Platformu Farkındalık Ödülleri Jüri Özel
                  Ödülüne layık görülmüştür.
                </p>
                <p>
                  2023 ve 2024 yıllarında Fast Company Business Dergisi tatafindan oluşturulan Female Founders 100
                  listesinde yer almış, 2024 yılında EY (Ernst&Young) global organizasyonu tarafından düzenlenen
                  Girişimci Kadın Liderler programına Türkiye'den seçilen 10 kadından biri olmuştur. TOBB Kreatif
                  Endüstriler Meclisi ve MSG Denetleme Kurulu üyesidir.
                </p>
                <p>
                  Dr. Funda Lena Nazik, yayıncılık, kültür ve sanat iş kollarının stratejik yönetimi ve gelişiminden
                  sorumludur.
                </p>
              </div>

              {/* LinkedIn Butonu */}
              <div className="flex justify-center">
                <Link
                  href="https://www.linkedin.com/in/fundalena/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative inline-flex items-center px-6 py-3 bg-[#0077B5] text-white rounded-md font-medium transition-all duration-300 overflow-hidden group"
                  onMouseEnter={() => setIsHoveredFunda(true)}
                  onMouseLeave={() => setIsHoveredFunda(false)}
                >
                  <span
                    className={`absolute inset-0 bg-[#005582] transition-transform duration-300 transform ${
                      isHoveredFunda ? "translate-y-0" : "translate-y-full"
                    }`}
                  ></span>
                  <Linkedin className="w-5 h-5 mr-2 relative z-10" />
                  <span className="relative z-10">LinkedIn Profilini Görüntüle</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Selçuk Nazik Kartı */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
            <div className="relative h-80 bg-gradient-to-r from-[#6A3C96] to-[#9B59B6]">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-48 h-48 rounded-full border-4 border-white overflow-hidden">
                  <Image src="/selcuk-nazik.webp" alt="Selçuk Nazik" fill className="object-cover" />
                </div>
              </div>
            </div>
            <div className="p-8">
              <h2 className="text-2xl font-bold text-[#6A3C96] mb-2 text-center">Selçuk Nazik</h2>
              <p className="text-gray-600 text-center mb-6">Kurucu Ortak / Founder</p>

              <div className="space-y-4 text-gray-700 mb-8">
                <p>
                  Selçuk Nazik, lisans eğitimini ekonomi alanında tamamlamış, ardından İstanbul Bilgi Üniversitesi'nde
                  MBA derecesi almıştır. Eğitimine ABD'de devam eden Nazik, Cornell Üniversitesi'nde Stratejik Pazarlama
                  Yönetimi programını başarıyla tamamlamıştır.
                </p>
                <p>
                  İş hayatına Erikli & Nestle Waters şirketinde başlayan Nazik, gıda ve içecek sektörlerinde 10 yıl
                  boyunca çeşitli görevlerde bulunmuştur. Daha sonra otomotiv sektörüne geçiş yapmış ve burada Operasyon
                  ve İş Geliştirme Müdürü, Satış Müdürü ve Genel Müdür pozisyonlarında önemli deneyimler edinmiştir.
                </p>
                <p>
                  Türkiye genelinde birçok araç kiralama şirketi ve otomobil yetkili satıcısını ziyaret ederek sektörel
                  gözlemler yapmış, bu deneyimleri doğrultusunda eşiyle birlikte LenaCars markasını kurmuştur.
                </p>
                <p>Selçuk Nazik, otomotiv iş kolu yatırımları, gelişimi ve stratejik yönetiminden sorumludur.</p>
              </div>

              {/* LinkedIn Butonu */}
              <div className="flex justify-center">
                <Link
                  href="https://www.linkedin.com/in/selcuk-nazik-50116914/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative inline-flex items-center px-6 py-3 bg-[#0077B5] text-white rounded-md font-medium transition-all duration-300 overflow-hidden group"
                  onMouseEnter={() => setIsHoveredSelcuk(true)}
                  onMouseLeave={() => setIsHoveredSelcuk(false)}
                >
                  <span
                    className={`absolute inset-0 bg-[#005582] transition-transform duration-300 transform ${
                      isHoveredSelcuk ? "translate-y-0" : "translate-y-full"
                    }`}
                  ></span>
                  <Linkedin className="w-5 h-5 mr-2 relative z-10" />
                  <span className="relative z-10">LinkedIn Profilini Görüntüle</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vizyon ve Misyon */}
      <section className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-[#6A3C96]/10 to-[#9B59B6]/10 rounded-xl p-8 md:p-10 shadow-sm">
          <h2 className="text-[#6A3C96] text-2xl font-bold mb-6 text-center">Vizyonumuz ve Misyonumuz</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-[#6A3C96] mb-3">Vizyonumuz</h3>
              <p className="text-gray-700 leading-relaxed">
                Otomotiv sektöründe yenilikçi çözümler ve müşteri odaklı yaklaşımlarla, Türkiye'nin en güvenilir ve
                tercih edilen araç kiralama ve ikinci el araç platformu olmak.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-[#6A3C96] mb-3">Misyonumuz</h3>
              <p className="text-gray-700 leading-relaxed">
                Müşterilerimize şeffaf, güvenilir ve kaliteli hizmet sunarak, araç kiralama ve ikinci el araç alım-satım
                süreçlerini kolaylaştırmak. Sürdürülebilir iş modelleri ve teknolojik yeniliklerle sektörde fark
                yaratmak.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Başarılar ve Ödüller */}
      <section className="max-w-4xl mx-auto">
        <h2 className="text-[#6A3C96] text-2xl font-bold mb-8 text-center">Başarılar ve Ödüller</h2>
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6">
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-[#6A3C96] rounded-full mr-3 mt-0.5">
                  <span className="text-white font-bold">✓</span>
                </div>
                <div>
                  <p className="text-gray-700">
                    <span className="font-semibold">2024:</span> EY (Ernst&Young) Girişimci Kadın Liderler Programı -
                    Türkiye'den Seçilen 10 Firmadan Biri
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-[#6A3C96] rounded-full mr-3 mt-0.5">
                  <span className="text-white font-bold">✓</span>
                </div>
                <div>
                  <p className="text-gray-700">
                    <span className="font-semibold">2024:</span> Kadın Dostu Markalar Platformu Farkındalık Ödülleri -
                    Jüri Özel Ödülü
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-[#6A3C96] rounded-full mr-3 mt-0.5">
                  <span className="text-white font-bold">✓</span>
                </div>
                <div>
                  <p className="text-gray-700">
                    <span className="font-semibold">2023-2024:</span> Fast Company Business Dergisi - Female Founders
                    100 Listesi
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-[#6A3C96] rounded-full mr-3 mt-0.5">
                  <span className="text-white font-bold">✓</span>
                </div>
                <div>
                  <p className="text-gray-700">
                    <span className="font-semibold">2019:</span> Lions Türkiye Konfederasyonu - Fark Yaratan Kadın
                    Girişimci Ödülü
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}