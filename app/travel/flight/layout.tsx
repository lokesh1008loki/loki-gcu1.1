import { buildPageMetadata } from "@/lib/seo-metadata"
import {
  JsonLd,
  SITE_URL,
  buildBreadcrumbJsonLd,
  buildFaqPageJsonLd,
  buildServiceJsonLd,
} from "@/components/json-ld"
import { FLIGHT_FAQS } from "@/lib/service-faqs"

export const metadata = buildPageMetadata({
  title: "US Flight Research & Booking Help | GoComfortUSA",
  description:
    "Compare domestic US flights with GoComfortUSA flight research. Book directly with official airlines while targeting savings of up to 30% off eligible fares.",
  path: "/travel/flight",
  keywords:
    "US flight research, domestic flight booking help, compare US flights, flight consultation USA, GoComfortUSA",
})

export default function FlightLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const serviceSchema = buildServiceJsonLd({
    name: "US Domestic Flight Research and Booking Help",
    serviceType: "Flight Research and Travel Consultation",
    url: `${SITE_URL}/travel/flight`,
    description:
      "GoComfortUSA is a US travel consultation service that helps customers across the United States find and compare domestic flights, with savings of up to 30% off. GoComfortUSA is a research service and is not an airline; customers book flights directly with the official providers.",
  })

  const breadcrumbSchema = buildBreadcrumbJsonLd([
    { name: "Home", url: SITE_URL },
    { name: "Flight Research", url: `${SITE_URL}/travel/flight` },
  ])

  const faqSchema = buildFaqPageJsonLd(FLIGHT_FAQS)

  return (
    <>
      <JsonLd data={serviceSchema} />
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={faqSchema} />
      {children}
    </>
  )
}
