import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { headers } from "next/headers"

// Cache duration in seconds (5 minutes)
const CACHE_DURATION = 300

export async function GET() {
  try {
    // Add cache control headers
    const headersList = headers()
    const response = new NextResponse()
    
    // Set cache control headers
    response.headers.set('Cache-Control', `public, s-maxage=${CACHE_DURATION}, stale-while-revalidate=${CACHE_DURATION * 2}`)
    
    // Check if the table exists first
    try {
      const popups = await (prisma as any).PopupNotification.findMany({
        where: {
          isActive: true,
          startDate: {
            lte: new Date()
          },
          endDate: {
            gte: new Date()
          }
        },
        orderBy: {
          priority: 'desc'
        },
        // Limit the number of popups to improve performance
        take: 5
      })

      if (!popups || popups.length === 0) {
        return NextResponse.json([], { headers: response.headers })
      }

      return NextResponse.json(popups, { headers: response.headers })
    } catch (tableError) {
      // If the table doesn't exist yet, return an empty array
      if (tableError instanceof Error && tableError.message.includes("does not exist")) {
        return NextResponse.json([], { headers: response.headers })
      }
      throw tableError; // Re-throw other errors
    }
  } catch (error) {
    console.error("Error fetching popups:", error)
    return NextResponse.json(
      { error: "Failed to fetch popups", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
} 