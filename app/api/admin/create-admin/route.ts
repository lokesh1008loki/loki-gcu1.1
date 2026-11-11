import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { verifyAdminAuth } from "@/lib/admin-auth"

export async function POST(request: Request) {
  try {
    const auth = await verifyAdminAuth(request)
    if (!auth.authenticated || auth.user?.role !== "superadmin") {
      return NextResponse.json(
        { error: "Forbidden: Only superadmins can create admin users." },
        { status: 403 }
      )
    }

    const body = await request.json().catch(() => ({}))
    const { email, password, name = "Admin User" } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      )
    }

    if (typeof password !== "string" || password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long." },
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

    // Hash password using 12 salt rounds
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create new admin user
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: "admin"
      }
    })

    // Remove password from response
    const { password: _, ...userWithoutPassword } = newUser

    return NextResponse.json({ 
      success: true,
      message: "Admin user created successfully",
      user: userWithoutPassword 
    })
  } catch (error) {
    console.error("Create admin error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 