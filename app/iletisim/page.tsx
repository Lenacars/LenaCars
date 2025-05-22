"use client";

import Script from "next/script";
import Link from "next/link";

// İkonlar için SVG bileşenleri (önceki gibi)
const PhoneIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className || "w-5 h-5"}><path fillRule="evenodd" d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C6.852 22.5 1.5 17.148 1.5 9.75V7.5A3 3 0 014.5 4.5H6A3 3 0 019 1.5V4.5H4.5a3 3 0 01-3-3V1.5A3 3 0 014.5-1.5H6a3 3 0 013 3V1.5H4.5z" clipRule="evenodd" /></svg>
);
const MailIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className || "w-5 h-5"}><path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" /><path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" /></svg>
);
const FacebookIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className || "w-6 h-6"}><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" /></svg>
);
const InstagramIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className || "w-6 h-6"}><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
);
const LinkedInIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className || "w-6 h-6"}><path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" /></svg>
);
const YouTubeIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className || "w-6 h-6"}><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" /></svg>
);

export default function IletisimPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-[#6A3C96] mb-12 text-center">Bize Ulaşın</h1>

        {/* Ana grid yapısı: items-stretch ile kartların yüksekliklerini eşitle */}
        <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-stretch">
          {/* Sol Kart: İletişim Bilgileri + Harita */}
          {/* flex flex-col ile kart içeriğini dikeyde esnek yap */}
          <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg flex flex-col">
            <div className="space-y-8 flex-grow"> {/* flex-grow ile bu bölüm esneyerek haritayı aşağı iter */}
              <div>
                <h2 className="text-2xl font-bold text-[#6A3C96] mb-1">Lena Mama Yayıncılık Ticaret Anonim Şirketi</h2>
                <p className="text-gray-700 mt-3 text-base leading-relaxed">
                  Crea Center – Merkez, Çavuşbaşı Cd. 105/1-2, 34782 <br />
                  Çekmeköy / İstanbul
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-[#6A3C96] border-b pb-2">İletişim Detayları</h3>
                <a href="tel:+908505327929" className="flex items-center space-x-3 text-gray-700 hover:text-[#6A3C96] transition-colors group">
                  <PhoneIcon className="w-5 h-5 text-[#6A3C96] group-hover:scale-110 transition-transform" />
                  <span className="text-base">+90 850 532 79 29</span>
                </a>
                <a href="tel:+905377779729" className="flex items-center space-x-3 text-gray-700 hover:text-[#6A3C96] transition-colors group">
                  <PhoneIcon className="w-5 h-5 text-[#6A3C96] group-hover:scale-110 transition-transform" />
                  <span className="text-base">+90 537 777 79 29</span>
                </a>
                <a href="mailto:info@lenacars.com" className="flex items-center space-x-3 text-gray-700 hover:text-[#6A3C96] transition-colors group">
                  <MailIcon className="w-5 h-5 text-[#6A3C96] group-hover:scale-110 transition-transform" />
                  <span className="text-base">info@lenacars.com</span>
                </a>
              </div>

              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-[#6A3C96] border-b pb-2">Sosyal Medya</h3>
                <div className="flex space-x-5 text-[#6A3C96]">
                  <Link href="https://www.facebook.com/lenacars2020/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:opacity-75 transition-opacity"><FacebookIcon /></Link>
                  <Link href="https://www.instagram.com/lena.cars/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:opacity-75 transition-opacity"><InstagramIcon /></Link>
                  <Link href="https://tr.linkedin.com/company/lenacars" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:opacity-75 transition-opacity"><LinkedInIcon /></Link>
                  <Link href="https://www.youtube.com/channel/UCHSB4vxpEegkVmop4qJqCPQ" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="hover:opacity-75 transition-opacity"><YouTubeIcon /></Link>
                </div>
              </div>
            </div> {/* flex-grow içeren div'in sonu */}
            
            {/* Harita: mt-auto ile en alta itilir ve yüksekliği ayarlanabilir */}
            <div className="border-2 border-[#6A3C96] rounded-lg overflow-hidden shadow-lg mt-8">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3009.0505893045806!2d29.174426675860477!3d41.04602277134519!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cacf1eabb73537%3A0x289fbd81d20298d0!2sCrea%20Center%20%C3%87ekmek%C3%B6y!5e0!3m2!1str!2str!4v1747925140075!5m2!1str!2str"
                width="100%"
                height="350" // Harita yüksekliğini biraz artırdık (örneğin 350px)
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full border-0" 
                style={{minHeight: '300px'}} // Minimum yükseklik de eklenebilir
              ></iframe>
            </div>
          </div>

          {/* Sağ Kart: HubSpot Form */}
          {/* flex flex-col ile kart içeriğini dikeyde esnek yap */}
          <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg flex flex-col">
            <h2 className="text-2xl font-bold text-[#6A3C96] mb-6 text-center">Mesaj Gönderin</h2>
            {/* flex-grow ile form alanı esneyerek yüksekliği doldurur */}
            <div id="hubspotFormContainer" className="flex-grow min-h-[450px]"> {/* Yüksekliği biraz artırıldı */}
                 {/* HubSpot formu buraya yüklenecek */}
            </div>
          </div>
        </div>
      </div>

      {/* HubSpot embed script */}
      <Script
        id="hubspot-form-script"
        src="//js-eu1.hsforms.net/forms/embed/v2.js"
        strategy="afterInteractive"
        onLoad={() => {
          if (typeof window.hbspt !== "undefined") {
            window.hbspt.forms.create({
              region: "eu1",
              portalId: "24999641",
              formId: "cedeb254-1608-4c89-93fe-86dc4d351729",
              target: "#hubspotFormContainer",
              onFormReady: ($form) => { console.log("HubSpot formu yüklendi:", $form); },
              onFormSubmit: ($form) => { console.log("HubSpot formu gönderildi:", $form); }
            });
          } else {
            console.error("HubSpot script'i yüklenemedi veya hbspt objesi bulunamadı.");
          }
        }}
        onError={(e) => { console.error("HubSpot script yüklenirken hata oluştu:", e); }}
      />
    </div>
  );
}
