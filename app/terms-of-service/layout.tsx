import { buildPageMetadata } from "@/lib/seo-metadata"
import { JsonLd, SITE_URL, buildBreadcrumbJsonLd } from "@/components/json-ld"

export const metadata = buildPageMetadata({
  title: "Terms of Service | GoComfortUSA",
  description:
    "Review the GoComfortUSA Terms of Service covering US travel consultation, booking disclosures, fees, cancellations, and user responsibilities.",
  path: "/terms-of-service",
})

export default function TermsOfServiceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const breadcrumbSchema = buildBreadcrumbJsonLd([
    { name: "Home", url: SITE_URL },
    { name: "Terms of Service", url: `${SITE_URL}/terms-of-service` },
  ])

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      {children}
    </>
  )
}
