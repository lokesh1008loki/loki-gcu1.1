import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  const url = request.nextUrl
  const hostname = request.headers.get("host") || ""
  
  // Subdomain detection (match southwest.*)
  const isSouthwestSubdomain = hostname.startsWith("southwest.")
  
  // Decide on rewritten URL or standard (exclude static assets and system routes)
  const isExcluded = url.pathname.startsWith("/api") || 
                    url.pathname.startsWith("/_next") || 
                    url.pathname.startsWith("/icons") ||
                    url.pathname.startsWith("/ass") ||
                    url.pathname.match(/\.(png|jpg|jpeg|svg|gif|ico)$/)

  const response = isSouthwestSubdomain && !isExcluded
    ? NextResponse.rewrite(new URL(`/southwest-airlines${url.pathname === "/" ? "" : url.pathname}`, request.url))
    : NextResponse.next()

  // Set the current pathname in a header for layout detection
  response.headers.set("x-pathname", url.pathname)

  const isAdminRoute = url.pathname.startsWith("/admin")
  const isAdminApiRoute = url.pathname.startsWith("/api/admin")
  const isLoginPage = url.pathname === "/admin/login"
  const isCreateAdminPage = url.pathname === "/admin/create-admin"

  // Protect admin API routes
  if (isAdminApiRoute) {
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }
    return response
  }

  // Allow other API routes
  if (url.pathname.startsWith("/api") && !isAdminApiRoute) {
    return response
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
  if (!url.pathname.startsWith("/admin")) {
    try {
      fetch(new URL("/api/visitors", request.url), {
        method: "POST",
      }).catch(e => console.error('Error tracking visitor:', e))
    } catch (error) {
      console.error('Error tracking visitor:', error)
    }
  }

  return response
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
