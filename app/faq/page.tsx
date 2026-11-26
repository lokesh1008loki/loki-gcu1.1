import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { buildPageMetadata } from "@/lib/seo-metadata"
import {
  JsonLd,
  SITE_URL,
  buildBreadcrumbJsonLd,
  buildFaqPageJsonLd,
} from "@/components/json-ld"

export const metadata = buildPageMetadata({
  title: "GoComfortUSA FAQ | Flights, Hotels & IKEA Help",
  description:
    "Answers to common questions about GoComfortUSA flight research, hotel total-price checks, IKEA ordering, Disneyland ticket help, and payment methods.",
  path: "/faq",
  keywords:
    "FAQ, frequently asked questions, GoComfortUSA, flight research, hotel total price, IKEA ordering help, Disneyland tickets",
})

const faqData = [
  {
    question: "Do you sell airline tickets or hotel stays directly?",
    answer:
      "No. GoComfortUSA is a travel assistance and consultation platform. We perform in-depth research to find the most optimized travel options for you. All final bookings are made through official providers in your name.",
  },
  {
    question: "What is the benefit of using GoComfortUSA?",
    answer:
      "Our team of experts optimizes your travel routes and researches stay options, saving you time and helping you compare total costs across your journey. We provide personalized guidance tailored to your specific travel needs across the United States.",
  },
  {
    question: "How can I trust your research and optimization?",
    answer:
      "At GoComfortUSA, we ensure that all travel and stay options are thoroughly verified by our team of experts. Each recommendation undergoes validation for availability and quality before it is presented to you. We provide full transparency, allowing you to review all details before proceeding. Additionally, you will receive a strategy summary through your preferred communication method—whether it's email, SMS, Telegram, or WhatsApp—to ensure you are fully informed throughout the process.",
  },
  {
    question: "Can I request research for last-minute flights or hotels?",
    answer:
      "Yes, GoComfortUSA is designed to accommodate both planned and last-minute travel needs. Whether you're booking a spontaneous weekend getaway or need urgent arrangements, our team of experts is equipped to help you find optimized flight and hotel options—even just hours before departure or check-in. You'll receive a detailed options report via your preferred contact method—such as email or WhatsApp—giving you full control over your final travel choices.",
  },
  {
    question: "Do I need an account to use GoComfortUSA?",
    answer:
      "No account is required. Simply submit your research request, and our team will provide you with the best available options tailored to your needs. It's that simple.",
  },
  {
    question: "Are there any hidden charges?",
    answer:
      "No, there are absolutely no hidden charges when you work with GoComfortUSA. We believe in full transparency and fairness. The price you see during the booking process is the final amount you are expected to pay—nothing more. Before your request is confirmed, we send you a final confirmation message clearly stating the total amount due.",
  },
  {
    question: "How do you accept service payments?",
    answer:
      "At GoComfortUSA, we prioritize convenience and flexibility for our consulting services. To ensure a smooth experience, we accept payments through major platforms commonly used across the United States, including Zelle, Venmo, PayPal, Cash App, Apple Pay, and Google Pay.",
  },
  {
    question: "Can I request research for IKEA, Disneyland, and other major services?",
    answer:
      "Yes. GoComfortUSA provides ordering assistance for IKEA products with delivery by IKEA, booking assistance for Disneyland (Anaheim, California) tickets through an authorized supplier, and research for domestic US flights, US hotels, rent, and utility payment coordination. GoComfortUSA advertises savings of up to 30% off and serves the USA only.",
  },
]

const faqSchema = buildFaqPageJsonLd(faqData)
const breadcrumbSchema = buildBreadcrumbJsonLd([
  { name: "Home", url: SITE_URL },
  { name: "FAQ", url: `${SITE_URL}/faq` },
])

export default function FAQPage() {
  return (
    <>
      <JsonLd data={faqSchema} />
      <JsonLd data={breadcrumbSchema} />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Find answers to common questions about our travel assistance, hotel research,
              IKEA ordering assistance, and Disneyland ticket booking help.
            </p>
          </div>

          {/* FAQ Section */}
          <div className="max-w-4xl mx-auto">
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
                <CardTitle className="text-2xl font-semibold">
                  Common Questions About GoComfortUSA
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <Accordion type="single" collapsible className="w-full space-y-4">
                  {faqData.map((faq, index) => (
                    <AccordionItem
                      key={index}
                      value={`item-${index}`}
                      className="border border-gray-200 rounded-lg overflow-hidden"
                    >
                      <AccordionTrigger className="px-6 py-4 text-left hover:bg-gray-50 transition-colors">
                        <h2 className="text-lg font-semibold text-gray-900">
                          {faq.question}
                        </h2>
                      </AccordionTrigger>
                      <AccordionContent forceMount className="px-6 pb-4">
                        <p className="text-gray-700 leading-relaxed">
                          {faq.answer}
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>

            {/* Contact Section */}
            <div className="mt-12 text-center">
              <Card className="bg-white shadow-lg border-0">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                    Still Have Questions?
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Can&apos;t find the answer you&apos;re looking for? Our support team is here to help.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a
                      href="/contact"
                      className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                    >
                      Contact Support
                    </a>
                    <a
                      href="/about"
                      className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                    >
                      Learn More About Us
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
