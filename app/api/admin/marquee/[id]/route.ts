import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyAdminAuth } from "@/lib/admin-auth"
import { revalidatePath } from "next/cache"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function PUT(
  request: Request,
  { params }: { params: { id: string } | Promise<{ id: string }> }
) {
  try {
    const auth = await verifyAdminAuth(request)
    if (!auth.authenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const resolvedParams = await Promise.resolve(params)
    let id = resolvedParams?.id

    if (!id) {
      const url = new URL(request.url)
      id = url.searchParams.get("id") || url.pathname.split("/").pop() || ""
    }

    if (!id) {
      return NextResponse.json({ error: "Message ID is required" }, { status: 400 })
    }

    const data = await request.json()
    const { message, isActive, backgroundColor, textColor } = data

    const updatedMessage = await prisma.marqueeMessage.update({
      where: { id },
      data: {
        ...(message !== undefined && { message }),
        ...(isActive !== undefined && { isActive }),
        ...(backgroundColor !== undefined && { backgroundColor }),
        ...(textColor !== undefined && { textColor })
      } as any
    })

    try {
      revalidatePath("/")
      revalidatePath("/admin/dashboard/marquee")
    } catch (e) {
      console.error("Revalidation error:", e)
    }

    return NextResponse.json(updatedMessage, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate"
      }
    })
  } catch (error: any) {
    console.error("Error updating marquee message:", error)
    return NextResponse.json(
      { error: "Failed to update marquee message", details: error?.message || String(error) },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } | Promise<{ id: string }> }
) {
  try {
    const auth = await verifyAdminAuth(request)
    if (!auth.authenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const resolvedParams = await Promise.resolve(params)
    let id = resolvedParams?.id

    if (!id) {
      const url = new URL(request.url)
      id = url.searchParams.get("id") || url.pathname.split("/").pop() || ""
    }

    if (!id) {
      return NextResponse.json({ error: "Message ID is required" }, { status: 400 })
    }

    const result = await prisma.marqueeMessage.deleteMany({
      where: { id }
    })

    try {
      revalidatePath("/")
      revalidatePath("/admin/dashboard/marquee")
    } catch (e) {
      console.error("Revalidation error:", e)
    }

    return NextResponse.json({ 
      success: true,
      deletedCount: result.count,
      message: "Marquee message deleted successfully"
    }, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate"
      }
    })
  } catch (error: any) {
    console.error("Error deleting marquee message:", error)
    return NextResponse.json(
      { error: "Failed to delete marquee message", details: error?.message || String(error) },
      { status: 500 }
    )
  }
}
