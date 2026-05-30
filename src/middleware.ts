import { NextRequest, NextResponse } from "next/server"
import { SESSION_COOKIE } from "@/lib/session"

const PROTECTED = ["/dashboard", "/users"]

export function middleware(req: NextRequest) {
  const isLoggedIn = !!req.cookies.get(SESSION_COOKIE)?.value
  const { pathname } = req.nextUrl

  const isProtected = PROTECTED.some(
    (p) => pathname === p || pathname.startsWith(p + "/"),
  )

  if (isProtected && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  if ((pathname === "/login" || pathname === "/register") && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }
}

export const config = {
  matcher: ["/login", "/register", "/dashboard", "/dashboard/:path*", "/users", "/users/:path*"],
}
