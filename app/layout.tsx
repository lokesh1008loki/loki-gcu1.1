import { Inter } from "next/font/google"
import "./globals.css"
import Script from "next/script"
import { metadata, viewport } from "./metadata"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { MarqueeNews } from "@/components/MarqueeNews"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { ClientRoot } from "./client-root"
import { prisma } from "@/lib/prisma"
import { ClientComponents } from "@/components/client-components"
import { headers } from "next/headers"

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
  // Add cache control headers
  const headersList = headers()
  const response = new Response()
  response.headers.set("Cache-Control", "no-store, must-revalidate")
  response.headers.set("Pragma", "no-cache")
  response.headers.set("Expires", "0")

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
    // Use Prisma's type-safe query builder instead of raw SQL
    const seoSettings = await prisma.seoSettings.findFirst()
    
    if (!seoSettings) {
      console.warn('No SEO settings found in database, using defaults')
      throw new Error('No SEO settings found')
    }

    return {
      title: seoSettings.siteTitle,
      description: seoSettings.siteDescription,
      metadataBase: new URL(seoSettings.canonicalUrl),
      icons: {
        icon: "/ass/logo-round.png",
        shortcut: "/ass/logo-round.png",
        apple: "/ass/logo-round.png",
      },
      openGraph: {
        title: seoSettings.ogTitle,
        description: seoSettings.ogDescription,
        images: [{ url: seoSettings.ogImage }],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: seoSettings.twitterTitle,
        description: seoSettings.twitterDescription,
        images: [seoSettings.twitterImage],
      },
      alternates: {
        canonical: seoSettings.canonicalUrl
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

// Add revalidation configuration
export const revalidate = 0

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)
  const headersList = await headers()
  const pathname = headersList.get("x-invoke-path") || ""
  const isAdminPage = pathname.startsWith("/admin")

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {!isAdminPage && (
          <>
            <Script
              src="https://www.googletagmanager.com/gtag/js?id=G-0DNMREQP2X"
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-0DNMREQP2X');
              `}
            </Script>
          </>
        )}
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <ClientRoot session={session}>
          <Navbar />
          <MarqueeNews />
          {children}
          <Footer />
          <ClientComponents />
        </ClientRoot>
      </body>
    </html>
  )
}

import './globals.css'