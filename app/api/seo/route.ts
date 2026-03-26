import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

const staticDefaults = {
  siteTitle: "GoComfortUSA - Professional Travel Optimization & Consultation",
  siteDescription: "Expert research and itinerary optimization for domestic flights, hotel stays, and lifestyle services. Smarter travel starts with professional planning.",
  keywords: "travel optimization, flight research, hotel consultation, travel planning, concierge services",
  canonicalUrl: "https://gocomfortusa.com",
  ogTitle: "GoComfortUSA - Professional Travel Optimization & Consultation",
  ogDescription: "Expert research and itinerary optimization for domestic flights, hotel stays, and lifestyle services.",
  ogImage: "/ass/logo-round.png",
  twitterTitle: "GoComfortUSA - Professional Travel Optimization & Consultation",
  twitterDescription: "Expert research and itinerary optimization for domestic flights, hotel stays, and lifestyle services.",
  twitterImage: "/ass/logo-round.png",
  active: false
}

export async function GET() {
  try {
    const settings = await prisma.seoSettings.findFirst()
    console.log('SEO settings from DB:', settings)
    if (!settings || settings.active === false) {
      return NextResponse.json(staticDefaults, {
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
      canonicalUrl,
      active
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
          canonicalUrl,
          active: active !== undefined ? active : true
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
        canonicalUrl,
        active: active !== undefined ? active : settings.active
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