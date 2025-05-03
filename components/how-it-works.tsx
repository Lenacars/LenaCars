import { Card, CardContent } from "@/components/ui/card"

export default function HowItWorks() {
  const steps = [
    {
      number: 1,
      title: "Araç Seçimi",
      description: "Geniş araç filomuzdan ihtiyacınıza uygun aracı seçin.",
    },
    {
      number: 2,
      title: "Tarih ve Süre Belirleme",
      description: "Kiralama başlangıç tarihini ve süresini belirleyin.",
    },
    {
      number: 3,
      title: "Bilgileri Girin",
      description: "Kişisel ve kurumsal bilgilerinizi girin.",
    },
    {
      number: 4,
      title: "Ödeme",
      description: "Güvenli ödeme sistemi ile ödemenizi yapın.",
    },
    {
      number: 5,
      title: "Aracınızı Teslim Alın",
      description: "Aracınızı belirlenen tarihte teslim alın.",
    },
  ]

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-6 text-center">Dijital Araç Kiralama Süreci Nedir?</h2>
      <p className="text-center mb-8 max-w-3xl mx-auto">
        LenaCars ile araç kiralama süreci basit ve hızlı! Araç kiralama adımlarını kolayca tamamlayarak istediğiniz
        araca ulaşabilirsiniz. Araç kiralama işlemlerini sizin için adım adım açıklıyoruz.
      </p>

      <div className="relative">
        <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-[#5d3b8b] -translate-y-1/2 z-0"></div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {steps.map((step) => (
            <Card key={step.number} className="relative z-10 border-[#5d3b8b] border-2">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-[#5d3b8b] text-white flex items-center justify-center text-xl font-bold mb-4">
                  {step.number}
                </div>
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-gray-600">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

