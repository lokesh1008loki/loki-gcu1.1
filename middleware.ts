import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin")
  const isAdminApiRoute = request.nextUrl.pathname.startsWith("/api/admin")
  const isLoginPage = request.nextUrl.pathname === "/admin/login"
  const isCreateAdminPage = request.nextUrl.pathname === "/admin/create-admin"
  const isAuthApiRoute = request.nextUrl.pathname.startsWith("/api/auth")

  // Protect admin API routes
  if (isAdminApiRoute) {
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }
    return NextResponse.next()
  }

  // Allow other API routes
  if (request.nextUrl.pathname.startsWith("/api") && !isAdminApiRoute) {
    return NextResponse.next()
  }

  // Protect admin routes
  if (isAdminRoute && !isLoginPage && !isCreateAdminPage) {
    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }
  }

  // Redirect authenticated users away from login/create-admin pages
  if ((isLoginPage || isCreateAdminPage) && token) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url))
  }

  // Track visitors on the main site
  if (!request.nextUrl.pathname.startsWith("/admin")) {
    try {
      await fetch(new URL("/api/visitors", request.url), {
        method: "POST",
      })
    } catch (error) {
      console.error('Error tracking visitor:', error)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
