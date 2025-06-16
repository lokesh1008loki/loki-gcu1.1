import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const popups = await prisma.popupNotification.findMany({
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(popups)
  } catch (error) {
    console.error("Error fetching popups:", error)
    return NextResponse.json(
      { error: "Failed to fetch popups" },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { title, message, type, isActive, startDate, endDate, showOnPages } = body

    if (!title || !message || !type) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Ensure showOnPages is an array
    const showOnPagesArray = Array.isArray(showOnPages) ? showOnPages : []

    // Convert dates to proper format
    const data = {
      title,
      message,
      type,
      isActive,
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
      showOnPages: showOnPagesArray,
    }

    const popup = await prisma.popupNotification.create({
      data,
    })

    return NextResponse.json(popup)
  } catch (error) {
    console.error("Error creating popup:", error)
    return NextResponse.json(
      { error: "Failed to create popup" },
      { status: 500 }
    )
  }
} 