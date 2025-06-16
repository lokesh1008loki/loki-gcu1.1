import { Inter } from "next/font/google"
import "./globals.css"
import Script from "next/script"
import { metadata, viewport } from "./metadata"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { PopupNotification } from "@/components/PopupNotification"
import { MarqueeNews } from "@/components/MarqueeNews"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { ClientRoot } from "./client-root"
import { Toaster } from "sonner"
import { prisma } from "@/lib/prisma"

const inter = Inter({ 
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  preload: true,
  fallback: ["system-ui", "arial"],
  adjustFontFallback: true,
})

export { viewport }

interface SeoSettings {
  siteTitle: string
  siteDescription: string
  keywords: string
  ogTitle: string
  ogDescription: string
  ogImage: string
  twitterTitle: string
  twitterDescription: string
  twitterImage: string
  canonicalUrl: string
}

export async function generateMetadata() {
  // Skip database queries during build
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return {
      title: "GocomfortUSA - Best Deals on Tickets and Bill Payments",
      description: "GocomfortUSA offers amazing deals on ticket bookings and bill payments...",
      metadataBase: new URL("https://gocomfortusa.com"),
      icons: {
        icon: "/ass/logo-round.png",
        shortcut: "/ass/logo-round.png",
        apple: "/ass/logo-round.png",
      },
      openGraph: {
        title: "GocomfortUSA - Best Deals on Tickets and Bill Payments",
        description: "Your one-stop solution for tickets and bill payments",
        images: [{ url: "/ass/logo-round.png" }],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: "GocomfortUSA - Best Deals on Tickets and Bill Payments",
        description: "Your one-stop solution for tickets and bill payments",
        images: ["/ass/logo-round.png"],
      },
      alternates: {
        canonical: "https://gocomfortusa.com"
      }
    }
  }

  try {
    const seoSettings = await prisma.$queryRaw<SeoSettings[]>`SELECT * FROM "SeoSettings" LIMIT 1`
    const defaultMetadata = {
      title: "GocomfortUSA - Best Deals on Tickets and Bill Payments",
      description: "GocomfortUSA offers amazing deals on ticket bookings and bill payments...",
      openGraph: {
        title: "GocomfortUSA - Best Deals on Tickets and Bill Payments",
        description: "Your one-stop solution for tickets and bill payments",
      }
    }
    
    return {
      title: seoSettings?.[0]?.siteTitle || defaultMetadata.title,
      description: seoSettings?.[0]?.siteDescription || defaultMetadata.description,
      metadataBase: new URL(seoSettings?.[0]?.canonicalUrl || "https://gocomfortusa.com"),
      icons: {
        icon: "/ass/logo-round.png",
        shortcut: "/ass/logo-round.png",
        apple: "/ass/logo-round.png",
      },
      openGraph: {
        title: seoSettings?.[0]?.ogTitle || defaultMetadata.openGraph.title,
        description: seoSettings?.[0]?.ogDescription || defaultMetadata.openGraph.description,
        images: [{ url: seoSettings?.[0]?.ogImage || "/ass/logo-round.png" }],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: seoSettings?.[0]?.twitterTitle || defaultMetadata.openGraph.title,
        description: seoSettings?.[0]?.twitterDescription || defaultMetadata.openGraph.description,
        images: [seoSettings?.[0]?.twitterImage || "/ass/logo-round.png"],
      },
      alternates: {
        canonical: seoSettings?.[0]?.canonicalUrl || "https://gocomfortusa.com"
      }
    }
  } catch (error) {
    console.error('Error fetching SEO settings:', error)
    // Return default metadata if database query fails
    return {
      title: "GocomfortUSA - Best Deals on Tickets and Bill Payments",
      description: "GocomfortUSA offers amazing deals on ticket bookings and bill payments...",
      metadataBase: new URL("https://gocomfortusa.com"),
      icons: {
        icon: "/ass/logo-round.png",
        shortcut: "/ass/logo-round.png",
        apple: "/ass/logo-round.png",
      },
      openGraph: {
        title: "GocomfortUSA - Best Deals on Tickets and Bill Payments",
        description: "Your one-stop solution for tickets and bill payments",
        images: [{ url: "/ass/logo-round.png" }],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: "GocomfortUSA - Best Deals on Tickets and Bill Payments",
        description: "Your one-stop solution for tickets and bill payments",
        images: ["/ass/logo-round.png"],
      },
      alternates: {
        canonical: "https://gocomfortusa.com"
      }
    }
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ClientRoot session={session}>
          <Navbar />
          <MarqueeNews />
          <PopupNotification />
          {children}
          <Footer />
          <Toaster />
        </ClientRoot>
      </body>
    </html>
  )
}

import './globals.css'