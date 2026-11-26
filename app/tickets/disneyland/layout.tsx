import { buildPageMetadata } from "@/lib/seo-metadata"
import {
  JsonLd,
  SITE_URL,
  buildBreadcrumbJsonLd,
  buildFaqPageJsonLd,
  buildServiceJsonLd,
} from "@/components/json-ld"
import { DISNEYLAND_FAQS } from "@/lib/service-faqs"

export const metadata = buildPageMetadata({
  title: "Disneyland Ticket Booking Assistance | GoComfortUSA",
  description:
    "Get Disneyland Anaheim ticket booking assistance through an authorized supplier, plus Lightning Lane and park reservation guidance across the United States.",
  path: "/tickets/disneyland",
  keywords:
    "Disneyland ticket booking assistance, Anaheim Disneyland tickets, Lightning Lane guidance, Disneyland park reservation, GoComfortUSA",
})

export default function DisneylandLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const serviceSchema = buildServiceJsonLd({
    name: "Disneyland Ticket Booking Assistance",
    serviceType: "Theme Park Ticket Booking Assistance",
    url: `${SITE_URL}/tickets/disneyland`,
    description:
      "For Disneyland (Anaheim, California) tickets, GoComfortUSA provides booking assistance through an authorized supplier for customers in the United States, including guidance on Lightning Lane options and park reservation requirements.",
  })

  const breadcrumbSchema = buildBreadcrumbJsonLd([
    { name: "Home", url: SITE_URL },
    { name: "Disneyland Tickets", url: `${SITE_URL}/tickets/disneyland` },
  ])

  const faqSchema = buildFaqPageJsonLd(DISNEYLAND_FAQS)

  return (
    <>
      <JsonLd data={serviceSchema} />
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={faqSchema} />
      {children}
    </>
  )
}
