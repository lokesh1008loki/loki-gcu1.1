import { buildPageMetadata } from "@/lib/seo-metadata"
import { JsonLd, SITE_URL, buildBreadcrumbJsonLd } from "@/components/json-ld"

export const metadata = buildPageMetadata({
  title: "Car Rental Consultation Request | GoComfortUSA",
  description:
    "Submit your US vehicle rental requirements for route and rate research from GoComfortUSA specialists across economy, SUV, and family vehicles.",
  path: "/travel/car",
  keywords: "car rental consultation, US vehicle rental help, GoComfortUSA",
})

export default function CarLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const breadcrumbSchema = buildBreadcrumbJsonLd([
    { name: "Home", url: SITE_URL },
    { name: "Car Rental Consultation", url: `${SITE_URL}/travel/car` },
  ])

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      {children}
    </>
  )
}
