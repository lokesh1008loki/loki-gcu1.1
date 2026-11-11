import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { verifyAdminAuth } from "@/lib/admin-auth"

export async function POST(request: Request) {
  try {
    const auth = await verifyAdminAuth(request)
    if (!auth.authenticated || auth.user?.role !== "superadmin") {
      return NextResponse.json(
        { error: "Forbidden: Superadmin privileges required" },
        { status: 403 }
      )
    }

    const { email, password, name } = await request.json()

    if (!email || !password || typeof password !== "string" || password.length < 8) {
      return NextResponse.json(
        { error: "Valid email and a password of at least 8 characters are required" },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create new admin user
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || "Admin User",
        role: "superadmin"
      }
    })

    // Remove password from response
    const { password: _, ...userWithoutPassword } = newUser

    return NextResponse.json({ user: userWithoutPassword })
  } catch (error) {
    console.error("Create admin error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 