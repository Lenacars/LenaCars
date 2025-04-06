"use client"

import dynamic from "next/dynamic"

const MainHeaderDesktop = dynamic(() => import("./MainHeaderDesktop"), { ssr: false })
const MainHeaderMobile = dynamic(() => import("./MainHeaderMobile"), { ssr: false })

export default function MainHeader() {
  return (
    <>
      <div className="hidden md:block">
        <MainHeaderDesktop />
      </div>
      <div className="block md:hidden">
        <MainHeaderMobile />
      </div>
    </>
  )
}
