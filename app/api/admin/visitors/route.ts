import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    console.log("Fetching visitor counts...")
    
    // Get current date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0]
    
    // Check if the table exists
    const tableExists = await prisma.$queryRaw<[{ exists: boolean }]>`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'VisitorCount'
      )
    `
    
    if (!tableExists[0].exists) {
      console.log("VisitorCount table does not exist")
      return NextResponse.json({
        today: 0,
        total: 0
      })
    }

    // Get today's visitors excluding admin panel
    const todayVisitors = await prisma.visitorCount.findUnique({
      where: { date: today }
    })

    // Get total visitors excluding admin panel
    const totalVisitors = await prisma.visitorCount.aggregate({
      _sum: { count: true }
    })

    console.log("Visitor counts fetched successfully:", {
      today: todayVisitors?.count || 0,
      total: totalVisitors._sum.count || 0
    })

    return NextResponse.json({
      today: todayVisitors?.count || 0,
      total: totalVisitors._sum.count || 0
    })
  } catch (error) {
    console.error("Error fetching visitor counts:", error)
    if (error instanceof Error) {
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
        name: error.name
      })
    }
    return NextResponse.json(
      { error: "Failed to fetch visitor counts", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    console.log("Updating visitor count...")
    const today = new Date().toISOString().split('T')[0]
    
    // Check if the table exists
    const tableExists = await prisma.$queryRaw<[{ exists: boolean }]>`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'VisitorCount'
      )
    `
    
    if (!tableExists[0].exists) {
      console.log("VisitorCount table does not exist")
      return NextResponse.json({ success: false, error: "Table does not exist" })
    }
    
    // Only increment if not in admin panel
    const path = new URL(request.url).pathname
    if (!path.startsWith('/admin')) {
      const updatedCount = await prisma.visitorCount.upsert({
        where: { date: today },
        update: { count: { increment: 1 } },
        create: { date: today, count: 1 }
      })
      console.log("Visitor count updated:", updatedCount)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating visitor count:", error)
    if (error instanceof Error) {
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
        name: error.name
      })
    }
    return NextResponse.json(
      { error: "Failed to update visitor count", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
} 