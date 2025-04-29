import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const popups = await prisma.popupNotification.findMany({
      where: {
        isActive: true,
      },
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