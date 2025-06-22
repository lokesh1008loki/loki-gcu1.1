import { Metadata } from "next"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Frequently Asked Questions – GoComfortUSA",
  description: "Find answers to common questions about GoComfortUSA's discounted travel, hotel bookings, rent payments, and IKEA purchases. Get up to 50% off on domestic services.",
  keywords: "FAQ, frequently asked questions, GoComfortUSA, travel discounts, hotel bookings, rent payments, IKEA discounts",
  openGraph: {
    title: "Frequently Asked Questions – GoComfortUSA",
    description: "Find answers to common questions about GoComfortUSA's discounted services.",
    type: "website",
  },
}

const faqData = [
  {
    question: "How does GoComfortUSA offer up to 50% off on flights, hotels, and IKEA orders?",
    answer: "We partner with travel and retail providers to bring exclusive deals directly to our users. You save through negotiated rates and our internal discount system."
  },
  {
    question: "Is GoComfortUSA a travel agency or a discount platform?",
    answer: "We're a smart travel and shopping assistant offering discounted services for domestic flights, hotel bookings, rent payments, and IKEA purchases in the USA."
  },
  {
    question: "How can I trust your discounts are real?",
    answer: "All deals are verified with our partnered vendors. You'll see real-time pricing before confirming any booking or order."
  },
  {
    question: "Can I book last-minute flights or hotels?",
    answer: "Yes. We specialize in last-minute domestic travel deals with up to 50% off available even a day before your trip."
  },
  {
    question: "Do I need an account to use GoComfortUSA?",
    answer: "No account is required. Just search, find your deal, and proceed to booking or payment. It's that simple."
  },
  {
    question: "Are there any hidden charges?",
    answer: "No hidden charges. What you see is what you pay."
  }
]

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Find answers to common questions about our discounted travel, hotel bookings, 
            rent payments, and IKEA purchases. Get up to 50% off on domestic services.
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
                    <AccordionContent className="px-6 pb-4">
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
                  Can't find the answer you're looking for? Our support team is here to help.
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
  )
} 