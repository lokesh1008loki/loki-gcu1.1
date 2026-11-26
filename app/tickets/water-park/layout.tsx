import { buildPageMetadata } from "@/lib/seo-metadata"
import { JsonLd, SITE_URL, buildBreadcrumbJsonLd } from "@/components/json-ld"

export const metadata = buildPageMetadata({
  title: "US Water Park Ticket Assistance | GoComfortUSA",
  description:
    "Plan visits to major US water parks with GoComfortUSA research and group admission support for families and seasonal trips across the United States.",
  path: "/tickets/water-park",
  keywords: "US water park tickets, water park trip planning, family water park assistance, GoComfortUSA",
})

export default function WaterParkLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const breadcrumbSchema = buildBreadcrumbJsonLd([
    { name: "Home", url: SITE_URL },
    { name: "Water Park Tickets", url: `${SITE_URL}/tickets/water-park` },
  ])

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      {children}
    </>
  )
}
