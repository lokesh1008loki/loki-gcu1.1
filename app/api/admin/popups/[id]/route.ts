import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = params
    const body = await req.json()

    // Convert dates to proper format
    const data = {
      ...body,
      startDate: body.startDate ? new Date(body.startDate) : null,
      endDate: body.endDate ? new Date(body.endDate) : null,
    }

    // Update the popup
    const updatedPopup = await prisma.popupNotification.update({
      where: {
        id: id,
      },
      data,
    })

    return NextResponse.json(updatedPopup)
  } catch (error) {
    console.error("Error updating popup:", error)
    return NextResponse.json(
      { error: "Failed to update popup" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = params

    // Delete the popup
    await prisma.popupNotification.delete({
      where: {
        id: id,
      },
    })

    return NextResponse.json({ message: "Popup deleted successfully" })
  } catch (error) {
    console.error("Error deleting popup:", error)
    return NextResponse.json(
      { error: "Failed to delete popup" },
      { status: 500 }
    )
  }
} 