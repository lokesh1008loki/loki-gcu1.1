import { buildPageMetadata } from "@/lib/seo-metadata"
import { JsonLd, SITE_URL, buildBreadcrumbJsonLd } from "@/components/json-ld"

export const metadata = buildPageMetadata({
  title: "Cruise Itinerary Research & Help | GoComfortUSA",
  description:
    "Plan US departure cruises with GoComfortUSA research on cabin categories, ports, and major cruise lines before booking through official providers.",
  path: "/travel/cruise",
  keywords: "US cruise research, cruise itinerary consultation, cruise planning help, GoComfortUSA",
})

export default function CruiseLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const breadcrumbSchema = buildBreadcrumbJsonLd([
    { name: "Home", url: SITE_URL },
    { name: "Cruise Research", url: `${SITE_URL}/travel/cruise` },
  ])

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      {children}
    </>
  )
}
