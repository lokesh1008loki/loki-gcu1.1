import { buildPageMetadata } from "@/lib/seo-metadata"
import { JsonLd, SITE_URL, buildBreadcrumbJsonLd } from "@/components/json-ld"

export const metadata = buildPageMetadata({
  title: "SeaWorld Ticket Planning Help | GoComfortUSA",
  description:
    "Get SeaWorld ticket research and visit planning support across US locations with GoComfortUSA consultation for single-day and multi-park visits.",
  path: "/tickets/sea-world",
  keywords: "SeaWorld ticket help, SeaWorld visit planning, US theme park assistance, GoComfortUSA",
})

export default function SeaWorldLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const breadcrumbSchema = buildBreadcrumbJsonLd([
    { name: "Home", url: SITE_URL },
    { name: "SeaWorld Tickets", url: `${SITE_URL}/tickets/sea-world` },
  ])

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      {children}
    </>
  )
}
