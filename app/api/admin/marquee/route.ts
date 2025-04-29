import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

interface MarqueeMessageData {
  id?: string
  message: string
  isActive?: boolean
  backgroundColor?: string
  textColor?: string
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const messages = await prisma.marqueeMessage.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(messages)
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
    const session = await getServerSession(authOptions)
    if (!session) {
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

    return NextResponse.json(newMessage)
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
    const session = await getServerSession(authOptions)
    if (!session) {
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

    const updatedMessage = await prisma.marqueeMessage.update({
      where: {
        id: data.id
      },
      data: {
        message,
        isActive: isActive ?? true,
        backgroundColor: backgroundColor ?? "primary",
        textColor: textColor ?? "white"
      } as any
    })

    return NextResponse.json(updatedMessage)
  } catch (error) {
    console.error("Error updating marquee message:", error)
    return NextResponse.json(
      { error: "Failed to update marquee message" },
      { status: 500 }
    )
  }
} 