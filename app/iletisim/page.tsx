"use client";

import Script from "next/script";

export default function IletisimPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-[#6A3C96] mb-10">İletişim</h1>

      <div className="grid md:grid-cols-2 gap-10 items-start">
        {/* Sol: İletişim Bilgileri + Harita */}
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-[#6A3C96]">Lena Mama Yayıncılık Ticaret Anonim Şirketi</h2>
            <p className="text-gray-800 mt-2">
              Crea Center – Merkez, Çavuşbaşı Cd. 105/1-2, 34782 <br />
              Çekmeköy / İstanbul
            </p>
          </div>

          <div className="flex items-center space-x-4 text-[#6A3C96]">
            <a href="tel:+902185327929">+90 850 532 7929</a>
            <span>|</span>
            <a href="tel:+905377779729">+90 537 777 9729</a>
          </div>

          <div className="text-[#6A3C96]">
            <a href="mailto:info@lenacars.com">info@lenacars.com</a>
          </div>

          <div className="flex space-x-4 text-[#6A3C96] mt-2">
            <a href="https://facebook.com" target="_blank" aria-label="Facebook">📘</a>
            <a href="https://instagram.com" target="_blank" aria-label="Instagram">📸</a>
            <a href="https://linkedin.com" target="_blank" aria-label="LinkedIn">💼</a>
            <a href="https://youtube.com" target="_blank" aria-label="YouTube">▶️</a>
          </div>

          <div className="border rounded overflow-hidden shadow-md mt-6">
            <iframe
              src="https://www.google.com/maps/place//data=!4m2!3m1!1s0x14cacf1eabb73537:0x289fbd81d20298d0?sa=X&ved=1t:8290&ictx=111"
              width="100%"
              height="300"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full border rounded"
            ></iframe>
          </div>
        </div>

        {/* Sağ: HubSpot Form */}
        <div>
          <h2 className="text-xl font-semibold text-[#6A3C96] mb-4">Bize Ulaşın</h2>
          <div id="hubspotForm" className="bg-white border p-4 shadow rounded-md"></div>
        </div>
      </div>

      {/* HubSpot embed script */}
      <Script
        src="https://js.hsforms.net/forms/embed/v2.js"
        strategy="afterInteractive"
        onLoad={() => {
          if (window.hbspt) {
            window.hbspt.forms.create({
              region: "eu1",
              portalId: "143064526",
              formId: "1zt6yVBYITImT_obcTTUXKQevtuh",
              target: "#hubspotForm",
            });
          }
        }}
      />
    </div>
  );
}
