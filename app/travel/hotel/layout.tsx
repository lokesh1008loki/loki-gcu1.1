import { buildPageMetadata } from "@/lib/seo-metadata"
import {
  JsonLd,
  SITE_URL,
  buildBreadcrumbJsonLd,
  buildFaqPageJsonLd,
  buildServiceJsonLd,
} from "@/components/json-ld"
import { HOTEL_FAQS } from "@/lib/service-faqs"

export const metadata = buildPageMetadata({
  title: "US Hotel Total-Price Research & Help | GoComfortUSA",
  description:
    "Compare US hotels by true total price including resort fees and taxes. GoComfortUSA researches stays up to 30% off; you book directly with official hotels.",
  path: "/travel/hotel",
  keywords:
    "US hotel research, hotel total price check, hotel resort fees comparison, US hotel booking help, GoComfortUSA",
})

export default function HotelLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const serviceSchema = buildServiceJsonLd({
    name: "US Hotel Total-Price Research and Booking Help",
    serviceType: "Hotel Research and Travel Consultation",
    url: `${SITE_URL}/travel/hotel`,
    description:
      "GoComfortUSA is a US travel consultation service that helps customers across the United States compare US hotels by their true total price, including taxes and resort fees, with savings of up to 30% off. GoComfortUSA is a research service and is not a hotel; customers book directly with the official providers.",
  })

  const breadcrumbSchema = buildBreadcrumbJsonLd([
    { name: "Home", url: SITE_URL },
    { name: "Hotel Research", url: `${SITE_URL}/travel/hotel` },
  ])

  const faqSchema = buildFaqPageJsonLd(HOTEL_FAQS)

  return (
    <>
      <JsonLd data={serviceSchema} />
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={faqSchema} />
      {children}
    </>
  )
}
