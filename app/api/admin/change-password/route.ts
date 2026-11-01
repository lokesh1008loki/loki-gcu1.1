import { NextResponse } from "next/server"
import { verifyAdminAuth } from "@/lib/admin-auth"
import { prisma } from "@/lib/prisma"
import { compare, hash } from "bcryptjs"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function POST(request: Request) {
  try {
    const auth = await verifyAdminAuth(request)
    
    if (!auth.authenticated || !auth.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { currentPassword, newPassword } = await request.json()

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Current password and new password are required" },
        { status: 400 }
      )
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "New password must be at least 6 characters long" },
        { status: 400 }
      )
    }

    // Get the user from database
    let user = null
    if (auth.user.id) {
      user = await prisma.user.findUnique({
        where: { id: auth.user.id }
      })
    }
    if (!user && auth.user.email) {
      user = await prisma.user.findUnique({
        where: { email: auth.user.email }
      })
    }

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // Verify current password
    const isPasswordValid = await compare(currentPassword, user.password)
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 400 }
      )
    }

    // Hash new password
    const hashedPassword = await hash(newPassword, 12)

    // Update password
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword }
    })

    return NextResponse.json({ 
      success: true,
      message: "Password updated successfully" 
    })
  } catch (error: any) {
    console.error("Error changing password:", error)
    return NextResponse.json(
      { error: "Failed to change password", details: error?.message || String(error) },
      { status: 500 }
    )
  }
}
