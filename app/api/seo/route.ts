import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export const dynamic = "force-dynamic"
export const revalidate = 0

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

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const isAdmin = url.searchParams.get("admin") === "true"

    const settings = await prisma.seoSettings.findFirst()
    
    // If admin is requesting, ALWAYS return the saved settings so they can view and edit them
    if (isAdmin || settings) {
      if (settings) {
        return NextResponse.json(settings, {
          headers: {
            "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
            "Pragma": "no-cache",
            "Expires": "0"
          }
        })
      }
    }

    if (!settings || settings.active === false) {
      return NextResponse.json(staticDefaults, {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          "Pragma": "no-cache",
          "Expires": "0"
        }
      })
    }

    return NextResponse.json(settings, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
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
    
    let savedSettings
    if (!settings) {
      savedSettings = await prisma.seoSettings.create({
        data: {
          siteTitle: siteTitle || staticDefaults.siteTitle,
          siteDescription: siteDescription || staticDefaults.siteDescription,
          keywords: keywords || staticDefaults.keywords,
          ogTitle: ogTitle || staticDefaults.ogTitle,
          ogDescription: ogDescription || staticDefaults.ogDescription,
          ogImage: ogImage || staticDefaults.ogImage,
          twitterTitle: twitterTitle || staticDefaults.twitterTitle,
          twitterDescription: twitterDescription || staticDefaults.twitterDescription,
          twitterImage: twitterImage || staticDefaults.twitterImage,
          canonicalUrl: canonicalUrl || staticDefaults.canonicalUrl,
          active: active !== undefined ? active : true
        }
      })
    } else {
      savedSettings = await prisma.seoSettings.update({
        where: { id: settings.id },
        data: {
          siteTitle: siteTitle !== undefined ? siteTitle : settings.siteTitle,
          siteDescription: siteDescription !== undefined ? siteDescription : settings.siteDescription,
          keywords: keywords !== undefined ? keywords : settings.keywords,
          ogTitle: ogTitle !== undefined ? ogTitle : settings.ogTitle,
          ogDescription: ogDescription !== undefined ? ogDescription : settings.ogDescription,
          ogImage: ogImage !== undefined ? ogImage : settings.ogImage,
          twitterTitle: twitterTitle !== undefined ? twitterTitle : settings.twitterTitle,
          twitterDescription: twitterDescription !== undefined ? twitterDescription : settings.twitterDescription,
          twitterImage: twitterImage !== undefined ? twitterImage : settings.twitterImage,
          canonicalUrl: canonicalUrl !== undefined ? canonicalUrl : settings.canonicalUrl,
          active: active !== undefined ? active : settings.active
        }
      })
    }

    try {
      revalidatePath("/", "layout")
      revalidatePath("/admin/dashboard/seo")
    } catch (e) {
      console.error("Revalidation error:", e)
    }

    return NextResponse.json(savedSettings, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate"
      }
    })
  } catch (error: any) {
    console.error("Error updating SEO settings:", error)
    return NextResponse.json(
      { error: "Failed to update SEO settings", details: error?.message || String(error) },
      { status: 500 }
    )
  }
}
