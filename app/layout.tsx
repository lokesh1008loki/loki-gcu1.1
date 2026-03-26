import { Inter } from "next/font/google"
import "./globals.css"
import Script from "next/script"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { ClientRoot } from "./client-root"
import { ClientComponents } from "@/components/client-components"
import { PerformanceOptimizer } from "@/components/performance-optimizer"
import { headers } from "next/headers"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata() {
  try {
    const seoSettings = await prisma.seoSettings.findFirst({
      orderBy: { updatedAt: 'desc' }
    });
    console.log("SeoSettings record:", seoSettings, "active type:", typeof seoSettings?.active);
    if (!seoSettings || seoSettings.active !== true) {
      console.log("Falling back to static metadata because SEO is inactive or missing");
      return {
        title: "GoComfortUSA - Professional Travel Assistance & Consultation | Flights, Hotels & More",
        description: "Personalized travel research and assistance for flights, hotels, and lifestyle services. Get expert booking guidance and route optimization tailored to your needs.",
        metadataBase: new URL("https://gocomfortusa.com"),
        icons: {
          icon: "/ass/logo-round.png",
          shortcut: "/ass/logo-round.png",
          apple: "/ass/logo-round.png",
        },
        openGraph: {
          title: "GoComfortUSA - Professional Travel Assistance & Planning",
          description: "Get personalized flight and hotel options, optimized routes, and expert booking guidance tailored to your trip.",
          images: [{ url: "/ass/logo-round.png" }],
          type: "website",
        },
        twitter: {
          card: "summary_large_image",
          title: "GoComfortUSA - Travel Assistance & Consultation",
          description: "Expert travel research and assistance for your next trip. Flights, hotels, and route optimization made easy.",
          images: ["/ass/logo-round.png"],
        },
        alternates: {
          canonical: "https://gocomfortusa.com"
        }
      };
    }
    console.log("SEO settings used in metadata:", seoSettings);
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
    };
  } catch (error) {
    console.error("Error fetching SEO settings for metadata:", error);
    return {
      title: "GoComfortUSA - Professional Travel Assistance & Consultation",
      description: "GoComfortUSA provides personalized travel assistance including flight and hotel research, planning, and expert booking support for a hassle-free travel experience.",
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
    };
  }
}

const inter = Inter({ 
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  preload: true,
  fallback: ["system-ui", "arial"],
  adjustFontFallback: true,
})

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Only fetch session if needed (admin pages)
  const headersList = await headers()
  const pathname = headersList.get("x-invoke-path") || ""
  const isAdminPage = pathname.startsWith("/admin")
  
  // Only fetch session for admin pages to improve performance
  const session = isAdminPage ? await getServerSession(authOptions) : null

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
            <Script id="performance-monitor" strategy="afterInteractive">
              {`
                // Performance monitoring script
                if (typeof window !== 'undefined') {
                  window.addEventListener('load', () => {
                    const navigation = performance.getEntriesByType('navigation')[0];
                    const paint = performance.getEntriesByType('paint');
                    
                    const metrics = {
                      domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
                      loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
                      totalLoadTime: navigation.loadEventEnd - navigation.fetchStart,
                      firstPaint: paint.find(entry => entry.name === 'first-paint')?.startTime || 0,
                      firstContentfulPaint: paint.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0,
                      resourceCount: performance.getEntriesByType('resource').length
                    };
                    
                    console.log('Performance Metrics:', metrics);
                    
                    if (metrics.totalLoadTime > 2000) {
                      console.warn('⚠️ Page load time is slow:', Math.round(metrics.totalLoadTime), 'ms');
                    } else if (metrics.totalLoadTime < 400) {
                      console.log('✅ Page load time is excellent:', Math.round(metrics.totalLoadTime), 'ms');
                    }
                  });
                }
              `}
            </Script>
          </>
        )}
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <ClientRoot session={session}>
          {isAdminPage ? (
            // Admin pages - no navbar, footer, or performance components
            children
          ) : (
            // Regular pages - full layout with navbar, footer, and performance components
            <>
              <Navbar />
              <PerformanceOptimizer showMarquee={true} showPopup={true}>
                {children}
              </PerformanceOptimizer>
              <Footer />
              <ClientComponents />
            </>
          )}
        </ClientRoot>
        
        {/* LinkedIn Insight Tag */}
        <script type="text/javascript" dangerouslySetInnerHTML={{
          __html: `
            _linkedin_partner_id = "7550706";
            window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
            window._linkedin_data_partner_ids.push(_linkedin_partner_id);
          `
        }} />
        <script type="text/javascript" dangerouslySetInnerHTML={{
          __html: `
            (function(l) {
              if (!l){window.lintrk = function(a,b){window.lintrk.q.push([a,b])};
              window.lintrk.q=[]
            }
            var s = document.getElementsByTagName("script")[0];
            var b = document.createElement("script");
            b.type = "text/javascript";b.async = true;
            b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
            s.parentNode.insertBefore(b, s);})(window.lintrk);
          `
        }} />
        <noscript>
          <img height="1" width="1" style={{display: "none"}} alt="" src="https://px.ads.linkedin.com/collect/?pid=7550706&fmt=gif" />
        </noscript>
      </body>
    </html>
  )
}