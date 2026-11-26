import { buildPageMetadata } from "@/lib/seo-metadata"
import { JsonLd, SITE_URL, buildBreadcrumbJsonLd } from "@/components/json-ld"

export const metadata = buildPageMetadata({
  title: "Apartment Rent Payment Assistance | GoComfortUSA",
  description:
    "Request apartment and house rent payment coordination for US residents and travel nurses with up to 30% off eligible assistance via GoComfortUSA.",
  path: "/bills/apartment-rental",
  keywords: "apartment rent payment assistance, house rent help USA, travel nurse rent coordination, GoComfortUSA",
})

export default function ApartmentRentalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const breadcrumbSchema = buildBreadcrumbJsonLd([
    { name: "Home", url: SITE_URL },
    { name: "Apartment Rental Assistance", url: `${SITE_URL}/bills/apartment-rental` },
  ])

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      {children}
    </>
  )
}
