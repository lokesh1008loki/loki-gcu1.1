import { buildPageMetadata } from "@/lib/seo-metadata"
import {
  JsonLd,
  SITE_URL,
  buildBreadcrumbJsonLd,
  buildFaqPageJsonLd,
} from "@/components/json-ld"

export const metadata = buildPageMetadata({
  title: "US Grocery Order & Delivery Help | GoComfortUSA",
  description:
    "Submit your US grocery list for ordering and delivery assistance from major stores with savings of up to 30% off through GoComfortUSA specialists.",
  path: "/others/food-grocery",
  keywords: "US grocery ordering help, grocery delivery assistance, GoComfortUSA",
})

const GROCERY_FAQS = [
  {
    question: "How do you save up to 30% on grocery bills?",
    answer:
      "We cross-check inventory, weekly flyers, and member-only bulk promotions across major outlets like Walmart, Target, and Costco to procure items at their lowest dynamic price point.",
  },
  {
    question: "What happens after I submit my grocery list?",
    answer:
      "One of our personal shoppers reviews the list, checks availability, maps the cheapest routes, and contacts you via WhatsApp or phone to confirm final items and delivery timeline.",
  },
  {
    question: "Is my payment secure?",
    answer:
      "Yes. We do not store sensitive credit card info. All assistance bookings are processed via secure invoices and verification protocols for your complete safety.",
  },
]

export default function FoodGroceryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const breadcrumbSchema = buildBreadcrumbJsonLd([
    { name: "Home", url: SITE_URL },
    { name: "Food & Grocery", url: `${SITE_URL}/others/food-grocery` },
  ])
  const faqSchema = buildFaqPageJsonLd(GROCERY_FAQS)

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={faqSchema} />
      {children}
    </>
  )
}
