import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

const staticDefaults = {
  siteTitle: "GocomfortUSA - Best Deals on Tickets and Bill Payments",
  siteDescription: "GocomfortUSA offers amazing deals on ticket bookings and bill payments, flight ticket bookings, House rent payment and many more services, ensuring you get the best discounts and a hassle-free experience. Save on everything from travel to living.",
  keywords: "tickets, bill payments, flight tickets, house rent, travel deals, discounts",
  canonicalUrl: "https://gocomfortusa.com",
  ogTitle: "GocomfortUSA - Best Deals on Tickets and Bill Payments",
  ogDescription: "Your one-stop solution for tickets and bill payments",
  ogImage: "/ass/logo-round.png",
  twitterTitle: "GocomfortUSA - Best Deals on Tickets and Bill Payments",
  twitterDescription: "Your one-stop solution for tickets and bill payments",
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