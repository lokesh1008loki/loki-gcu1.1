import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { verifyAdminAuth } from "@/lib/admin-auth"

export const dynamic = "force-dynamic"
export const revalidate = 0

const defaultSettings = {
  whatsappLink: "https://whatsapp.com",
  facebookLink: "https://facebook.com",
  instagramLink: "https://instagram.com",
  twitterLink: "https://twitter.com",
  phoneNumber: "+1(210) 418-2745",
  email: "support@gocomfortusa.com",
  address: "30 N Gould St Ste R, Sheridan, WY 82801, USA",
  consultationPrice: "29",
  consultationLink: "/tickets/water-park"
}

export async function GET() {
  try {
    const settings = await prisma.siteSettings.findFirst()
    if (settings) {
      const s = settings as any
      return NextResponse.json({
        ...settings,
        address: s.address || defaultSettings.address,
        consultationPrice: s.consultationPrice || defaultSettings.consultationPrice,
        consultationLink: s.consultationLink || defaultSettings.consultationLink
      }, {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          "Pragma": "no-cache",
          "Expires": "0"
        }
      })
    }

    return NextResponse.json(defaultSettings, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Pragma": "no-cache",
        "Expires": "0"
      }
    })
  } catch (error) {
    console.error("Error in site settings GET route:", error)
    return NextResponse.json(defaultSettings, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate"
      }
    })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    
    if (!body.phoneNumber && !body.email) {
      return NextResponse.json(
        { error: "Phone number or email is required" },
        { status: 400 }
      )
    }

    const existingSettings = await prisma.siteSettings.findFirst()
    
    const dataToSave = {
      whatsappLink: body.whatsappLink !== undefined ? body.whatsappLink : (existingSettings?.whatsappLink || defaultSettings.whatsappLink),
      facebookLink: body.facebookLink !== undefined ? body.facebookLink : (existingSettings?.facebookLink || defaultSettings.facebookLink),
      instagramLink: body.instagramLink !== undefined ? body.instagramLink : (existingSettings?.instagramLink || defaultSettings.instagramLink),
      twitterLink: body.twitterLink !== undefined ? body.twitterLink : (existingSettings?.twitterLink || defaultSettings.twitterLink),
      phoneNumber: body.phoneNumber || (existingSettings?.phoneNumber || defaultSettings.phoneNumber),
      email: body.email || (existingSettings?.email || defaultSettings.email),
      address: body.address !== undefined ? body.address : ((existingSettings as any)?.address || defaultSettings.address),
      consultationPrice: body.consultationPrice !== undefined ? body.consultationPrice : ((existingSettings as any)?.consultationPrice || defaultSettings.consultationPrice),
      consultationLink: body.consultationLink !== undefined ? body.consultationLink : ((existingSettings as any)?.consultationLink || defaultSettings.consultationLink)
    }

    let savedSettings
    if (existingSettings) {
      savedSettings = await prisma.siteSettings.update({
        where: { id: existingSettings.id },
        data: dataToSave
      })
    } else {
      savedSettings = await prisma.siteSettings.create({
        data: dataToSave
      })
    }

    try {
      revalidatePath("/")
      revalidatePath("/about")
      revalidatePath("/contact")
      revalidatePath("/admin/site-settings")
    } catch (e) {
      console.error("Revalidation error:", e)
    }

    return NextResponse.json(savedSettings, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate"
      }
    })
  } catch (error: any) {
    console.error("Error updating site settings:", error)
    return NextResponse.json(
      { error: "Failed to update site settings", details: error?.message || String(error) },
      { status: 500 }
    )
  }
}
