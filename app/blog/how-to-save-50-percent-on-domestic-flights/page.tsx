import { Metadata } from "next"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "How to Save 50% on Domestic Flights: Complete Guide 2025 | GoComfortUSA",
  description: "Learn how to save up to 50% on domestic flights in 2025. Discover insider tips, booking strategies, and the best time to book cheap flights. Book now, pay later with GoComfortUSA.",
  keywords: "save 50% on domestic flights, cheap flight booking tips, domestic flight discounts, USA travel deals, flight booking strategies, last-minute flight deals",
  openGraph: {
    title: "How to Save 50% on Domestic Flights: Complete Guide 2025",
    description: "Learn how to save up to 50% on domestic flights in 2025. Discover insider tips, booking strategies, and the best time to book cheap flights.",
    type: "article",
  },
}

export default function SaveOnFlightsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            How to Save 50% on Domestic Flights: Complete Guide 2025
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8">
            Discover proven strategies to save up to 50% on domestic flights in the USA. 
            Learn insider tips, booking strategies, and how GoComfortUSA helps you get the lowest prices.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/travel/flight">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Book Cheap Flights Now
              </Button>
            </Link>
            <Link href="/faq">
              <Button variant="outline" size="lg">
                View FAQ
              </Button>
            </Link>
          </div>
        </div>

        {/* Content Sections */}
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Why Save on Flights */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-blue-600">
                Why You Should Save on Domestic Flights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                Domestic flights in the USA can be expensive, but with the right strategies, 
                you can save up to 50% on your airfare. Whether you're planning a business trip, 
                family vacation, or last-minute getaway, these savings can make a significant difference.
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Save hundreds of dollars on each trip</li>
                <li>Travel more frequently with the same budget</li>
                <li>Upgrade your travel experience with the savings</li>
                <li>Book last-minute flights without breaking the bank</li>
              </ul>
            </CardContent>
          </Card>

          {/* Top Strategies */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-blue-600">
                Top 5 Strategies to Save 50% on Domestic Flights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">1. Book During Off-Peak Seasons</h3>
                <p className="text-gray-700">
                  Avoid peak travel times like holidays and summer months. January, February, 
                  September, and October typically offer the best deals on domestic flights.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">2. Use Flexible Date Search</h3>
                <p className="text-gray-700">
                  Be flexible with your travel dates. Flying on Tuesdays, Wednesdays, and 
                  Saturdays often results in lower prices compared to weekends and Mondays.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">3. Book Last-Minute Deals</h3>
                <p className="text-gray-700">
                  Airlines often drop prices for last-minute bookings to fill empty seats. 
                  GoComfortUSA specializes in finding these deals for you.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">4. Use Multiple Payment Methods</h3>
                <p className="text-gray-700">
                  Take advantage of different payment options like Zelle, Venmo, PayPal, 
                  and Apple Pay to find the best rates and avoid credit card fees.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">5. Leverage GoComfortUSA's Discount System</h3>
                <p className="text-gray-700">
                  Our dedicated team searches the entire internet for coupons and promo codes, 
                  automatically applying them to secure the lowest rates available.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* How GoComfortUSA Helps */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-blue-600">
                How GoComfortUSA Helps You Save 50% on Flights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Exclusive Partnerships</h4>
                  <p className="text-gray-700">
                    We partner directly with major airlines to secure exclusive discounted rates 
                    not available to the public.
                  </p>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Coupon Automation</h4>
                  <p className="text-gray-700">
                    Our system automatically finds and applies the best coupons and promo codes 
                    from across the internet.
                  </p>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Real-Time Pricing</h4>
                  <p className="text-gray-700">
                    Get instant access to the latest prices and availability with our 
                    real-time booking system.
                  </p>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">No Hidden Fees</h4>
                  <p className="text-gray-700">
                    What you see is what you pay. No surprise charges or booking fees 
                    to worry about.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CTA Section */}
          <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">
                Ready to Save 50% on Your Next Flight?
              </h3>
              <p className="text-xl mb-6">
                Start booking your cheap domestic flights today with GoComfortUSA
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/travel/flight">
                  <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
                    Book Now & Save
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                    Contact Support
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Related Services */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-blue-600">
                Related Services
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <Link href="/travel/hotel" className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <h4 className="font-semibold text-gray-900">Budget Hotels</h4>
                  <p className="text-sm text-gray-600">Save up to 50% on accommodation</p>
                </Link>
                <Link href="/tickets/disneyland" className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <h4 className="font-semibold text-gray-900">Theme Park Tickets</h4>
                  <p className="text-sm text-gray-600">Cheapest Disneyland tickets</p>
                </Link>
                <Link href="/others/ikea" className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <h4 className="font-semibold text-gray-900">IKEA Deals</h4>
                  <p className="text-sm text-gray-600">Up to 50% off furniture</p>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 