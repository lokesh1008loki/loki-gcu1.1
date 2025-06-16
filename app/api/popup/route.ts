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
    
    // First check if the table exists
    try {
      const popup = await prisma.popupNotification.findFirst({
        where: {
          isActive: true,
          OR: [
            {
              startDate: null,
              endDate: null
            },
            {
              startDate: {
                lte: new Date()
              },
              endDate: {
                gte: new Date()
              }
            }
          ]
        },
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          id: true,
          title: true,
          message: true,
          isActive: true,
          startDate: true,
          endDate: true,
          createdAt: true,
          updatedAt: true,
        }
      })

      if (!popup) {
        return NextResponse.json({ 
          message: "No active popup found",
          popup: null 
        }, { headers: response.headers })
      }

      // Ensure content is not null or undefined
      const formattedPopup = {
        ...popup,
        content: popup.message || "No content available",
        title: popup.title || "Notification"
      }

      return NextResponse.json({ 
        message: "Popup retrieved successfully",
        popup: formattedPopup
      }, { headers: response.headers })
    } catch (dbError) {
      console.error("Database error:", dbError)
      // If the table doesn't exist yet, return null
      if (dbError instanceof Error && 
          (dbError.message.includes("does not exist") || 
           dbError.message.includes("relation") ||
           dbError.message.includes("table"))) {
        console.log("PopupNotification table does not exist yet")
        return NextResponse.json({ 
          message: "No popup table found",
          popup: null 
        }, { headers: response.headers })
      }
      throw dbError
    }
  } catch (error) {
    console.error('Error fetching popup:', error)
    return NextResponse.json({ 
      error: "Failed to fetch popup",
      message: error instanceof Error ? error.message : "An error occurred while fetching the popup"
    }, { status: 500 })
  }
} 