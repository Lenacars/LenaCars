import Link from "next/link";
import Image from "next/image"; // Logo için Image bileşenini import ediyoruz
import { 
  Facebook, 
  Instagram, 
  Linkedin, 
  Youtube, 
  Phone, 
  Mail, 
  MapPin 
} from "lucide-react";

export default function Footer() {
  const corporateColor = "#6A3C96"; // Kurumsal renginiz
  const year = new Date().getFullYear();

  const socialLinks = [
    { name: "Facebook", href: "https://www.facebook.com/lenacars2020/", icon: Facebook },
    { name: "Instagram", href: "https://www.instagram.com/lena.cars/", icon: Instagram },
    { name: "LinkedIn", href: "https://tr.linkedin.com/company/lenacars", icon: Linkedin },
    { name: "YouTube", href: "https://www.youtube.com/channel/UCHSB4vxpEegkVmop4qJqCPQ", icon: Youtube },
  ];

  const quickLinks = [
    { name: "Nasıl Çalışır", href: "https://lena-cars.vercel.app/nas%C4%B1l-%C3%A7al%C4%B1%C5%9F%C4%B1r-" },
    { name: "Sıkça Sorulan Sorular", href: "https://lena-cars.vercel.app/s.s.s." },
    { name: "Kısa Süreli Kiralama", href: "/kisa-sureli-kiralama" }, // Bu link için tam URL yoksa iç link olarak kalabilir
    { name: "İletişim", href: "https://lena-cars.vercel.app/iletisim" },
  ];

  return (
    <footer style={{ backgroundColor: corporateColor }} className="text-gray-200">
      <div className="container mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Sütun 1: Logo ve Şirket Bilgisi */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <Image
                src="/LENACARS.svg" // MainHeader'daki logo yolu varsayıldı
                alt="LenaCars Logo"
                width={160} // Footer için uygun bir genişlik
                height={45}  // Orantılı yükseklik (MainHeader'daki orana göre ayarlanabilir)
                className="h-10 w-auto" // Yüksekliği sınırlayarak boyutu kontrol et
              />
            </Link>
            <p className="text-sm text-gray-300">
              Kurumsal araç kiralama çözümlerinde hızlı ve kolay hizmetle tanışın!
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.name}
                  className="text-gray-300 hover:text-white transition-transform hover:scale-110"
                >
                  <item.icon className="h-6 w-6" />
                </Link>
              ))}
            </div>
          </div>

          {/* Sütun 2: Hızlı Linkler */}
          <div>
            <h3 className="text-md font-semibold text-white uppercase tracking-wider">
              Hızlı Linkler
            </h3>
            <ul role="list" className="mt-4 space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm hover:text-white hover:underline">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Sütun 3: İletişim Bilgileri */}
          <div>
            <h3 className="text-md font-semibold text-white uppercase tracking-wider">
              İletişim
            </h3>
            <ul role="list" className="mt-4 space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0 text-gray-300" />
                <span className="text-sm">
                  Crea Center – Merkez, Çavuşbaşı Cd. 105/1-2, 34782 Çekmeköy / İstanbul
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-3 flex-shrink-0 text-gray-300" />
                <Link href="tel:+908505327929" className="text-sm hover:text-white hover:underline">
                  +90 850 532 7929
                </Link>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-3 flex-shrink-0 text-gray-300" />
                <Link href="tel:+905377777929" className="text-sm hover:text-white hover:underline">
                  +90 537 777 7929
                </Link>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-3 flex-shrink-0 text-gray-300" />
                <Link href="mailto:info@lenacars.com" className="text-sm hover:text-white hover:underline">
                  info@lenacars.com
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Sütun 4: Ekstra Linkler veya Slogan (İsteğe Bağlı) */}
          <div>
            <h3 className="text-md font-semibold text-white uppercase tracking-wider">
              LenaCars
            </h3>
             <p className="mt-4 text-sm text-gray-300">
              İhtiyaçlarınıza özel, esnek ve güvenilir kiralama deneyimi için doğru adrestesiniz.
            </p>
            {/* Buraya "KVKK", "Çerez Politikası" gibi linkler eklenebilir */}
          </div>

        </div>

        <div className="mt-12 border-t border-gray-200/30 pt-8">
          <p className="text-sm text-gray-300 text-center">
            © {year} LenaCars. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </footer>
  );
}
