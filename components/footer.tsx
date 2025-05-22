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
    { name: "YouTube", href: "https://www.youtube.com/channel/UCHSB4vxpEegkVmop4qJqCPQ", icon: Youtube }, // Verdiğiniz link
  ];

  const quickLinks = [
    { name: "Nasıl Çalışır", href: "https://lena-cars.vercel.app/nas%C4%B1l-%C3%A7al%C4%B1%C5%9F%C4%B1r-" },
    { name: "Sıkça Sorulan Sorular", href: "https://lena-cars.vercel.app/s.s.s." },
    { name: "Kısa Süreli Kiralama", href: "/kisa-sureli-kiralama" }, // Bu link için tam URL yoksa iç link olarak kalabilir
    { name: "İletişim", href: "https://lena-cars.vercel.app/iletisim" },
  ];

  // Örnek diğer linkler (isteğe bağlı olarak eklenebilir veya düzenlenebilir)
  const corporateLinks = [
    { name: "Hakkımızda", href: "/hakkimizda" },
    { name: "Gizlilik Politikası", href: "/gizlilik-politikasi" },
    { name: "Kullanım Koşulları", href: "/kullanim-kosullari" },
    { name: "Blog", href: "/blog" },
  ];


  return (
    <footer style={{ backgroundColor: corporateColor }} className="text-gray-200">
      <div className="container mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 text-center md:grid-cols-2 md:text-left lg:grid-cols-4 lg:gap-8">
          {/* Sütun 1: Logo ve Şirket Açıklaması */}
          <div className="space-y-5 md:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-flex items-center space-x-2"> {/* flex items-center eklendi */}
              <Image
                src="/LENACARS-FOOTER.svg" // Footer için özel logo
                alt="LenaCars Footer Logo"
                width={150} // Footer için uygun bir genişlik
                height={42}  // Orantılı yükseklik (width/height oranı ~3.57)
                className="h-10 w-auto" // Yüksekliği Tailwind ile sınırlayarak boyutu ayarla (h-10 = 40px)
              />
              {/* <h2 className="text-xl font-semibold text-white">LENACARS</h2> // Logo yeterince büyükse bu kaldırılabilir */}
            </Link>
            <p className="text-sm text-gray-300 leading-relaxed">
              İhtiyaçlarınıza özel, esnek ve güvenilir kiralama deneyimi için doğru adrestesiniz. Kurumsal araç kiralamada yenilikçi çözümler sunuyoruz.
            </p>
            <div className="flex justify-center md:justify-start space-x-4 pt-2">
              {socialLinks.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.name}
                  className="text-gray-300 hover:text-white transition-transform hover:scale-110 duration-200"
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
                  <Link href={link.href} className="text-sm hover:text-white hover:underline transition-colors duration-150">
                    {link.name}
                  </Link>
                </li>
              ))}
              {/* İsteğe bağlı olarak daha fazla link eklenebilir */}
               <li><Link href="/uzun-donem-kiralama" className="text-sm hover:text-white hover:underline transition-colors duration-150">Uzun Dönem Kiralama</Link></li>
            </ul>
          </div>

          {/* Sütun 3: Kurumsal Linkler (Örnek) */}
          <div>
            <h3 className="text-md font-semibold text-white uppercase tracking-wider">
              Kurumsal
            </h3>
            <ul role="list" className="mt-4 space-y-3">
              {corporateLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm hover:text-white hover:underline transition-colors duration-150">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Sütun 4: İletişim Bilgileri */}
          <div>
            <h3 className="text-md font-semibold text-white uppercase tracking-wider">
              Bize Ulaşın
            </h3>
            <ul role="list" className="mt-4 space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0 text-gray-300" />
                <address className="text-sm not-italic">
                  Crea Center – Merkez, Çavuşbaşı Cd. 105/1-2, 34782 Çekmeköy / İstanbul
                </address>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 flex-shrink-0 text-gray-300" />
                <Link href="tel:+908505327929" className="text-sm hover:text-white hover:underline transition-colors duration-150">
                  +90 850 532 7929
                </Link>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 flex-shrink-0 text-gray-300" />
                <Link href="tel:+905377777929" className="text-sm hover:text-white hover:underline transition-colors duration-150">
                  +90 537 777 7929
                </Link>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 flex-shrink-0 text-gray-300" />
                <Link href="mailto:info@lenacars.com" className="text-sm hover:text-white hover:underline transition-colors duration-150">
                  info@lenacars.com
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 border-t border-gray-200/20 pt-8"> {/* Ayracın opaklığı düşürüldü */}
          <p className="text-sm text-gray-300 text-center">
            © {year} LenaCars. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </footer>
  );
}
