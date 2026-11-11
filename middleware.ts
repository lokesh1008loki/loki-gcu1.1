import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import type { NextRequest } from "next/server"
import { checkRateLimit, getClientIp } from "@/lib/rate-limit"

export async function middleware(request: NextRequest) {
  const url = request.nextUrl
  const hostname = request.headers.get("host") || ""
  const clientIp = getClientIp(request)
  
  // 1. Subdomain detection (match southwest.*)
  const isSouthwestSubdomain = hostname.startsWith("southwest.")
  
  // Decide on rewritten URL or standard (exclude static assets and system routes)
  const isExcluded = url.pathname.startsWith("/api") || 
                    url.pathname.startsWith("/_next") || 
                    url.pathname.startsWith("/icons") ||
                    url.pathname.startsWith("/ass") ||
                    url.pathname.match(/\.(png|jpg|jpeg|svg|gif|ico)$/i)

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set("x-pathname", url.pathname)
  requestHeaders.set("x-client-ip", clientIp)

  let response: NextResponse
  
  if (isSouthwestSubdomain && !isExcluded) {
    response = NextResponse.rewrite(new URL(`/southwest-airlines${url.pathname === "/" ? "" : url.pathname}`, request.url), {
      request: {
        headers: requestHeaders,
      }
    })
  } else {
    response = NextResponse.next({
      request: {
        headers: requestHeaders,
      }
    })
  }

  // 2. Strict Rate Limiting: 15 req/min per IP on public Inquiry Endpoints
  const isInquiryEndpoint =
    url.pathname === "/api/flights/inquiry" ||
    url.pathname === "/api/hotels/inquiry" ||
    url.pathname === "/api/ikea/inquiry" ||
    url.pathname === "/api/form-submission"

  if (isInquiryEndpoint && request.method === "POST") {
    const rateCheck = checkRateLimit(`${clientIp}:${url.pathname}`, 15, 60_000)
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          error: "Too many inquiries submitted. Rate limit is 15 requests per minute. Please try again later.",
          retryAfter: rateCheck.retryAfterSeconds,
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateCheck.retryAfterSeconds),
            "X-RateLimit-Limit": "15",
            "X-RateLimit-Remaining": "0",
          },
        }
      )
    }
  }

  // 3. Administrative Area Protection & Managed Challenge / IP Restrictions
  const isAdminRoute = url.pathname.startsWith("/admin")
  const isAdminApiRoute = url.pathname.startsWith("/api/admin")
  const isLoginPage = url.pathname === "/admin/login"
  const isCreateAdminPage = url.pathname === "/admin/create-admin"

  if (isAdminRoute || isAdminApiRoute) {
    // 3A. Automated vulnerability scanners / abusive tool mitigation
    const userAgent = (request.headers.get("user-agent") || "").toLowerCase()
    const maliciousScanners = ["sqlmap", "nikto", "acunetix", "masscan", "wpscan", "zgrab", "nmap", "gobuster", "dirbuster"]
    if (maliciousScanners.some(scanner => userAgent.includes(scanner))) {
      return NextResponse.json(
        { error: "Access Denied: Automated vulnerability scanner blocked." },
        { status: 403 }
      )
    }

    // 3B. Cloudflare Managed Challenge & High Threat Score Check
    const cfThreatScore = parseInt(request.headers.get("cf-threat-score") || "0", 10)
    if (cfThreatScore > 25) {
      return NextResponse.json(
        { error: "Access Denied: High threat score detected by security edge." },
        { status: 403 }
      )
    }

    // 3C. IP Restriction for Administrative Surface
    const allowedIpsEnv = process.env.ADMIN_ALLOWED_IPS || process.env.ALLOWED_ADMIN_IPS
    if (allowedIpsEnv && allowedIpsEnv.trim() !== "" && allowedIpsEnv.trim() !== "*") {
      const allowedIps = allowedIpsEnv.split(",").map(ip => ip.trim()).filter(Boolean)
      if (allowedIps.length > 0 && !allowedIps.includes(clientIp)) {
        console.warn(`[SECURITY] Blocked admin access from unlisted IP: ${clientIp} to ${url.pathname}`)
        return NextResponse.json(
          { error: "Access Denied: Your IP address is not authorized to access administrative areas." },
          { status: 403 }
        )
      }
    }

    // 3D. Brute-force protection on Admin Login attempts (10 attempts per 5 minutes)
    if (isLoginPage && request.method === "POST") {
      const loginCheck = checkRateLimit(`${clientIp}:admin-login`, 10, 300_000)
      if (!loginCheck.allowed) {
        return NextResponse.json(
          { error: "Too many login attempts. Please wait 5 minutes before trying again." },
          { status: 429, headers: { "Retry-After": String(loginCheck.retryAfterSeconds) } }
        )
      }
    }
  }

  const token = await getToken({ req: request })

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

  // Protect admin UI routes
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
     * Match all request paths except for static files:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - static image extensions (svg, png, jpg, jpeg, gif, webp, avif)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico)$).*)",
  ],
}
