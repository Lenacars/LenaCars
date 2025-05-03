"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { ExternalLink } from "lucide-react"

export default function OdullerimizPage() {
  // SVG yükleme hatası durumunda kullanılacak state
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({})

  // Ödüller verisi
  const odullerData = [
    {
      id: "fark-yaratan",
      title: "Fark Yaratan Kadın Girişimciler",
      image: "/kadin-girisimci.webp",
      description: `Lena Mama Yayıncılık Ticaret A.Ş. kurucusu Dr. Funda Lena Nazik 2019 yılında hayata geçirdiği "Annelerden Masallar" projesi ile Lions International tarafından düzenlenen "Fark Yaratan Kadın Girişimciler" yarışmasında, halk oylaması ve jüri değerlendirmesi ile en yüksek puanı alarak ödül kazanmıştır.`,
      detailUrl:
        "https://parentsdergisi.com/anne/annelerden-masallar-dinlemeye-hazir-misiniz/#:~:text=Annelerin%20i%C3%A7indeki%20yarat%C4%B1c%C4%B1l%C4%B1%C4%9F%C4%B1%20tetiklemek%20ve,art%C4%B1rmaya%20katk%C4%B1%20sa%C4%9Flamay%C4%B1%20da%20hedefliyor.",
    },
    {
      id: "female-founders",
      title: "Female Founders 100",
      image: "/female-founders.webp",
      description: `Lena Mama Yayıncılık Ticaret A.Ş. girişiminin oluşup hızlı büyüyüp ve farklı yönlere projeler sayesinde Uluslararası arenada da başarı göstermesi, yayıncılıktan müziğe, otomotivden Türkiye'nin dışına giden, sahibindeki kadın olan şirketler "Female Founders 100" listesinde yer alan liderler arasına girmeyi başarmıştır.`,
      detailUrl: "https://fastcompany.com.tr/dergi/female-founders-100/",
    },
    {
      id: "kadin-dostu",
      title: "Kadın Dostu Markalar Jüri Özel Ödülü",
      image: "/kadin-dostu.webp",
      description: `Lena Mama Yayıncılık Tic. A.Ş. Kurucusu Dr. Funda Lena Nazik, 2023 yılında geliştirdiği oluşu "Sisters Music Chain" projesi Türkiye'yi "8 Mart Dünya Kadınlar Günü" haftasında gerçekleştirilen "Kadın Dostu Markalar Platformu Farkındalık Ödülleri"nde Jüri Özel Ödülüne layık görülmüştür. 8 Mart 2024 tarihinde İş Sanat Oditorium Salon'da düzenlenen görkemli bir törenle ödülünü almıştır.`,
      detailUrl:
        "https://www.kadindostumarkalar.org/yazilar/haberler/kadin-dostu-markalar-farkindalik-odulleri-4kez-sahiplerini-buluyor",
    },
    {
      id: "ey-girisimci",
      title: "EY Girişimci Kadın Liderler Programı™",
      image: "/ey-globalkadinliderler.webp", // Doğru dosya adı - sondaki "i" yok
      description: `Dr. Funda Lena Nazik, faaliyetlerini gerçekleştirmek ve vizyonlarını gerçeğe dönüştürmek isteyen kadın girişimcileri destekleyen EY Girişimci Kadın Liderler Programı'nın 2024 yılı dönemine katılmaya hak kazanan 10 girişimci arasında yer almıştır. Program, geçen 17 yılın kültürünü, Türkiye'de iş dünyasında kadınların güçlenmesini destekleyen, 40'ın üzerinde kadın girişimcinin yönettiği şirketlerin mali ve itibari başarıları Ernst and Young tarafından dünyada izleniş, iş dünyasında önem ve inandırımın yer aldığı bağımsız jüri tarafından belirlenmiştir.`,
      detailUrl:
        "https://www.ey.com/tr_tr/newsroom/2024/11/ey-turkiye-girisimci-kadin-liderler-programi-2024-sinifi-belli-oldu",
    },
  ]

  return (
    <div className="space-y-16 px-4 sm:px-6 md:px-8 lg:px-20 py-10">
      {/* Hero Banner */}
      <div className="w-full overflow-hidden rounded-xl">
        <div className="relative w-full" style={{ aspectRatio: "4443/950" }}>
          <Image
            src="/odullerimiz.webp"
            alt="LenaCars Ödüllerimiz"
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
        <h1 className="text-[#6A3C96] text-3xl md:text-5xl font-bold mt-6 mb-2">Ödüllerimiz</h1>
      </div>

      {/* Giriş Metni */}
      <section className="max-w-4xl mx-auto text-center">
        <h2 className="text-[#6A3C96] text-2xl md:text-3xl font-bold mb-4">Başarılarımız</h2>
        <p className="text-gray-700 text-lg leading-relaxed italic">
          "Başarı yolculuktur, varış noktası değildir!" Başarı yolculuğumuzda bizlikle yol aldığımız tüm müşterilerimize
          sonsuz teşekkürler.
        </p>
      </section>

      {/* Ödüller Listesi */}
      <section className="max-w-6xl mx-auto">
        <div className="space-y-16">
          {odullerData.map((odul, index) => (
            <div
              key={odul.id}
              className={`flex flex-col ${index % 2 === 1 ? "md:flex-row-reverse" : "md:flex-row"} gap-8 items-center`}
            >
              {/* Ödül Görseli */}
              <div className="w-full md:w-2/5">
                <div className="relative rounded-lg overflow-hidden shadow-lg">
                  <Image
                    src={odul.image || "/placeholder.svg"}
                    alt={odul.title}
                    width={500}
                    height={400}
                    className="w-full object-cover"
                    onError={(e) => {
                      setImgErrors((prev) => ({
                        ...prev,
                        [odul.id]: true,
                      }))
                    }}
                  />
                </div>
              </div>

              {/* Ödül Açıklaması */}
              <div className="w-full md:w-3/5">
                <h3 className="text-2xl font-bold text-[#6A3C96] mb-4">{odul.title}</h3>
                <p className="text-gray-700 mb-6 leading-relaxed">{odul.description}</p>
                <Link
                  href={odul.detailUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 bg-[#6A3C96] text-white rounded-md font-semibold hover:bg-[#5a3080] transition-colors"
                >
                  <span>Detaya Bak</span>
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Bölümü */}
      <section className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-[#6A3C96]/10 to-[#9B59B6]/10 rounded-xl p-8 md:p-10 shadow-sm text-center">
          <h2 className="text-[#6A3C96] text-2xl font-bold mb-6">Başarı Hikayemizin Bir Parçası Olun</h2>
          <p className="text-gray-700 mb-8 leading-relaxed">
            LenaCars olarak, müşterilerimize en iyi hizmeti sunmak ve sektörde fark yaratmak için çalışıyoruz. Siz de bu
            başarı hikayesinin bir parçası olmak ister misiniz?
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/iletisim"
              className="bg-[#6A3C96] text-white px-6 py-3 rounded-md font-semibold hover:bg-[#5a3080] transition-colors"
            >
              Bizimle İletişime Geçin
            </Link>
            <Link
              href="/arac-kiralama"
              className="bg-white text-[#6A3C96] border border-[#6A3C96] px-6 py-3 rounded-md font-semibold hover:bg-gray-50 transition-colors"
            >
              Hizmetlerimizi Keşfedin
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}


