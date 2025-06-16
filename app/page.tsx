import React from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Ticket, CreditCard, Plane, ShoppingBag, Star, ChevronRight } from "lucide-react"
import { AutoSlider } from "@/components/ui/auto-slider"
import HowWeWork from "@/components/how-we-work"
import ReviewSlider from "@/components/review-slider"
import { AnimatedCounter } from "@/components/animated-counter"
import { BookingLinks } from "@/components/BookingLinks"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 dark:from-primary/10 dark:to-primary/5 z-0"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                Your One-Stop Solution for <span className="text-primary">Tickets & Bills</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-lg">
                GocomfortUSA is your go-to travel and lifestyle service platform, crafted for travel nurses and everyday individuals who want to
                <b> spend less and save more.</b> Enjoy the <b>VIP experience and premium services</b> —from discounted house rent payments and 
                affordable travel bookings to food delivery and fun activities—without the premium price tag. With GoComfortUSA, 
                <b>feel the luxury while keeping more in your pocket.</b>
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" asChild>
                  <Link href="/tickets/water-park">Explore Tickets</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/bills/utility">Pay Bills</Link>
                </Button>
              </div>
            </div>
            <div className="relative h-[300px] md:h-[400px] lg:h-[500px] rounded-xl overflow-hidden shadow-xl">
              <AutoSlider />
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Trusted by Thousands</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Over <AnimatedCounter target={10000} /> happy U.S. customers trust GoComfortUSA for savings up to 50%.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            <div className="flex items-center gap-2">
              <Image
                src="/Trustpilot Stars.png"
                alt="Trustpilot"
                width={120}
                height={40}
                className="opacity-80 hover:opacity-100 transition-opacity"
              />
              <span className="text-sm font-medium">4.8/5</span>
            </div>
            <div className="flex items-center gap-2">
              <Image
                src="/google reviews.png"
                alt="Google Reviews"
                width={120}
                height={40}
                className="opacity-80 hover:opacity-100 transition-opacity"
              />
              <span className="text-sm font-medium">4.9/5</span>
            </div>
            <div className="flex items-center gap-2">
              <Image
                src="/site jabber.png"
                alt="SiteJabber"
                width={120}
                height={40}
                className="opacity-80 hover:opacity-100 transition-opacity"
              />
              <span className="text-sm font-medium">4.7/5</span>
            </div>
            <div className="flex items-center gap-2">
              <Image
                src="/bbb.png"
                alt="Better Business Bureau"
                width={120}
                height={40}
                className="opacity-80 hover:opacity-100 transition-opacity"
              />
              <span className="text-sm font-medium">A+ Rating</span>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Links Section */}
      <BookingLinks />

      {/* Customer Reviews Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Customers Say</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Real experiences from our satisfied customers across the United States
            </p>
          </div>
          <ReviewSlider />
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Us</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We offer the best services with amazing features that make us stand out from the crowd.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="flex flex-col items-center text-center p-6 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Ticket className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Best Ticket Deals</h3>
              <p className="text-muted-foreground">
                Get exclusive discounts on tickets for parks like <span className="font-semibold">Disney Land</span> and many more, events, and attractions.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col items-center text-center p-6 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <CreditCard className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Secure Payments</h3>
              <p className="text-muted-foreground">
                Pay your bills securely with our advanced payment processing system.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col items-center text-center p-6 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <CreditCard className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Cashback Offers</h3>
              <p className="text-muted-foreground">Enjoy attractive cashback offers on all your bookings and payments.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How We Work Section */}
      <HowWeWork />

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="bg-primary text-primary-foreground rounded-xl p-8 md:p-12">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-lg mb-8 opacity-90">
                Join thousands of satisfied customers who use GocomfortUSA for their ticket bookings and bill payments.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/tickets/water-park">Explore Services</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-transparent border-white hover:bg-white hover:text-primary"
                  asChild
                >
                  <Link href="/contact">Contact Us</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
