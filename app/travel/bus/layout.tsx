import { buildPageMetadata } from "@/lib/seo-metadata"
import { JsonLd, SITE_URL, buildBreadcrumbJsonLd } from "@/components/json-ld"

export const metadata = buildPageMetadata({
  title: "US Bus Route Research & Booking | GoComfortUSA",
  description:
    "Compare intercity US bus routes, departure schedules, and seating options with GoComfortUSA travel consultation and step-by-step booking support.",
  path: "/travel/bus",
  keywords: "US bus route research, intercity bus planning, bus booking assistance, GoComfortUSA",
})

export default function BusLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const breadcrumbSchema = buildBreadcrumbJsonLd([
    { name: "Home", url: SITE_URL },
    { name: "Bus Research", url: `${SITE_URL}/travel/bus` },
  ])

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      {children}
    </>
  )
}
