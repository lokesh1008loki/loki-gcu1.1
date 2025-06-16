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
      const messages = await prisma.marqueeMessage.findMany({
        where: {
          isActive: true
        },
        orderBy: {
          createdAt: 'desc'
        },
        // Limit the number of messages to improve performance
        take: 10
      })

      if (!messages || messages.length === 0) {
        return NextResponse.json([], { headers: response.headers })
      }

      // Filter out messages that are just numbers
      const filteredMessages = messages.filter((msg: { message: string }) => !/^\d+$/.test(msg.message.trim()))

      return NextResponse.json(filteredMessages, { headers: response.headers })
    } catch (tableError) {
      console.error("Database error:", tableError)
      // If the table doesn't exist yet, return an empty array
      if (tableError instanceof Error && 
          (tableError.message.includes("does not exist") || 
           tableError.message.includes("relation") ||
           tableError.message.includes("table"))) {
        return NextResponse.json([], { headers: response.headers })
      }
      throw tableError; // Re-throw other errors
    }
  } catch (error) {
    console.error("Error fetching marquee messages:", error)
    return NextResponse.json(
      { error: "Failed to fetch marquee messages", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
} 