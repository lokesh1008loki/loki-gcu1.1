import { buildPageMetadata } from "@/lib/seo-metadata"
import { JsonLd, SITE_URL, buildBreadcrumbJsonLd } from "@/components/json-ld"

export const metadata = buildPageMetadata({
  title: "US Car Rental Research & Support | GoComfortUSA",
  description:
    "Compare US rental car classes, pickup locations, and full rental terms with GoComfortUSA research specialists before booking with your provider.",
  path: "/travel/car-rental",
  keywords: "US car rental research, rental car comparison, car rental assistance, GoComfortUSA",
})

export default function CarRentalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const breadcrumbSchema = buildBreadcrumbJsonLd([
    { name: "Home", url: SITE_URL },
    { name: "Car Rental Research", url: `${SITE_URL}/travel/car-rental` },
  ])

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      {children}
    </>
  )
}
