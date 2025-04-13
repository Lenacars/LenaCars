"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

export default function HakkimizdaPage() {
  // SVG yükleme hatası durumunda kullanılacak state
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({})

  const timelineData = [
    {
      year: "2015",
      description: "KREKSA Araştırma ve Danışmanlık Kuruldu",
      buttonLabel: "Web Sitesini Ziyaret Et",
      buttonUrl: "https://www.kreksa.com/",
      icon: "🏢",
    },
    {
      year: "2016",
      description: "Lena Mama Yayınevi Faaliyete Geçti",
      buttonLabel: "Web Sitesini Ziyaret Et",
      buttonUrl: "https://www.lenamama.com/",
      icon: "📚",
    },
    {
      year: "2018",
      description: "LenaCars Kuruldu",
      buttonLabel: "Web Sitesini Ziyaret Et",
      buttonUrl: "https://lenacars.com/",
      icon: "🚗",
    },
    {
      year: "2019",
      description: "Fark Yaratan Kadın Girişimci Ödülü",
      buttonLabel: "Annelerden Masallar Projesi",
      buttonUrl: "#",
      icon: "🏆",
    },
    {
      year: "2022",
      description: "ARTENPRENEUR Kuruldu",
      buttonLabel: "Web Sitesini Ziyaret Et",
      buttonUrl: "https://www.artenpreneur.com/",
      icon: "🎨",
    },
    {
      year: "2022",
      description: "Female Founders 100 Listesine Girdi",
      buttonLabel: "Female Founders 100",
      buttonUrl: "https://www.fastcompany.com/",
      icon: "👑",
    },
    {
      year: "2023",
      description: "sarjagel.com Faaliyete Geçti",
      buttonLabel: "Web Sitesini Ziyaret Et",
      buttonUrl: "https://www.sarjagel.com/",
      icon: "🔌",
    },
    {
      year: "2024",
      description: "Kadın Dostu Markalar Farkındalık Ödülü",
      buttonLabel: "Ödül Hakkında",
      buttonUrl: "#",
      icon: "🌟",
    },
    {
      year: "2024",
      description: "EY Kadın Liderler Programına Seçilen 10 Firmadan Biri Olduk",
      buttonLabel: "EY Haberini Okuyun",
      buttonUrl: "https://www.ey.com/",
      icon: "🌍",
    },
  ]

  // Değerler verilerini açıklamalarla genişlettik
  const valuesData = [
    {
      title: "Güvenilirlik",
      icon: "/guvenilirlik.png",
      description:
        "Müşterilerimize verdiğimiz her sözü tutarak, güvenilir hizmet anlayışımızla sektörde fark yaratıyoruz.",
    },
    {
      title: "Şeffaflık",
      icon: "/seffaflik.png",
      description:
        "Tüm iş süreçlerimizde açık ve dürüst iletişimi benimseyerek, müşterilerimizle güvene dayalı ilişkiler kuruyoruz.",
    },
    {
      title: "Müşteri Odaklılık",
      icon: "/musteriodaklilik.png",
      description:
        "Müşterilerimizin ihtiyaç ve beklentilerini en iyi şekilde anlayarak, kişiselleştirilmiş çözümler sunuyoruz.",
    },
    {
      title: "Sürdürülebilirlik",
      icon: "/surdurebilirlik.png",
      description:
        "Çevreye duyarlı iş modellerimizle, gelecek nesillere daha yaşanabilir bir dünya bırakmayı hedefliyoruz.",
    },
    {
      title: "Küresel Düşünmek",
      icon: "/kurseldusunme.png",
      description: "Yerel değerlerimizi korurken, global trendleri takip ederek inovatif çözümler geliştiriyoruz.",
    },
    {
      title: "Kazancı Hak Etmek",
      icon: "/kazanc.png",
      description:
        "Sunduğumuz değer odaklı hizmetlerle, müşterilerimizin memnuniyetini ve güvenini kazanarak büyüyoruz.",
    },
  ]

  // Logo verilerini güncelledik
  const brandData = [
    {
      name: "Lena Mama Yayınevi",
      logo: "/lenamama.svg",
      fallbackLogo: "/placeholder-logo.svg",
      url: "https://www.lenamama.com/",
    },
    {
      name: "LenaCars",
      logo: "/lenacars.svg",
      fallbackLogo: "/placeholder-logo.svg",
      url: "https://lenacars.com/",
    },
    {
      name: "sarjagel.com",
      logo: "/sarjagel.svg",
      fallbackLogo: "/placeholder-logo.svg",
      url: "https://www.sarjagel.com/",
    },
    {
      name: "KREKSA",
      logo: "/kreksa.svg",
      fallbackLogo: "/placeholder-logo.svg",
      url: "https://www.kreksa.com/",
    },
    {
      name: "ARTENPRENEUR",
      logo: "/artenpreneur.svg",
      fallbackLogo: "/placeholder-logo.png",
      url: "https://www.artenpreneur.com/",
    },
  ]

  return (
    <div className="space-y-16 px-4 sm:px-6 md:px-8 lg:px-20 py-10">
      {/* Hero Banner - Orijinal boyutlarla */}
      <div className="w-full overflow-hidden rounded-xl">
        <div className="relative w-full" style={{ aspectRatio: "4443/950" }}>
          <Image
            src="/hakkimizda.webp"
            alt="LenaCars Hakkımızda"
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        </div>
        {/* Başlık - Banner'ın altında */}
        <h1 className="text-[#6A3C96] text-3xl md:text-5xl font-bold mt-6 mb-2">Hakkımızda</h1>
      </div>

      {/* Açıklama */}
      <section className="max-w-5xl mx-auto space-y-6 text-gray-700">
        <h2 className="text-[#6A3C96] text-2xl font-bold">Araç Kiralama ve 2. El Araç Çözümleri</h2>
        <p className="leading-relaxed">
          2018 yılında <strong className="text-[#6A3C96]">"Otomobile Güvenli Rotanız"</strong> mottosuyla kurulan
          LenaCars, bireysel ve kurumsal araç kiralama, 2. el otomobil alım ve satım hizmetlerinde sektörün öncü
          firmalarından biri olmayı başarmıştır.
        </p>
        <p className="leading-relaxed">
          <strong>LenaCars</strong>, Lena Mama Yayıncılık Ticaret A.Ş.'nin tescilli markasıdır. Firma, bireysel ve
          kurumsal müşterilere sunduğu uygun fiyatlı ve güvenilir çözümlerle Türkiye genelinde geniş bir müşteri
          kitlesine ulaşmıştır. <strong>Elde ettiği finansal başarı ve inovasyonları</strong> sayesinde, prestijli{" "}
          <strong>Fast Company Business</strong> tarafından düzenlenen "Female Founders 100" listesinde yer almayı
          başarmıştır. Ayrıca 2024 yılında EY (Ernst & Young) tarafından düzenlenen{" "}
          <strong>Global Kadın Girişimciler Programı</strong>'na Türkiye'den seçilen 10 firma arasına girerek
          uluslararası bir başarıya imza atmıştır.
        </p>
      </section>

      {/* Tarihçe - Profesyonel Zaman Çizelgesi */}
      <section className="py-16 bg-gray-50 rounded-xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-[#6A3C96] text-3xl font-bold mb-4">Tarihçemiz – Başarılarımız – Ödüllerimiz</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              2015 yılından bu yana süregelen başarı hikayemiz, sürekli gelişim ve yenilikçilik ilkelerimizle
              şekillenmektedir.
            </p>
          </div>

          <div className="relative">
            {/* Orta çizgi - masaüstü */}
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-[#6A3C96]/20 rounded"></div>

            {timelineData.map((item, index) => (
              <div key={index} className="mb-12 md:mb-24 relative">
                <div className={`md:flex items-center ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                  {/* Yıl ve İkon - Masaüstü */}
                  <div className="hidden md:flex items-center justify-center w-32 h-32 bg-white rounded-full shadow-lg border-4 border-[#6A3C96]/20 z-10 mx-auto md:mx-0 relative">
                    <div className="text-center">
                      <div className="text-4xl mb-1">{item.icon}</div>
                      <div className="text-2xl font-bold text-[#6A3C96]">{item.year}</div>
                    </div>
                  </div>

                  {/* İçerik Kartı */}
                  <div
                    className={`bg-white rounded-lg shadow-md p-6 md:w-5/12 relative ${
                      index % 2 === 0 ? "md:ml-8" : "md:mr-8"
                    }`}
                  >
                    {/* Yıl ve İkon - Mobil */}
                    <div className="md:hidden flex items-center mb-4">
                      <div className="flex items-center justify-center w-12 h-12 bg-[#6A3C96] rounded-full mr-4 text-white text-xl">
                        {item.icon}
                      </div>
                      <div className="text-2xl font-bold text-[#6A3C96]">{item.year}</div>
                    </div>

                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{item.description}</h3>

                    {item.buttonLabel && item.buttonUrl && (
                      <Link
                        href={item.buttonUrl}
                        target="_blank"
                        className="inline-block mt-4 bg-[#6A3C96] text-white px-5 py-2 rounded-md text-sm font-semibold hover:bg-[#5a3080] transition-colors"
                      >
                        {item.buttonLabel}
                      </Link>
                    )}

                    {/* Ok işareti - Masaüstü */}
                    <div
                      className={`hidden md:block absolute top-1/2 transform -translate-y-1/2 w-4 h-4 bg-white rotate-45 ${
                        index % 2 === 0 ? "left-0 -translate-x-2" : "right-0 translate-x-2"
                      }`}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Şirketler Grubu - Hover ile büyüyen logolar */}
      <section className="space-y-6">
        <h2 className="text-[#6A3C96] text-xl font-bold">Lena Mama Şirketler Grubu</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center">
          {brandData.map((brand, i) => (
            <Link
              key={i}
              href={brand.url}
              target="_blank"
              className="group flex flex-col items-center justify-center p-4 rounded-lg hover:bg-gray-50 transition-all duration-300"
            >
              <div className="h-24 w-full flex items-center justify-center overflow-hidden">
                <Image
                  src={imgErrors[brand.name] ? brand.fallbackLogo : brand.logo}
                  alt={brand.name}
                  width={160}
                  height={80}
                  className="object-contain transform transition-transform duration-300 group-hover:scale-110"
                  onError={() => {
                    console.log(`Failed to load image: ${brand.logo}`)
                    setImgErrors((prev) => ({
                      ...prev,
                      [brand.name]: true,
                    }))
                  }}
                />
              </div>
              <p className="mt-3 text-center text-[#6A3C96] font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {brand.name}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Değerler - Profesyonel Tasarım */}
      <section className="py-12 bg-gray-50 rounded-xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-[#6A3C96] text-3xl font-bold mb-4">Sahip Olduğumuz Değerler ve İlkelerimiz</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              LenaCars olarak, müşterilerimize en iyi hizmeti sunmak için benimsediğimiz temel değerler ve ilkeler, her
              gün yaptığımız işin merkezinde yer almaktadır.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {valuesData.map((value, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-14 h-14 flex items-center justify-center bg-[#6A3C96] rounded-full mr-4">
                      <Image
                        src={value.icon || "/placeholder.svg"}
                        alt={value.title}
                        width={30}
                        height={30}
                        className="object-contain invert"
                      />
                    </div>
                    <h3 className="text-xl font-bold text-[#6A3C96]">{value.title}</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </div>
                <div className="h-2 bg-[#6A3C96]"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
