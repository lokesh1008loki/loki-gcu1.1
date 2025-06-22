import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Plane, Hotel, Train, Ticket, ShoppingBag, Home, Shield, Users, Clock, Star, Target, Eye, Search, Percent, Handshake } from "lucide-react"
import { AnimatedCounter } from "@/components/animated-counter"

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">About GoComfortUSA</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Your trusted partner in making luxury and essential services more affordable across America
        </p>
      </section>

      {/* Introduction Section */}
      <section className="mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Who We Are</h2>
            <p className="text-lg text-muted-foreground">
              GoComfortUSA is a revolutionary U.S.-based platform designed to simplify and slash the cost of domestic travel, lifestyle expenses, and rent payments. We act as your personal savings assistant, combining smart technology, real-time deals, and strong partnerships to unlock the most affordable prices in the market—often up to 50% off.
            </p>
            <p className="text-lg text-muted-foreground">
              We're not just a discount service. We're a movement for economic comfort, helping individuals, families, and students access quality travel and living services without financial stress. Whether you're booking a weekend trip, furnishing your home, or managing rent payments—GoComfortUSA puts money back in your pocket.
            </p>
          </div>
          <div className="relative h-[400px] rounded-xl overflow-hidden shadow-xl">
            <Image
              src="/aboutimage.jpeg"
              alt="GoComfortUSA Team"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* How We Work Section */}
      <section className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-6">How We Work</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-12">
            Our dedicated team consistently scours the web to discover the best deals, offers, and coupons. We automatically apply these savings to the services you choose, ensuring you get maximum value without the hassle. We've also partnered with numerous trusted companies to unlock exclusive discounts—allowing us to provide high-quality services at the most affordable rates, with minimal impact on your budget.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Search className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Smart Search</h3>
              </div>
              <p className="text-muted-foreground">
                Our team continuously monitors the market to find the best deals and discounts for our customers.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Percent className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Automatic Savings</h3>
              </div>
              <p className="text-muted-foreground">
                We automatically apply the best available discounts to ensure you get maximum value on every purchase.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Handshake className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Trusted Partnerships</h3>
              </div>
              <p className="text-muted-foreground">
                Our network of trusted partners allows us to offer exclusive discounts and premium services at affordable rates.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mb-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Target className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-3xl font-bold">Our Mission</h2>
          </div>
          <div className="space-y-6">
            <p className="text-lg text-muted-foreground">
              Our mission is to democratize access to essential and luxury services by making them budget-friendly.
            </p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-primary font-bold">•</span>
                </div>
                <p className="text-muted-foreground">
                  Disrupt overpriced systems by offering verified, secure, and deeply discounted alternatives.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-primary font-bold">•</span>
                </div>
                <p className="text-muted-foreground">
                  Empower U.S. consumers to make smarter financial decisions with the confidence of safety and transparency.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-primary font-bold">•</span>
                </div>
                <p className="text-muted-foreground">
                  Provide a platform that promotes financial comfort, not just convenience.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-primary font-bold">•</span>
                </div>
                <p className="text-muted-foreground">
                  We aim to become the most value-driven service hub for middle-class and working Americans looking to stretch their dollar.
                </p>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="mb-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Eye className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-3xl font-bold">Our Vision</h2>
          </div>
          <div className="space-y-6">
            <p className="text-lg text-muted-foreground">
              Our long-term vision is to transform how Americans access and afford essential services.
            </p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-primary font-bold">•</span>
                </div>
                <p className="text-muted-foreground">
                  Be the go-to national platform for discounted lifestyle services in the U.S.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-primary font-bold">•</span>
                </div>
                <p className="text-muted-foreground">
                  Partner with local and national service providers to expand into more cities and service categories.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-primary font-bold">•</span>
                </div>
                <p className="text-muted-foreground">
                  Lead a new wave of digitally-assisted affordability across housing, transport, entertainment, and shopping.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-primary font-bold">•</span>
                </div>
                <p className="text-muted-foreground">
                  Build a community of users who believe in smart spending, economic dignity, and comfort-first living.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-primary font-bold">•</span>
                </div>
                <p className="text-muted-foreground">
                  Become a household name trusted by millions who want the best for less.
                </p>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Plane className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Flight Bookings</h3>
              </div>
              <p className="text-muted-foreground">Discounted domestic and international flights</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Hotel className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Hotel & Train</h3>
              </div>
              <p className="text-muted-foreground">Best deals on accommodations and rail travel</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Ticket className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Theme Parks</h3>
              </div>
              <p className="text-muted-foreground">Discounted entry to Disneyland and other parks</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <ShoppingBag className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">IKEA Shopping</h3>
              </div>
              <p className="text-muted-foreground">Assistance with IKEA orders and savings</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Home className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Rent Payments</h3>
              </div>
              <p className="text-muted-foreground">Up to 50% off monthly rent payments</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">24/7 Support</h3>
              <p className="text-muted-foreground">Round-the-clock U.S.-based customer support</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Secure Transactions</h3>
              <p className="text-muted-foreground">100% secure payment processing</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Verified Network</h3>
              <p className="text-muted-foreground">Trusted vendor partnerships</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Star className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Happy Customers</h3>
              <p className="text-muted-foreground">Over <AnimatedCounter target={10000} /> satisfied customers across 30+ states</p>
            </div>
          </div>
        </div>
      </section>

      {/* Join Section */}
      <section className="text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Join the Comfort Movement</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Whether you're planning a vacation, paying rent, or shopping big — GoComfortUSA ensures you save big while living better.
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="/"
              className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
            >
              Get Started
            </a>
            <a
              href="/contact"
              className="inline-flex items-center justify-center rounded-md border border-input bg-background px-6 py-3 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </div>
  )
} 