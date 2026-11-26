import { buildPageMetadata } from "@/lib/seo-metadata"
import { JsonLd, SITE_URL, buildBreadcrumbJsonLd } from "@/components/json-ld"

export const metadata = buildPageMetadata({
  title: "Adventure Park Ticket Assistance | GoComfortUSA",
  description:
    "Request admission research and itinerary planning for US adventure and thrill parks with GoComfortUSA consultation and dedicated trip support.",
  path: "/tickets/adventure-park",
  keywords: "adventure park tickets USA, thrill park planning, theme park assistance, GoComfortUSA",
})

export default function AdventureParkLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const breadcrumbSchema = buildBreadcrumbJsonLd([
    { name: "Home", url: SITE_URL },
    { name: "Adventure Park Tickets", url: `${SITE_URL}/tickets/adventure-park` },
  ])

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      {children}
    </>
  )
}
