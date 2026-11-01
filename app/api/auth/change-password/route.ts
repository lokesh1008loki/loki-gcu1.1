import { NextResponse } from "next/server"
import { verifyAdminAuth } from "@/lib/admin-auth"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function POST(req: Request) {
  try {
    const auth = await verifyAdminAuth(req)
    if (!auth.authenticated || !auth.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { currentPassword, newPassword } = await req.json()

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "Current and new password are required" }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email: auth.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password)
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12)

    await prisma.user.update({
      where: { email: user.email },
      data: { password: hashedPassword },
    })

    return NextResponse.json({ success: true, message: "Password changed successfully" })
  } catch (error) {
    console.error("[CHANGE_PASSWORD]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
