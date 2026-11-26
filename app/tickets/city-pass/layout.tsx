import { buildPageMetadata } from "@/lib/seo-metadata"
import { JsonLd, SITE_URL, buildBreadcrumbJsonLd } from "@/components/json-ld"

export const metadata = buildPageMetadata({
  title: "CityPASS Multi-Attraction Help | GoComfortUSA",
  description:
    "Compare multi-attraction CityPASS bundles for major US cities with GoComfortUSA itinerary research and booking guidance for sightseeing trips.",
  path: "/tickets/city-pass",
  keywords: "CityPASS US attractions, multi-attraction pass help, city sightseeing tickets, GoComfortUSA",
})

export default function CityPassLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const breadcrumbSchema = buildBreadcrumbJsonLd([
    { name: "Home", url: SITE_URL },
    { name: "CityPASS", url: `${SITE_URL}/tickets/city-pass` },
  ])

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      {children}
    </>
  )
}
