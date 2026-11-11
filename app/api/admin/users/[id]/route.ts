import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyAdminAuth } from "@/lib/admin-auth"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } | Promise<{ id: string }> }
) {
  try {
    const auth = await verifyAdminAuth(request)
    
    if (!auth.authenticated || !auth.user || !["admin", "superadmin"].includes(auth.user.role || "")) {
      return NextResponse.json(
        { error: "Unauthorized. Admin privileges required." },
        { status: 403 }
      )
    }

    const resolvedParams = await Promise.resolve(params)
    let id = resolvedParams?.id

    if (!id) {
      const url = new URL(request.url)
      id = url.searchParams.get("id") || url.pathname.split("/").pop() || ""
    }

    if (!id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // Check if the user exists
    const userToDelete = await prisma.user.findUnique({
      where: { id }
    })

    if (!userToDelete) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // Prevent deleting self
    if (userToDelete.id === auth.user.id) {
      return NextResponse.json(
        { error: "Cannot delete your own account" },
        { status: 403 }
      )
    }

    // Only superadmins can delete superadmins
    if (userToDelete.role === "superadmin" && auth.user.role !== "superadmin") {
      return NextResponse.json(
        { error: "Forbidden: Cannot delete a superadmin account" },
        { status: 403 }
      )
    }

    // Delete the user
    await prisma.user.deleteMany({
      where: { id }
    })

    return NextResponse.json({ success: true, message: "User deleted successfully" }, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate"
      }
    })
  } catch (error: any) {
    console.error("Error deleting user:", error)
    return NextResponse.json(
      { error: "Failed to delete user", details: error?.message || String(error) },
      { status: 500 }
    )
  }
}
