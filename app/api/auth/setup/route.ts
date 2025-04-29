import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  try {
    console.log("Starting admin setup...")
    
    // Check if admin user already exists
    const existingAdmin = await prisma.user.findFirst({
      where: { role: "superadmin" }
    })

    if (existingAdmin) {
      console.log("Admin user already exists")
      return NextResponse.json(
        { error: "Admin user already exists" },
        { status: 400 }
      )
    }

    // Create admin user
    console.log("Creating admin user...")
    const hashedPassword = await bcrypt.hash("password", 10)
    const adminUser = await prisma.user.create({
      data: {
        email: "admin@example.com",
        password: hashedPassword,
        name: "Admin User",
        role: "superadmin"
      }
    })

    console.log("Admin user created successfully:", adminUser)
    const { password: _, ...adminWithoutPassword } = adminUser

    return NextResponse.json({ user: adminWithoutPassword })
  } catch (error) {
    console.error("Setup error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 