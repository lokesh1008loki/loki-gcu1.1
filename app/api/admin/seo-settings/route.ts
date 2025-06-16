import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { headers } from "next/headers"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Set cache control headers
    const headersList = headers()
    const response = NextResponse.json({})
    response.headers.set("Cache-Control", "no-store, must-revalidate")
    response.headers.set("Pragma", "no-cache")
    response.headers.set("Expires", "0")

    const settings = await prisma.seoSettings.findFirst()
    
    if (!settings) {
      // Create default settings if none exist
      const defaultSettings = await prisma.seoSettings.create({
        data: {}
      })
      return NextResponse.json(defaultSettings, {
        headers: {
          "Cache-Control": "no-store, must-revalidate",
          "Pragma": "no-cache",
          "Expires": "0"
        }
      })
    }

    return NextResponse.json(settings, {
      headers: {
        "Cache-Control": "no-store, must-revalidate",
        "Pragma": "no-cache",
        "Expires": "0"
      }
    })
  } catch (error) {
    console.error("Error fetching SEO settings:", error)
    return NextResponse.json(
      { error: "Failed to fetch SEO settings" },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const {
      siteTitle,
      siteDescription,
      keywords,
      ogTitle,
      ogDescription,
      ogImage,
      twitterTitle,
      twitterDescription,
      twitterImage,
      canonicalUrl
    } = body

    const settings = await prisma.seoSettings.findFirst()
    
    if (!settings) {
      // Create new settings if none exist
      const newSettings = await prisma.seoSettings.create({
        data: {
          siteTitle,
          siteDescription,
          keywords,
          ogTitle,
          ogDescription,
          ogImage,
          twitterTitle,
          twitterDescription,
          twitterImage,
          canonicalUrl
        }
      })
      return NextResponse.json(newSettings)
    }

    // Update existing settings
    const updatedSettings = await prisma.seoSettings.update({
      where: { id: settings.id },
      data: {
        siteTitle,
        siteDescription,
        keywords,
        ogTitle,
        ogDescription,
        ogImage,
        twitterTitle,
        twitterDescription,
        twitterImage,
        canonicalUrl
      }
    })

    return NextResponse.json(updatedSettings)
  } catch (error) {
    console.error("Error updating SEO settings:", error)
    return NextResponse.json(
      { error: "Failed to update SEO settings" },
      { status: 500 }
    )
  }
} 