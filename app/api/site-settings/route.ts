import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

const defaultSettings = {
  whatsappLink: "https://whatsapp.com",
  facebookLink: "https://facebook.com",
  instagramLink: "https://instagram.com",
  twitterLink: "https://twitter.com",
  phoneNumber: "+1 437 849 7841",
  email: "support@gocomfortusa.com",
}

export async function GET() {
  try {
    // Try to fetch settings from the database
    try {
      // @ts-ignore - Prisma client type issue
      const settings = await prisma.siteSettings?.findFirst()
      if (settings) {
        return NextResponse.json(settings)
      }
    } catch (dbError) {
      console.error("Database error:", dbError)
    }

    // If we can't fetch from database, return default settings
    return NextResponse.json(defaultSettings)
  } catch (error) {
    console.error("Error in site settings route:", error)
    // Return default settings as fallback
    return NextResponse.json(defaultSettings)
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.phoneNumber || !body.email) {
      return NextResponse.json(
        { error: "Phone number and email are required" },
        { status: 400 }
      )
    }
    
    try {
      // @ts-ignore - Prisma client type issue
      const existingSettings = await prisma.siteSettings?.findFirst()
      
      if (existingSettings) {
        // @ts-ignore - Prisma client type issue
        const updatedSettings = await prisma.siteSettings?.update({
          where: { id: existingSettings.id },
          data: {
            whatsappLink: body.whatsappLink || existingSettings.whatsappLink,
            facebookLink: body.facebookLink || existingSettings.facebookLink,
            instagramLink: body.instagramLink || existingSettings.instagramLink,
            twitterLink: body.twitterLink || existingSettings.twitterLink,
            phoneNumber: body.phoneNumber,
            email: body.email,
          },
        })
        
        return NextResponse.json(updatedSettings)
      } else {
        // @ts-ignore - Prisma client type issue
        const newSettings = await prisma.siteSettings?.create({
          data: {
            whatsappLink: body.whatsappLink || defaultSettings.whatsappLink,
            facebookLink: body.facebookLink || defaultSettings.facebookLink,
            instagramLink: body.instagramLink || defaultSettings.instagramLink,
            twitterLink: body.twitterLink || defaultSettings.twitterLink,
            phoneNumber: body.phoneNumber,
            email: body.email,
          },
        })
        
        return NextResponse.json(newSettings)
      }
    } catch (dbError) {
      console.error("Database error:", dbError)
      return NextResponse.json(
        { error: "Failed to update settings in database" },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error("Error updating site settings:", error)
    return NextResponse.json(
      { error: "Failed to update site settings" },
      { status: 500 }
    )
  }
} 