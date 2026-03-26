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
  description: "Find answers to common questions about GoComfortUSA's professional travel assistance, hotel research, and lifestyle planning services.",
  keywords: "FAQ, frequently asked questions, GoComfortUSA, travel assistance, hotel research, planning services",
  openGraph: {
    title: "Frequently Asked Questions – GoComfortUSA",
    description: "Find answers to common questions about GoComfortUSA's professional travel assistance services.",
    type: "website",
  },
}

const faqData = [
  {
    question: "How does GoComfortUSA optimize my travel and lifestyle expenses?",
    answer: "We leverage expert research and deep market analysis to identify the most efficient routes, stays, and services available. Our team performs the heavy lifting to ensure you get professional value without the stress of manual searching."
  },
  {
    question: "Is GoComfortUSA a travel consultant or a booking agent?",
    answer: "We are a professional travel and lifestyle consultation service. We provide expert research and guidance for domestic flights, hotel stays, rent assistance, and retail optimization in the USA."
  },
  {
    question: "How can I trust your research-backed options?",
    answer: "All our recommendations are based on real-time market data and verified through official channels. You receive a professional report with clear guidance before any decisions are made."
  },
  {
    question: "Can I request research for last-minute trips?",
    answer: "Yes. Our team is equipped to handle urgent research requests, providing optimized options even for immediate travel needs."
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
            Find answers to common questions about our professional travel, hotel research, 
            rent assistance, and lifestyle services.
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