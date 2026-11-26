import { buildPageMetadata } from "@/lib/seo-metadata"
import { JsonLd, SITE_URL, buildBreadcrumbJsonLd } from "@/components/json-ld"

export const metadata = buildPageMetadata({
  title: "Universal Studios Ticket Assistance | GoComfortUSA",
  description:
    "Request Universal Studios Orlando and Hollywood ticket research, Park-to-Park planning, and Express Pass guidance from GoComfortUSA specialists.",
  path: "/tickets/universal-studios",
  keywords: "Universal Studios tickets help, Universal Orlando planning, Universal Hollywood tickets, GoComfortUSA",
})

export default function UniversalStudiosLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const breadcrumbSchema = buildBreadcrumbJsonLd([
    { name: "Home", url: SITE_URL },
    { name: "Universal Studios Tickets", url: `${SITE_URL}/tickets/universal-studios` },
  ])

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      {children}
    </>
  )
}
