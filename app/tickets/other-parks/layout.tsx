import { buildPageMetadata } from "@/lib/seo-metadata"
import { JsonLd, SITE_URL, buildBreadcrumbJsonLd } from "@/components/json-ld"

export const metadata = buildPageMetadata({
  title: "Custom Theme Park Ticket Research | GoComfortUSA",
  description:
    "Looking for tickets to a specific US theme park or attraction? Submit a custom ticket research request to GoComfortUSA for tailored planning help.",
  path: "/tickets/other-parks",
  keywords: "custom theme park tickets, US attraction planning, park ticket research, GoComfortUSA",
})

export default function OtherParksLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const breadcrumbSchema = buildBreadcrumbJsonLd([
    { name: "Home", url: SITE_URL },
    { name: "Other Parks", url: `${SITE_URL}/tickets/other-parks` },
  ])

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      {children}
    </>
  )
}
