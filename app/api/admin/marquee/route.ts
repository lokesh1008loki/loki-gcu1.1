import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyAdminAuth } from "@/lib/admin-auth"
import { revalidatePath } from "next/cache"

export const dynamic = "force-dynamic"
export const revalidate = 0

interface MarqueeMessageData {
  id?: string
  message: string
  isActive?: boolean
  backgroundColor?: string
  textColor?: string
}

export async function GET(request: Request) {
  try {
    const auth = await verifyAdminAuth(request)
    if (!auth.authenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const messages = await prisma.marqueeMessage.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(messages, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate"
      }
    })
  } catch (error) {
    console.error("Error fetching marquee messages:", error)
    return NextResponse.json(
      { error: "Failed to fetch marquee messages" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const auth = await verifyAdminAuth(request)
    if (!auth.authenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json() as MarqueeMessageData
    const { message, isActive, backgroundColor, textColor } = data

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      )
    }

    const newMessage = await prisma.marqueeMessage.create({
      data: {
        message,
        isActive: isActive ?? true,
        backgroundColor: backgroundColor ?? "primary",
        textColor: textColor ?? "white"
      } as any
    })

    try {
      revalidatePath("/")
      revalidatePath("/admin/dashboard/marquee")
    } catch (e) {
      console.error("Revalidation error:", e)
    }

    return NextResponse.json(newMessage, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate"
      }
    })
  } catch (error) {
    console.error("Error creating marquee message:", error)
    return NextResponse.json(
      { error: "Failed to create marquee message" },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const auth = await verifyAdminAuth(request)
    if (!auth.authenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json() as MarqueeMessageData
    const { id, message, isActive, backgroundColor, textColor } = data

    if (!id) {
      return NextResponse.json(
        { error: "Message ID is required" },
        { status: 400 }
      )
    }

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
  } catch (error) {
    console.error("Error updating marquee message:", error)
    return NextResponse.json(
      { error: "Failed to update marquee message" },
      { status: 500 }
    )
  }
}
