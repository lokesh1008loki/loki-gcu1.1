import { NextResponse } from "next/server"
import { verifyAdminAuth } from "@/lib/admin-auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET(request: Request) {
  try {
    const auth = await verifyAdminAuth(request)
    if (!auth.authenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const popups = await prisma.popupNotification.findMany({
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(popups, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate"
      }
    })
  } catch (error: any) {
    console.error("Error fetching popups:", error)
    return NextResponse.json(
      { error: "Failed to fetch popups", details: error?.message || String(error) },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const auth = await verifyAdminAuth(req)
    if (!auth.authenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { title, message, type, isActive, startDate, endDate, showOnPages } = body

    if (!title || !message) {
      return NextResponse.json(
        { error: "Title and message are required" },
        { status: 400 }
      )
    }

    // Ensure showOnPages is an array
    const showOnPagesArray = Array.isArray(showOnPages) ? showOnPages : []

    const data = {
      title,
      message,
      type: type || "info",
      isActive: isActive !== undefined ? isActive : true,
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
      showOnPages: showOnPagesArray,
    }

    const popup = await prisma.popupNotification.create({
      data,
    })

    try {
      revalidatePath("/")
      revalidatePath("/admin/dashboard/popups")
    } catch (e) {
      console.error("Revalidation error:", e)
    }

    return NextResponse.json(popup, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate"
      }
    })
  } catch (error: any) {
    console.error("Error creating popup:", error)
    return NextResponse.json(
      { error: "Failed to create popup", details: error?.message || String(error) },
      { status: 500 }
    )
  }
}
