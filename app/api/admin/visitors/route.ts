import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyAdminAuth } from "@/lib/admin-auth"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET(request: Request) {
  try {
    const auth = await verifyAdminAuth(request)
    if (!auth.authenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const today = new Date().toISOString().split('T')[0]

    const todayVisitors = await prisma.visitorCount.findUnique({
      where: { date: today }
    }).catch(() => null)

    const totalVisitors = await prisma.visitorCount.aggregate({
      _sum: { count: true }
    }).catch(() => ({ _sum: { count: 0 } }))

    return NextResponse.json({
      today: todayVisitors?.count || 0,
      total: totalVisitors._sum?.count || 0
    }, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate"
      }
    })
  } catch (error: any) {
    console.error("Error fetching visitor counts:", error)
    return NextResponse.json(
      { error: "Failed to fetch visitor counts", details: error?.message || String(error) },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const today = new Date().toISOString().split('T')[0]
    
    await prisma.visitorCount.upsert({
      where: { date: today },
      update: { count: { increment: 1 } },
      create: { date: today, count: 1 }
    }).catch(e => console.error("Upsert visitor count error:", e))

    return NextResponse.json({ success: true }, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate"
      }
    })
  } catch (error: any) {
    console.error("Error updating visitor count:", error)
    return NextResponse.json(
      { error: "Failed to update visitor count", details: error?.message || String(error) },
      { status: 500 }
    )
  }
}
