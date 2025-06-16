import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { headers } from "next/headers"

// Cache duration in seconds (5 minutes)
const CACHE_DURATION = 300

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request: Request) {
  console.log("Popup API route called")
  try {
    // First check if the table exists
    try {
      console.log("Checking for existing popup...")
      
      // Get the current path from the referer header
      const referer = request.headers.get("referer") || ""
      const path = new URL(referer).pathname || "/"
      console.log("Current path:", path)
      
      // First, let's check all popups to see what's in the database
      const allPopups = await prisma.popupNotification.findMany({
        orderBy: {
          createdAt: 'desc',
        },
      })
      console.log("All popups in database:", allPopups)

      const popup = await prisma.popupNotification.findFirst({
        where: {
          isActive: true,
          showOnPages: {
            has: path
          },
          OR: [
            // Case 1: No dates set (always active)
            {
              startDate: null,
              endDate: null
            },
            // Case 2: Only start date set (active from start date onwards)
            {
              startDate: {
                lte: new Date()
              },
              endDate: null
            },
            // Case 3: Only end date set (active until end date)
            {
              startDate: null,
              endDate: {
                gte: new Date()
              }
            },
            // Case 4: Both dates set (active between start and end)
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

      console.log("Found popup:", popup)

      if (!popup) {
        console.log("No active popup found")
        return NextResponse.json({ 
          message: "No active popup found",
          popup: null 
        })
      }

      console.log("Found existing popup:", popup)
      // Ensure content is not null or undefined
      const formattedPopup = {
        ...popup,
        content: popup.message || "No content available",
        title: popup.title || "Notification"
      }

      return NextResponse.json({ 
        message: "Popup retrieved successfully",
        popup: formattedPopup
      })
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
        })
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