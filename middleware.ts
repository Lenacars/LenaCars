import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  try {
    const path = request.nextUrl.pathname

    // Admin sayfalarını koruma
    if (path.startsWith("/admin") && path !== "/admin") {
      // Client-side kimlik doğrulama için basit bir çözüm
      const isAdmin = request.cookies.get("isAdmin")

      if (!isAdmin || !isAdmin.value) {
        return NextResponse.redirect(new URL("/admin", request.url))
      }
    }

    return NextResponse.next()
  } catch (error) {
    console.error("Middleware error:", error)
    // Hata durumunda ana sayfaya yönlendir
    return NextResponse.redirect(new URL("/", request.url))
  }
}

export const config = {
  matcher: ["/admin/:path*"],
}

