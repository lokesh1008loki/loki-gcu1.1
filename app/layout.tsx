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
import { JsonLd, ORGANIZATION_JSON_LD } from "@/components/json-ld"

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata() {
  let cleanPathname = "";
  try {
    const headerList = await headers();
    const rawPathname = headerList.get("x-pathname") || "";
    cleanPathname = rawPathname === "/" ? "" : rawPathname.replace(/\/+$/, "");
  } catch (e) {
    // headers() might not be accessible during build-time prerendering
  }

  const siteBase = "https://gocomfortusa.com";
  const pageCanonical = cleanPathname ? `${siteBase}${cleanPathname}` : siteBase;
  const defaultTitle = "GoComfortUSA | US Travel, Hotel & IKEA Order Assistance";
  const defaultDescription =
    "US travel consultation for domestic flights, true total-price hotel checks, Disneyland ticket help, and IKEA ordering with delivery by IKEA. Up to 30% off.";

  try {
    const seoSettings = await prisma.seoSettings.findFirst({
      orderBy: { updatedAt: 'desc' }
    });
    if (!seoSettings || seoSettings.active !== true) {
      return {
        title: defaultTitle,
        description: defaultDescription,
        metadataBase: new URL(siteBase),
        icons: {
          icon: "/ass/logo-round.png",
          shortcut: "/ass/logo-round.png",
          apple: "/ass/logo-round.png",
        },
        openGraph: {
          title: defaultTitle,
          description: defaultDescription,
          url: pageCanonical,
          images: [{ url: "/ass/logo-round.png", alt: "GoComfortUSA" }],
          type: "website",
        },
        twitter: {
          card: "summary_large_image",
          title: defaultTitle,
          description: defaultDescription,
          images: ["/ass/logo-round.png"],
        },
        alternates: {
          canonical: pageCanonical,
        },
        other: {
          cyber: "9fa74b5554f3953be569783694238369",
        },
      };
    }
    const dbSiteBase = (seoSettings.canonicalUrl || siteBase).replace(/\/+$/, "");
    const dbPageCanonical = cleanPathname ? `${dbSiteBase}${cleanPathname}` : dbSiteBase;
    return {
      title: seoSettings.siteTitle || defaultTitle,
      description: seoSettings.siteDescription || defaultDescription,
      metadataBase: new URL(dbSiteBase),
      icons: {
        icon: "/ass/logo-round.png",
        shortcut: "/ass/logo-round.png",
        apple: "/ass/logo-round.png",
      },
      openGraph: {
        title: seoSettings.ogTitle || defaultTitle,
        description: seoSettings.ogDescription || defaultDescription,
        url: dbPageCanonical,
        images: [{ url: seoSettings.ogImage || "/ass/logo-round.png", alt: "GoComfortUSA" }],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: seoSettings.twitterTitle || defaultTitle,
        description: seoSettings.twitterDescription || defaultDescription,
        images: [seoSettings.twitterImage || "/ass/logo-round.png"],
      },
      alternates: {
        canonical: dbPageCanonical,
      },
      other: {
        cyber: "9fa74b5554f3953be569783694238369",
      },
    };
  } catch (error) {
    console.error("Error fetching SEO settings for metadata:", error);
    return {
      title: defaultTitle,
      description: defaultDescription,
      metadataBase: new URL(siteBase),
      icons: {
        icon: "/ass/logo-round.png",
        shortcut: "/ass/logo-round.png",
        apple: "/ass/logo-round.png",
      },
      openGraph: {
        title: defaultTitle,
        description: defaultDescription,
        url: pageCanonical,
        images: [{ url: "/ass/logo-round.png", alt: "GoComfortUSA" }],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: defaultTitle,
        description: defaultDescription,
        images: ["/ass/logo-round.png"],
      },
      alternates: {
        canonical: pageCanonical,
      },
      other: {
        cyber: "9fa74b5554f3953be569783694238369",
      },
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
  const pathname = headersList.get("x-pathname") || headersList.get("x-invoke-path") || ""
  const isAdminPage = pathname.startsWith("/admin")
  
  // Only fetch session for admin pages to improve performance
  const session = isAdminPage ? await getServerSession(authOptions) : null

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="cyber" content="9fa74b5554f3953be569783694238369" />
        {!isAdminPage && <JsonLd data={ORGANIZATION_JSON_LD} />}
        {!isAdminPage && (
          <>
            <Script
              src="https://www.googletagmanager.com/gtag/js?id=AW-18183373348"
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'AW-18183373348');
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
          {(() => {
            const host = headersList.get("host") || "";
            const currentPath = headersList.get("x-pathname") || pathname || "";
            const isSouthwest = currentPath.startsWith("/southwest-airlines") || host.startsWith("southwest.");
            
            if (isAdminPage || isSouthwest) {
              return children;
            }

            return (
              <>
                <Navbar />
                <PerformanceOptimizer showMarquee={true} showPopup={false}>
                  {children}
                </PerformanceOptimizer>
                <Footer />
                <ClientComponents />
              </>
            );
          })()}
        </ClientRoot>
        
        {/* LinkedIn Insight Tag */}
        <Script id="linkedin-insight-init" type="text/javascript" strategy="afterInteractive">
          {`
            window._linkedin_partner_id = "7550706";
            window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
            window._linkedin_data_partner_ids.push(window._linkedin_partner_id);
          `}
        </Script>
        <Script id="linkedin-insight-load" type="text/javascript" strategy="afterInteractive">
          {`
            (function(l) {
              if (!l){window.lintrk = function(a,b){window.lintrk.q.push([a,b])};
              window.lintrk.q=[]
            }
            var s = document.getElementsByTagName("script")[0];
            var b = document.createElement("script");
            b.type = "text/javascript";b.async = true;
            b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
            s.parentNode.insertBefore(b, s);})(window.lintrk);
          `}
        </Script>
        <noscript>
          <img height="1" width="1" style={{display: "none"}} alt="" src="https://px.ads.linkedin.com/collect/?pid=7550706&fmt=gif" />
        </noscript>
      </body>
    </html>
  )
}
