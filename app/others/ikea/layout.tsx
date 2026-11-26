import { buildPageMetadata } from "@/lib/seo-metadata"
import {
  JsonLd,
  SITE_URL,
  buildBreadcrumbJsonLd,
  buildFaqPageJsonLd,
  buildServiceJsonLd,
} from "@/components/json-ld"
import { IKEA_FAQS } from "@/lib/service-faqs"

export const metadata = buildPageMetadata({
  title: "IKEA Ordering & Delivery Assistance | GoComfortUSA",
  description:
    "Browse live IKEA US products and request IKEA ordering assistance with delivery by IKEA through GoComfortUSA. Target savings of up to 30% off across the US.",
  path: "/others/ikea",
  keywords:
    "IKEA ordering assistance, IKEA delivery USA, IKEA furniture order help, up to 30% off IKEA, GoComfortUSA",
})

export default function IkeaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const serviceSchema = buildServiceJsonLd({
    name: "IKEA Ordering and Delivery Assistance",
    serviceType: "IKEA Ordering Assistance",
    url: `${SITE_URL}/others/ikea`,
    description:
      "GoComfortUSA is a US consultation and ordering-assistance service that helps customers across the United States choose and order IKEA products with delivery by IKEA, advertising savings of up to 30% off. GoComfortUSA is not IKEA.",
  })

  const breadcrumbSchema = buildBreadcrumbJsonLd([
    { name: "Home", url: SITE_URL },
    { name: "IKEA Ordering Assistance", url: `${SITE_URL}/others/ikea` },
  ])

  const faqSchema = buildFaqPageJsonLd(IKEA_FAQS)

  return (
    <>
      <JsonLd data={serviceSchema} />
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={faqSchema} />
      {children}
    </>
  )
}
