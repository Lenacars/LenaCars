"use client"

import { useEffect } from "react"
import Script from "next/script"

export default function HubspotForm({ formId = "ab5485bc-01ff-4746-988f-28df85d583c1", region = "eu1" }) {
  useEffect(() => {
    // HubSpot form yüklendikten sonra çalışacak
    const loadForm = () => {
      if ((window as any).hbspt) {
        ;(window as any).hbspt.forms.create({
          region: region,
          portalId: "24999641", // Güncellenmiş portal ID
          formId: formId,
          target: "#hubspot-form-container",
        })
      }
    }

    // HubSpot script yüklendiyse formu yükle
    if ((window as any).hbspt) {
      loadForm()
    }

    return () => {
      // Form container'ı temizle
      const container = document.getElementById("hubspot-form-container")
      if (container) {
        container.innerHTML = ""
      }
    }
  }, [formId, region])

  return (
    <>
      <Script
        src={`//js-eu1.hsforms.net/forms/embed/v2.js`}
        strategy="afterInteractive"
        onLoad={() => {
          if ((window as any).hbspt) {
            ;(window as any).hbspt.forms.create({
              region: region,
              portalId: "24999641", // Güncellenmiş portal ID
              formId: formId,
              target: "#hubspot-form-container",
            })
          }
        }}
      />
      <div id="hubspot-form-container" className="hubspot-form"></div>
    </>
  )
}
