import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST() {
  try {
    const today = new Date().toISOString().split('T')[0]
    
    await prisma.visitorCount.upsert({
      where: { date: today },
      update: { count: { increment: 1 } },
      create: { date: today, count: 1 }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error tracking visitor:', error)
    return NextResponse.json({ error: 'Failed to track visitor' }, { status: 500 })
  }
} 