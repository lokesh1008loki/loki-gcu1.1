import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  try {
    // 1. Verify any existing users
    const userCount = await prisma.user.count()
    if (userCount > 0) {
      return NextResponse.json(
        { error: "Setup is disabled: Administrator accounts are already initialized." },
        { status: 403 }
      )
    }

    // 2. Validate setup secret if configured
    const setupSecret = process.env.SETUP_SECRET
    if (setupSecret) {
      const providedSecret = request.headers.get("x-setup-secret")
      if (providedSecret !== setupSecret) {
        return NextResponse.json(
          { error: "Unauthorized: Invalid setup secret." },
          { status: 401 }
        )
      }
    }

    const body = await request.json().catch(() => ({}))
    const { email, password, name = "Initial Administrator" } = body

    if (!email || !password || typeof password !== "string" || password.length < 8) {
      return NextResponse.json(
        { error: "A valid email and strong password (min 8 characters) are required for initial setup." },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 12)
    const adminUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: "superadmin"
      }
    })

    const { password: _, ...adminWithoutPassword } = adminUser
    return NextResponse.json({ success: true, user: adminWithoutPassword })
  } catch (error) {
    console.error("Setup error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 