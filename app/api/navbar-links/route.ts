import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const isAdmin = searchParams.get("admin") === "true"

    // Fetch top-level links with their sublinks, ordered by "order"
    // @ts-ignore
    const links = await prisma.navbarLink?.findMany({
      where: {
        parentId: null,
        ...(isAdmin ? {} : { isActive: true })
      },
      include: {
        subLinks: {
          where: isAdmin ? {} : { isActive: true },
          orderBy: { order: 'asc' }
        }
      },
      orderBy: { order: 'asc' }
    })

    return NextResponse.json(links || [])
  } catch (error) {
    console.error("Error fetching navbar links:", error)
    return NextResponse.json({ error: "Failed to fetch navbar links" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    // @ts-ignore
    const newLink = await prisma.navbarLink?.create({
      data: {
        name: body.name,
        href: body.href,
        order: body.order || 0,
        parentId: body.parentId || null,
        isActive: body.isActive !== undefined ? body.isActive : true
      }
    })
    return NextResponse.json(newLink)
  } catch (error) {
    console.error("Error creating navbar link:", error)
    return NextResponse.json({ error: "Failed to create navbar link" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    if (!body.id) return NextResponse.json({ error: "ID is required" }, { status: 400 })

    // @ts-ignore
    const updatedLink = await prisma.navbarLink?.update({
      where: { id: body.id },
      data: {
        name: body.name,
        href: body.href,
        order: body.order,
        parentId: body.parentId !== undefined ? body.parentId : undefined,
        isActive: body.isActive
      }
    })
    return NextResponse.json(updatedLink)
  } catch (error) {
    console.error("Error updating navbar link:", error)
    return NextResponse.json({ error: "Failed to update navbar link" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 })

    // @ts-ignore
    await prisma.navbarLink?.delete({
      where: { id: id }
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting navbar link:", error)
    return NextResponse.json({ error: "Failed to delete navbar link" }, { status: 500 })
  }
}
