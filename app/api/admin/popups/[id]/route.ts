import { NextResponse } from "next/server"
import { verifyAdminAuth } from "@/lib/admin-auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function PUT(
  req: Request,
  { params }: { params: { id: string } | Promise<{ id: string }> }
) {
  try {
    const auth = await verifyAdminAuth(req)
    if (!auth.authenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const resolvedParams = await Promise.resolve(params)
    let id = resolvedParams?.id

    if (!id) {
      const url = new URL(req.url)
      id = url.searchParams.get("id") || url.pathname.split("/").pop() || ""
    }

    if (!id) {
      return NextResponse.json({ error: "Popup ID is required" }, { status: 400 })
    }

    const body = await req.json()

    const data: any = {
      ...(body.title !== undefined && { title: body.title }),
      ...(body.message !== undefined && { message: body.message }),
      ...(body.type !== undefined && { type: body.type }),
      ...(body.isActive !== undefined && { isActive: body.isActive }),
      ...(body.startDate !== undefined && { startDate: body.startDate ? new Date(body.startDate) : null }),
      ...(body.endDate !== undefined && { endDate: body.endDate ? new Date(body.endDate) : null }),
      ...(body.showOnPages !== undefined && { showOnPages: Array.isArray(body.showOnPages) ? body.showOnPages : [] }),
    }

    const updatedPopup = await prisma.popupNotification.update({
      where: { id },
      data,
    })

    try {
      revalidatePath("/")
      revalidatePath("/admin/dashboard/popups")
    } catch (e) {
      console.error("Revalidation error:", e)
    }

    return NextResponse.json(updatedPopup, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate"
      }
    })
  } catch (error: any) {
    console.error("Error updating popup:", error)
    return NextResponse.json(
      { error: "Failed to update popup", details: error?.message || String(error) },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } | Promise<{ id: string }> }
) {
  try {
    const auth = await verifyAdminAuth(req)
    if (!auth.authenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const resolvedParams = await Promise.resolve(params)
    let id = resolvedParams?.id

    if (!id) {
      const url = new URL(req.url)
      id = url.searchParams.get("id") || url.pathname.split("/").pop() || ""
    }

    if (!id) {
      return NextResponse.json({ error: "Popup ID is required" }, { status: 400 })
    }

    const result = await prisma.popupNotification.deleteMany({
      where: { id },
    })

    try {
      revalidatePath("/")
      revalidatePath("/admin/dashboard/popups")
    } catch (e) {
      console.error("Revalidation error:", e)
    }

    return NextResponse.json({ 
      success: true,
      deletedCount: result.count,
      message: "Popup deleted successfully" 
    }, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate"
      }
    })
  } catch (error: any) {
    console.error("Error deleting popup:", error)
    return NextResponse.json(
      { error: "Failed to delete popup", details: error?.message || String(error) },
      { status: 500 }
    )
  }
}
