import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    const { message, isActive, backgroundColor, textColor } = data
    const { id } = params

    if (!message && isActive === undefined && !backgroundColor && !textColor) {
      return NextResponse.json(
        { error: "Message, isActive, backgroundColor, or textColor is required" },
        { status: 400 }
      )
    }

    const updatedMessage = await prisma.marqueeMessage.update({
      where: {
        id
      },
      data: {
        ...(message && { message }),
        ...(isActive !== undefined && { isActive }),
        ...(backgroundColor && { backgroundColor }),
        ...(textColor && { textColor })
      }
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

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = params

    await (prisma as any).marqueeMessage.delete({
      where: {
        id
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting marquee message:", error)
    return NextResponse.json(
      { error: "Failed to delete marquee message" },
      { status: 500 }
    )
  }
} 