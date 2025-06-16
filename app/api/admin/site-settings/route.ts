import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { headers } from "next/headers"

const CACHE_DURATION = 300 // 5 minutes

export async function GET() {
  try {
    // Set cache control headers
    const headersList = headers()
    const response = NextResponse.json({})

    response.headers.set(
      "Cache-Control",
      `public, s-maxage=${CACHE_DURATION}, stale-while-revalidate=${CACHE_DURATION * 2}`
    )

    // Fetch site settings from the database
    // @ts-ignore - Prisma client type issue
    const settings = await prisma.siteSettings.findFirst()

    if (!settings) {
      return NextResponse.json({
        whatsappLink: "",
        facebookLink: "",
        instagramLink: "",
        twitterLink: "",
        phoneNumber: "",
        email: "",
      })
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error("Error fetching site settings:", error)
    return NextResponse.json(
      { error: "Failed to fetch site settings" },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    
    // @ts-ignore - Prisma client type issue
    const existingSettings = await prisma.siteSettings.findFirst()
    
    if (existingSettings) {
      // Update existing settings
      // @ts-ignore - Prisma client type issue
      const updatedSettings = await prisma.siteSettings.update({
        where: { id: existingSettings.id },
        data: {
          whatsappLink: body.whatsappLink,
          facebookLink: body.facebookLink,
          instagramLink: body.instagramLink,
          twitterLink: body.twitterLink,
          phoneNumber: body.phoneNumber,
          email: body.email,
        },
      })
      
      return NextResponse.json(updatedSettings)
    } else {
      // Create new settings
      // @ts-ignore - Prisma client type issue
      const newSettings = await prisma.siteSettings.create({
        data: {
          whatsappLink: body.whatsappLink,
          facebookLink: body.facebookLink,
          instagramLink: body.instagramLink,
          twitterLink: body.twitterLink,
          phoneNumber: body.phoneNumber,
          email: body.email,
        },
      })
      
      return NextResponse.json(newSettings)
    }
  } catch (error) {
    console.error("Error updating site settings:", error)
    return NextResponse.json(
      { error: "Failed to update site settings" },
      { status: 500 }
    )
  }
} 