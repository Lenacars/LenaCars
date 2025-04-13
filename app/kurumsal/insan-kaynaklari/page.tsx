"use client"

import Image from "next/image"
import { useState } from "react"
import Modal from "@/components/modal"

export default function InsanKaynaklariPage() {
  // SVG yükleme hatası durumunda kullanılacak state
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({})
  const [isModalOpen, setIsModalOpen] = useState(false)

  // İnsan Kaynakları Değerleri
  const ikDegerleri = [
    {
      title: "Mutlu Çalışan Mutlu Müşteri",
      icon: "/mutlucalisan.svg",
      description:
        "Çalışan memnuniyetinin müşteri memnuniyetine doğrudan yansıdığına inanıyoruz. Mutlu çalışanlarımızla daha kaliteli hizmet sunuyoruz.",
      bgColor: "bg-amber-50",
    },
    {
      title: "Adil Ücret ve Terfi Politikası",
      icon: "/adilucret.svg",
      description:
        "Piyasa koşullarına uygun ve performans kriterlerine dayalı adil bir ücret ve terfi politikası uyguluyoruz.",
      bgColor: "bg-blue-50",
    },
    {
      title: "Performans Yönetim Sistemi",
      icon: "/performansyonetimi.svg",
      description:
        "Şeffaf ve ölçülebilir kriterlerle performans değerlendirmesi yaparak, çalışanlarımızın gelişimini destekliyoruz.",
      bgColor: "bg-pink-50",
    },
    {
      title: "Takdir Etme ve Ödüllendirme",
      icon: "/takdiretme.svg",
      description: "Başarıyı takdir ediyor, ekstra çaba ve katkıları özel ödüllendirme sistemimizle destekliyoruz.",
      bgColor: "bg-blue-50",
    },
    {
      title: "Şeffaf ve Huzurlu Çalışma Ortamı",
      icon: "/huzurlucalisma.svg",
      description: "Açık iletişimi teşvik eden, güvenilir ve huzurlu bir çalışma ortamı sunuyoruz.",
      bgColor: "bg-purple-50",
    },
    {
      title: "Takımdaslık ve Kollektif Çalışma",
      icon: "/takimdaslik.svg",
      description:
        "Bireysel başarıların yanında, takım çalışmasını ve kollektif başarıyı destekleyen bir kültür oluşturuyoruz.",
      bgColor: "bg-green-50",
    },
    {
      title: "Eğitim ve Gelişim İmkanı",
      icon: "/egitim.svg",
      description:
        "Çalışanlarımızın kişisel ve profesyonel gelişimlerini destekleyen eğitim programları ve kariyer fırsatları sunuyoruz.",
      bgColor: "bg-blue-50",
    },
  ]

  return (
    <div className="space-y-12 px-4 sm:px-6 md:px-8 lg:px-20 py-10">
      {/* Hero Banner - Hakkımızda sayfasıyla aynı boyutta */}
      <div className="w-full overflow-hidden rounded-xl">
        <div className="relative w-full" style={{ aspectRatio: "4443/950" }}>
          <Image
            src="/insankaynaklari.webp"
            alt="LenaCars İnsan Kaynakları"
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
        <h1 className="text-[#6A3C96] text-3xl md:text-5xl font-bold mt-6 mb-2">İnsan Kaynakları</h1>
      </div>

      {/* 1. Mutlu Çalışan = Mutlu Müşteri Bölümü - Düz metin olarak */}
      <section className="max-w-4xl mx-auto">
        <h2 className="text-[#6A3C96] text-2xl md:text-3xl font-bold mb-6">Mutlu Çalışan = Mutlu Müşteri</h2>
        <div className="space-y-6">
          <p className="text-gray-700 leading-relaxed">
            LenaCars İnsan Kaynakları olarak, mutlu çalışanların mutlu müşterilere oluşturacağına inanıyoruz. Adil ücret
            ve terfi politikamız, şeffaf çalışma ortamımız ve takım odaklı iş kültürümüzle kariyer yolculuğunuzda size
            eşlik ediyoruz. Hedefimiz, her çalışanın gelişimini destekleyen huzurlu ve verimli bir iş ortamı
            oluşturmaktır.
          </p>
          <p className="text-[#6A3C96] text-xl italic font-medium text-center">
            "Mutlu ve huzurlu bir çalışma ortamı, başarının anahtarıdır."
          </p>
          <p className="text-gray-700 leading-relaxed">
            Başarılı yönetim, insanları geliştirebilmektir. LenaCars'ın insan kaynakları temelinde ise hep birlikte
            gelişmek vardır. Kariyer yolculuğunuza birlikte yön verelim, hep birlikte gelişelim…
          </p>
        </div>
      </section>

      {/* 2. Adil Ücret ve Terfi Politikamız - Düz metin olarak */}
      <section className="max-w-4xl mx-auto">
        <h2 className="text-[#6A3C96] text-2xl font-bold mb-6">Adil Ücret ve Terfi Politikamız</h2>
        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed">
            LenaCars olarak, tüm çalışanlarımız için adil bir çalışma ortamı oluşturmayı öncelikli hedefimiz olarak
            görüyoruz. Adil ücret politikamız, piyasa koşullarına uygun ve performans kriterlerine dayalı bir yapıyı
            temel alır. Her çalışanımızın emeğinin karşılığını tam anlamıyla almasını sağlarken, kariyer gelişimlerini
            desteklemek amacıyla şeffaf ve adil bir terfi süreci uyguluyoruz.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Başarıyı ödüllendiren yaklaşımımız, yeteneklerinizi en iyi şekilde sergileyebileceğiniz ve büyüyebileceğiniz
            bir ortam yaratmayı amaçlamaktadır. Çalışanlarımızın mutluluğunu ve motivasyonunu öncelik alarak,
            sürdürülebilir bir iş ortamı için çalışıyoruz.
          </p>
        </div>
      </section>

      {/* 3. Şeffaf Çalışma Ortamı - Düz metin olarak */}
      <section className="max-w-4xl mx-auto">
        <h2 className="text-[#6A3C96] text-2xl font-bold mb-6">Şeffaf Çalışma Ortamı</h2>
        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed">
            LenaCars olarak şeffaflık ilkesini çalışma kültürümüzün temel taşı olarak görüyoruz. Tüm süreçlerimizde açık
            iletişimi teşvik ediyor, çalışanlarımızın kendilerini ifade edebileceği güvenilir bir ortam oluşturuyoruz.
            İşleyişimizde şeffaflık, karar alma süreçlerinde ve ekip yönetiminde adaleti sağlarken, çalışanlarımız
            arasında güveni pekiştiren bir yaklaşım sunar.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Ortak hedeflere ulaşmak için birlikte çalışırken, her bireyin katkısını değerli buluyor ve şeffaf bir
            yönetim anlayışıyla iş ortamımızı güçlendiriyoruz.
          </p>
        </div>
      </section>

      {/* 4. İK Değerleri Grid - Widget'lar */}
      <section className="max-w-6xl mx-auto">
        <h2 className="text-[#6A3C96] text-2xl font-bold mb-8 text-center">İnsan Kaynakları Değerlerimiz</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ikDegerleri.map((deger, index) => (
            <div
              key={index}
              className={`${deger.bgColor} rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300`}
            >
              <div className="flex items-center mb-4">
                <div className="w-14 h-14 flex items-center justify-center bg-[#6A3C96] rounded-full mr-4">
                  <Image
                    src={imgErrors[deger.title] ? "/placeholder.svg" : deger.icon}
                    alt={deger.title}
                    width={30}
                    height={30}
                    className="object-contain invert"
                    onError={() => {
                      setImgErrors((prev) => ({
                        ...prev,
                        [deger.title]: true,
                      }))
                    }}
                  />
                </div>
                <h3 className="text-lg font-bold text-[#6A3C96]">{deger.title}</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">{deger.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Takıma Katılım CTA ve Başvuru Formu */}
      <section className="max-w-4xl mx-auto">
        <div className="bg-[#6A3C96] text-white rounded-xl p-8 md:p-10 shadow-md text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">LenaCars Mutlu Çalışanların Arasına Katıl</h2>
          <p className="text-xl italic font-medium mb-4">
            Bir elin nesi var, iki elin sesi var, üç elin ise orkestrası!
          </p>
          <p className="mb-6">
            LenaCars'ın mutlu çalışma ortamına katılmak ve takım arkadaşlarımızdan biri olmak için başvuru formunu
            doldurarak bize ulaşabilirsiniz.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-block bg-white text-[#6A3C96] px-6 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors"
          >
            Başvuru Formu
          </button>
        </div>
      </section>

      {/* 6. Sık Sorulan Sorular */}
      <section className="max-w-4xl mx-auto">
        <h2 className="text-[#6A3C96] text-2xl font-bold mb-8 text-center">İK Dünyası Hakkında Sık Sorulan Sorular</h2>
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-bold text-[#6A3C96] mb-2">İş başvurusu nasıl yapabilirim?</h3>
            <p className="text-gray-700">
              Kariyer sayfamızdaki başvuru formunu doldurarak veya özgeçmişinizi kariyer@lenacars.com adresine
              göndererek başvuruda bulunabilirsiniz.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-bold text-[#6A3C96] mb-2">Başvuru sonrası süreç nasıl işliyor?</h3>
            <p className="text-gray-700">
              Başvurunuz İnsan Kaynakları ekibimiz tarafından değerlendirilir. Uygun bulunan adaylarla önce telefon
              görüşmesi, ardından yüz yüze mülakat gerçekleştirilir. Olumlu değerlendirilen adaylara iş teklifi sunulur.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-bold text-[#6A3C96] mb-2">LenaCars'ta kariyer gelişimi nasıl sağlanıyor?</h3>
            <p className="text-gray-700">
              Düzenli performans değerlendirmeleri, kişisel gelişim planları ve şirket içi eğitimlerle çalışanlarımızın
              kariyer gelişimini destekliyoruz. Şirket içi terfi imkanları ile yetenek ve başarıyı ödüllendiriyoruz.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-bold text-[#6A3C96] mb-2">İş görüşmesine nasıl hazırlanmalıyım?</h3>
            <p className="text-gray-700">
              Şirketimiz ve başvurduğunuz pozisyon hakkında araştırma yapın. Özgeçmişinizdeki bilgileri destekleyecek
              somut örnekler hazırlayın. Güçlü yönlerinizi ve gelişim alanlarınızı dürüstçe paylaşmaya hazır olun.
              Sorularınızı önceden hazırlayın.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-bold text-[#6A3C96] mb-2">
              LenaCars'ta çalışanlar için ne tür eğitim fırsatları sunuluyor?
            </h3>
            <p className="text-gray-700">
              Çalışanlarımıza hem teknik hem de kişisel gelişim alanlarında eğitimler sunuyoruz. Sektörel konferans ve
              seminerlere katılım imkanı, online eğitim platformlarına erişim ve mentorluk programları ile sürekli
              gelişimi destekliyoruz.
            </p>
          </div>
        </div>
      </section>

      {/* HubSpot Form Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Kariyer Başvuru Formu" />
    </div>
  )
}
