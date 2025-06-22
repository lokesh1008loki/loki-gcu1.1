import { Metadata } from "next"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Script from "next/script"

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
    answer: "We partner with travel and retail providers to bring exclusive deals directly to our users. You save through negotiated rates and our internal discount system. Additionally, our dedicated team actively scrapes the entire internet to find the best coupons and promotional codes available, which we automatically apply to secure the lowest final rates for you—rates that are consistently lower than what you'll find anywhere else in the market."
  },
  {
    question: "Is GoComfortUSA a travel agency or a discount platform?",
    answer: "We're a smart travel and shopping assistant offering discounted services for domestic flights, hotel bookings, rent payments, and IKEA purchases in the USA. Our dedicated team handles all bookings for you and actively searches the entire internet for the latest coupons and promotional codes, which we automatically apply to ensure you get the lowest rates available in the market."
  },
  {
    question: "How can I trust your discounts are real?",
    answer: "At GoComfortUSA, we ensure that all deals listed on our platform are thoroughly verified in collaboration with our trusted partner vendors. Each offer undergoes validation to confirm authenticity, availability, and price accuracy before it is presented to you. You will be shown real-time pricing during the booking process, allowing you full transparency and the opportunity to compare our prices with other platforms. Unlike many other websites, we do not require upfront payment. Instead, you only pay once your booking has been successfully confirmed. Additionally, for your convenience and peace of mind, you will receive a confirmation message through the communication method you provide while filling out the booking form—whether it's via email, SMS, telegram or another preferred channel."
  },
  {
    question: "Can I book last-minute flights or hotels?",
    answer: "Yes, GoComfortUSA is designed to accommodate both planned and last-minute bookings with ease. Whether you're booking a spontaneous weekend getaway or need urgent travel arrangements, our platform is equipped to help you find deeply discounted flights and hotels—even just hours before departure or check-in. We work with a wide network of domestic travel providers and hotel partners across the U.S. who update their availability in real time. This ensures that you always have access to the latest offers, regardless of how close you are to your travel date. Moreover, you'll receive a confirmation message via the contact method you provide—such as email, phone, or WhatsApp—before any payment is made. We believe in giving you full control, so you'll only be asked to pay once your booking is confirmed and secured. With GoComfortUSA, last-minute travel doesn't mean sacrificing quality or affordability. Our system is designed to make urgent bookings smooth, reliable, and budget-friendly."
  },
  {
    question: "Do I need an account to use GoComfortUSA?",
    answer: "No account is required. Just search, find your deal, and proceed to booking or payment. It's that simple."
  },
  {
    question: "Are there any hidden charges?",
    answer: "No, there are absolutely no hidden charges when you book through GoComfortUSA. We believe in full transparency and fairness. The price you see during the booking process is the final amount you are expected to pay—nothing more. Before your booking is confirmed, we will send you a final confirmation message clearly stating the total amount due. You are only required to pay that confirmed amount, and only after your booking is secured. With GoComfortUSA, what you see is exactly what you pay—no surprises, no extra fees."
  },
  {
    question: "How do you accept payments?",
    answer: "At GoComfortUSA, we prioritize convenience and flexibility when it comes to payments. To ensure a smooth and secure experience, we accept payments through all major payment platforms commonly used across the United States, including: <strong>Zelle</strong>, <strong>Venmo</strong>, <strong>PayPal</strong>, <strong>Cash App</strong>, <strong>Apple Pay</strong>, and <strong>Google Pay</strong>. These options allow you to choose the method that works best for you. By keeping our payment process flexible and low-cost, we're also able to pass on the maximum savings to you—helping us offer some of the lowest prices in the market for flights, hotels, IKEA orders, park tickets, and rent payments."
  },
  {
    question: "Do you offer the lowest-priced IKEA deals in the market?",
    answer: "Absolutely. GoComfortUSA offers exclusive access to the lowest-priced IKEA deals available anywhere in the U.S. market. We actively monitor IKEA pricing nationwide to ensure you always receive the best available rate on furniture, home goods, and accessories. Once you place an order through us, our team will process it directly with IKEA and personally handle the item pickup from the nearest IKEA store. This means you don't need to worry about availability, logistics, or transport—we take care of it all. You'll receive updates and confirmation on your order status through your selected communication method, and as always, you only pay once the order is confirmed and ready."
  },
  {
    question: "Do you provide the lowest-priced Disneyland tickets?",
    answer: "Yes, GoComfortUSA proudly offers the lowest-priced Disneyland tickets available in the market. Through our direct partnership with Disneyland, we're able to secure exclusive discounted rates not typically found on public platforms or ticket resellers. These rates are updated in real time and are available for both individual and family bookings. You'll receive a confirmation of your ticket booking through email, WhatsApp, or phone, and payment is only required after your ticket is confirmed. Enjoy unforgettable experiences at Disneyland without overpaying—our mission is to make premium entertainment more accessible for everyone."
  },
  {
    question: "What kind of park tickets do you offer?",
    answer: "GoComfortUSA offers deeply discounted tickets for virtually all types of amusement, theme, and public parks across the United States. Whether you're planning a trip to Six Flags, Universal Studios, SeaWorld, water parks, or regional fun zones, we guarantee the lowest ticket prices available in the market. Our system is connected with multiple park providers to ensure you always see the most current availability and pricing. Once you choose a ticket, you'll receive booking confirmation via your preferred communication channel, and only then will payment be required."
  },
  {
    question: "Can I pay for house or apartment rent and utility bills through GoComfortUSA?",
    answer: "Yes, GoComfortUSA offers a convenient and cost-saving way to pay your house or apartment rent, along with associated utility bills. Through our service, you can receive a discount of up to 30–35% on these monthly expenses. We act as a trusted intermediary between you and your landlord or service provider, streamlining your payment while securing exclusive discounts. All you need to do is fill out a simple form with your details, and once verified, you'll receive a confirmation message before any transaction is made. You'll only be asked to pay once everything is confirmed—ensuring a reliable and transparent process that saves you money month after month."
  }
]

// FAQ Schema.org JSON-LD
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How does GoComfortUSA offer up to 50% off on flights, hotels, and IKEA orders?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We partner with travel and retail providers to bring exclusive deals directly to our users. You save through negotiated rates and our internal discount system. Additionally, our dedicated team actively scrapes the entire internet to find the best coupons and promotional codes available, which we automatically apply to secure the lowest final rates for you—rates that are consistently lower than what you'll find anywhere else in the market."
      }
    },
    {
      "@type": "Question",
      "name": "Do you offer the lowest-priced IKEA deals in the market?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Absolutely. GoComfortUSA offers exclusive access to the lowest-priced IKEA deals available anywhere in the U.S. market. We actively monitor IKEA pricing nationwide to ensure you always receive the best available rate on furniture, home goods, and accessories."
      }
    },
    {
      "@type": "Question",
      "name": "Do you provide the lowest-priced Disneyland tickets?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, GoComfortUSA proudly offers the lowest-priced Disneyland tickets available in the market. Through our direct partnership with Disneyland, we're able to secure exclusive discounted rates not typically found on public platforms or ticket resellers."
      }
    }
  ]
}

export default function FAQPage() {
  return (
    <>
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
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
                        <p 
                          className="text-gray-700 leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: faq.answer }}
                        />
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
    </>
  )
} 