import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyAdminAuth } from "@/lib/admin-auth"
import { revalidatePath } from "next/cache"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET(request: Request) {
  try {
    const auth = await verifyAdminAuth(request)
    if (!auth.authenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const settings = await prisma.seoSettings.findFirst()
    
    if (!settings) {
      const defaultSettings = await prisma.seoSettings.create({
        data: {
          siteTitle: "GoComfortUSA - Professional Travel Optimization & Consultation",
          siteDescription: "Expert research and itinerary optimization for domestic flights, hotel stays, and lifestyle services.",
          keywords: "travel optimization, flight research, hotel consultation, travel planning, concierge services",
          canonicalUrl: "https://gocomfortusa.com",
          active: true
        }
      })
      return NextResponse.json(defaultSettings, {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate"
        }
      })
    }

    return NextResponse.json(settings, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate"
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
    const auth = await verifyAdminAuth(request)
    if (!auth.authenticated) {
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
      canonicalUrl,
      active
    } = body

    const settings = await prisma.seoSettings.findFirst()
    
    let savedSettings
    if (!settings) {
      savedSettings = await prisma.seoSettings.create({
        data: {
          siteTitle: siteTitle || "",
          siteDescription: siteDescription || "",
          keywords: keywords || "",
          ogTitle: ogTitle || "",
          ogDescription: ogDescription || "",
          ogImage: ogImage || "",
          twitterTitle: twitterTitle || "",
          twitterDescription: twitterDescription || "",
          twitterImage: twitterImage || "",
          canonicalUrl: canonicalUrl || "https://gocomfortusa.com",
          active: active !== undefined ? active : true
        }
      })
    } else {
      savedSettings = await prisma.seoSettings.update({
        where: { id: settings.id },
        data: {
          ...(siteTitle !== undefined && { siteTitle }),
          ...(siteDescription !== undefined && { siteDescription }),
          ...(keywords !== undefined && { keywords }),
          ...(ogTitle !== undefined && { ogTitle }),
          ...(ogDescription !== undefined && { ogDescription }),
          ...(ogImage !== undefined && { ogImage }),
          ...(twitterTitle !== undefined && { twitterTitle }),
          ...(twitterDescription !== undefined && { twitterDescription }),
          ...(twitterImage !== undefined && { twitterImage }),
          ...(canonicalUrl !== undefined && { canonicalUrl }),
          ...(active !== undefined && { active })
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
