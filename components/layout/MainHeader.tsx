"use client"

import dynamic from "next/dynamic"

const MainHeaderDesktop = dynamic(() => import("./MainHeaderDesktop"))
const MainHeaderMobile = dynamic(() => import("./MainHeaderMobile"))

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
