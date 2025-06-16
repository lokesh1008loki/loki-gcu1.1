import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Get the current user's session
    const session = await getServerSession(authOptions)
    
    // Check if user is authenticated and is an admin
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized. Only admins can delete users." },
        { status: 403 }
      )
    }
    
    const { id } = params
    
    // Check if the user exists
    const userToDelete = await (prisma as any).user.findUnique({
      where: { id }
    })
    
    if (!userToDelete) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }
    
    // Prevent deleting another admin
    if (userToDelete.role === "admin") {
      return NextResponse.json(
        { error: "Cannot delete another admin user" },
        { status: 403 }
      )
    }
    
    // Delete the user
    await (prisma as any).user.delete({
      where: { id }
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting user:", error)
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    )
  }
} 