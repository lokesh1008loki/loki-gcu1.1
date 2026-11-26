import { buildPageMetadata } from "@/lib/seo-metadata"
import { JsonLd, SITE_URL, buildBreadcrumbJsonLd } from "@/components/json-ld"

export const metadata = buildPageMetadata({
  title: "US Utility Bill Payment Help | GoComfortUSA",
  description:
    "Get assistance coordinating US electricity, gas, water, internet, phone, and cable bills with GoComfortUSA research and payment support services.",
  path: "/bills/utility",
  keywords: "US utility bill assistance, electric gas water bill help, GoComfortUSA",
})

export default function UtilityBillsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const breadcrumbSchema = buildBreadcrumbJsonLd([
    { name: "Home", url: SITE_URL },
    { name: "Utility Bill Assistance", url: `${SITE_URL}/bills/utility` },
  ])

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      {children}
    </>
  )
}
