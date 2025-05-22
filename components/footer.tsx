import Link from "next/link";
import Image from "next/image";
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
    { name: "Kısa Süreli Kiralama", href: "/kisa-sureli-kiralama" },
    { name: "İletişim", href: "https://lena-cars.vercel.app/iletisim" },
    { name: "Uzun Dönem Kiralama", href: "/uzun-donem-kiralama" },
  ];

  const corporateLinks = [
    { name: "Hakkımızda", href: "/hakkimizda" },
    { name: "Gizlilik Politikası", href: "/gizlilik-politikasi" },
    { name: "Kullanım Koşulları", href: "/kullanim-kosullari" },
    { name: "Blog", href: "/blog" },
    { name: "Kariyer", href: "/kariyer" },
  ];

  return (
    <footer style={{ backgroundColor: corporateColor }} className="text-gray-200"> {/* Ana metin rengi gray-200 */}
      <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 text-center md:grid-cols-2 md:text-left lg:grid-cols-4 lg:gap-6">
          
          <div className="space-y-4 md:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-block">
              <Image
                src="/LENACARS-FOOTER.svg"
                alt="LenaCars Footer Logo"
                width={244} 
                height={68}
                className="h-[68px] w-auto mx-auto md:mx-0" // En son %15 küçültülmüş hali
                priority
              />
            </Link>
            <p className="text-xs leading-relaxed text-gray-300 pt-1"> {/* Motto rengi gray-300 */}
              Araç kiralamada güvenilir ve yenilikçi ortağınız.
            </p>
            <div className="pt-2">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-2.5 text-center md:text-left"> {/* Başlık mb artırıldı */}
                Bizi Takip Edin
              </h3>
              <div className="flex justify-center md:justify-start space-x-3">
                {socialLinks.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={item.name}
                    className="text-gray-300 hover:text-white transition-transform hover:scale-110 duration-200" // İkon rengi gray-300
                  >
                    <item.icon className="h-5 w-5" />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              Hızlı Menü
            </h3>
            <ul role="list" className="mt-3 space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  {/* Linkler için ana renk (text-gray-200) miras alınır, hover'da beyaz olur */}
                  <Link href={link.href} className="text-xs hover:text-white hover:underline transition-colors duration-150">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              Kurumsal
            </h3>
            <ul role="list" className="mt-3 space-y-2">
              {corporateLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-xs hover:text-white hover:underline transition-colors duration-150">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              Bize Ulaşın
            </h3>
            <ul role="list" className="mt-3 space-y-2">
              <li className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-gray-300" /> {/* İkon rengi gray-300 */}
                {/* Adres metni için ana renk (text-gray-200) miras alınır */}
                <address className="text-xs not-italic leading-snug"> 
                  Crea Center – Merkez, Çavuşbaşı Cd. 105/1-2, 34782 Çekmeköy / İstanbul
                </address>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4 flex-shrink-0 text-gray-300" />
                <Link href="tel:+908505327929" className="text-xs hover:text-white hover:underline transition-colors duration-150">
                  +90 850 532 7929
                </Link>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4 flex-shrink-0 text-gray-300" />
                <Link href="tel:+905377777929" className="text-xs hover:text-white hover:underline transition-colors duration-150">
                  +90 537 777 7929
                </Link>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 flex-shrink-0 text-gray-300" />
                <Link href="mailto:info@lenacars.com" className="text-xs hover:text-white hover:underline transition-colors duration-150">
                  info@lenacars.com
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-200/10 pt-6">
          <p className="text-xs text-gray-400 text-center"> {/* Copyright metni daha soluk gray-400 */}
            © {year} LenaCars. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </footer>
  );
}
