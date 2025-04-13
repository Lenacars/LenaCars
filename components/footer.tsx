import Link from "next/link"
import { Facebook, Instagram, Linkedin, Youtube, Phone } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-[#5d3b8b] text-white">
      <div className="container mx-auto py-8 px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">Kurumsal Araç Kiralama Çözümleri</h2>
          <p className="text-sm">Hızlı ve Kolay Hizmetle Tanışın!</p>
        </div>

        <div className="flex flex-wrap justify-center gap-8 mb-8">
          <div className="flex items-center">
            <Phone className="h-5 w-5 mr-2" />
            <Link href="tel:+908505327929" className="text-sm hover:underline">
              +90 850 532 7929
            </Link>
          </div>
          <div className="flex items-center">
            <Phone className="h-5 w-5 mr-2" />
            <Link href="tel:+905377777929" className="text-sm hover:underline">
              +90 537 777 7929
            </Link>
          </div>
          <div className="flex items-center">
            <Link href="/sss" className="text-sm hover:underline">
              Sıkça Sorulan Sorular
            </Link>
          </div>
          <div className="flex items-center">
            <Link href="/kisa-sureli-kiralama" className="text-sm hover:underline">
              Kısa Süreli Kiralama
            </Link>
          </div>
        </div>

        <div className="flex justify-center space-x-4 mb-8">
          <Link href="https://facebook.com" aria-label="Facebook" className="hover:text-gray-300">
            <Facebook className="h-6 w-6" />
          </Link>
          <Link href="https://instagram.com" aria-label="Instagram" className="hover:text-gray-300">
            <Instagram className="h-6 w-6" />
          </Link>
          <Link href="https://linkedin.com" aria-label="LinkedIn" className="hover:text-gray-300">
            <Linkedin className="h-6 w-6" />
          </Link>
          <Link href="https://youtube.com" aria-label="YouTube" className="hover:text-gray-300">
            <Youtube className="h-6 w-6" />
          </Link>
        </div>

        <div className="text-center text-sm">
          <p>&copy; {new Date().getFullYear()} LenaCars. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  )
}

