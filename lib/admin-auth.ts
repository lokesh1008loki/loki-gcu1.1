import { getServerSession } from "next-auth"
import { getToken } from "next-auth/jwt"
import { authOptions } from "@/lib/auth"

export interface AdminAuthResult {
  authenticated: boolean
  user: {
    id?: string
    email?: string | null
    name?: string | null
    role?: string
  } | null
}

export async function verifyAdminAuth(request: Request): Promise<AdminAuthResult> {
  // 1. Try NextAuth getServerSession
  try {
    const session = await getServerSession(authOptions)
    if (session?.user) {
      return {
        authenticated: true,
        user: {
          id: (session.user as any).id,
          email: session.user.email,
          name: session.user.name,
          role: (session.user as any).role || "admin",
        },
      }
    }
  } catch (e) {
    console.warn("getServerSession auth check encountered an error:", e)
  }

  // 2. Try getToken directly from request cookies using NEXTAUTH_SECRET
  try {
    const secret = process.env.NEXTAUTH_SECRET
    const token = await getToken({
      req: request as any,
      secret,
    })
    if (token) {
      return {
        authenticated: true,
        user: {
          id: (token.id || token.sub) as string | undefined,
          email: token.email as string | undefined,
          name: token.name as string | undefined,
          role: (token.role as string | undefined) || "admin",
        },
      }
    }
  } catch (e) {
    console.warn("getToken auth check encountered an error:", e)
  }

  // 3. Fallback: Check if request was authenticated & forwarded by edge middleware
  const isVerifiedByMiddleware = request.headers.get("x-admin-auth") === "verified"
  const userId = request.headers.get("x-user-id")
  const userEmail = request.headers.get("x-user-email")

  if (isVerifiedByMiddleware && (userId || userEmail)) {
    return {
      authenticated: true,
      user: {
        id: userId || undefined,
        email: userEmail || undefined,
        role: "admin",
      },
    }
  }

  return {
    authenticated: false,
    user: null,
  }
}
