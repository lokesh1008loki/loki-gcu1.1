import { buildPageMetadata } from "@/lib/seo-metadata"
import { JsonLd, SITE_URL, buildBreadcrumbJsonLd } from "@/components/json-ld"

export const metadata = buildPageMetadata({
  title: "US Train Route Research & Booking | GoComfortUSA",
  description:
    "Plan domestic US train journeys with GoComfortUSA rail route research, schedule comparisons, and personalized booking coordination across US lines.",
  path: "/travel/train",
  keywords: "US train travel research, rail route planning, train booking assistance, GoComfortUSA",
})

export default function TrainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const breadcrumbSchema = buildBreadcrumbJsonLd([
    { name: "Home", url: SITE_URL },
    { name: "Train Research", url: `${SITE_URL}/travel/train` },
  ])

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      {children}
    </>
  )
}
