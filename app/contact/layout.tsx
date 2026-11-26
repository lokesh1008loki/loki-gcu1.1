import { buildPageMetadata } from "@/lib/seo-metadata"
import { JsonLd, SITE_URL, buildBreadcrumbJsonLd } from "@/components/json-ld"

export const metadata = buildPageMetadata({
  title: "Contact GoComfortUSA | US Travel Support",
  description:
    "Reach GoComfortUSA by email at support@gocomfortusa.com or WhatsApp for domestic flight, hotel, IKEA ordering, and Disneyland ticket assistance.",
  path: "/contact",
  keywords: "contact GoComfortUSA, GoComfortUSA support, travel consultation contact",
})

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const breadcrumbSchema = buildBreadcrumbJsonLd([
    { name: "Home", url: SITE_URL },
    { name: "Contact", url: `${SITE_URL}/contact` },
  ])

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      {children}
    </>
  )
}
