import { NextResponse } from "next/server"
import * as jose from "jose"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { getJwtSecret } from '@/lib/env'

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { username, password } = body

    // Find user in database
    const user = await prisma.user.findUnique({
      where: { email: username }
    })

    if (!user) {
      return NextResponse.json({ message: "Invalid username or password" }, { status: 401 })
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password)

    if (!isValidPassword) {
      return NextResponse.json({ message: "Invalid username or password" }, { status: 401 })
    }

    // Create JWT token using jose
    const secret = new TextEncoder().encode(getJwtSecret())
    const token = await new jose.SignJWT({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("8h")
      .sign(secret)

    const response = NextResponse.json({ 
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    })

    // Set cookie
    response.cookies.set({
      name: "auth-token",
      value: token,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 8, // 8 hours
    })

    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
