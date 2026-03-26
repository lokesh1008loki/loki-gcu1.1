import { prisma } from "@/lib/prisma"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Plane, Hotel, Train, Ticket, ShoppingBag, Home, Shield, Users, Clock, Star, Target, Eye, Search, Percent, Handshake } from "lucide-react"
import { AnimatedCounter } from "@/components/animated-counter"
import HowWeWork from "@/components/how-we-work"

export default async function AboutPage() {
  const settings = await prisma.siteSettings.findFirst()
  const consultationLink = (settings as any)?.consultationLink || "/tickets/water-park"

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden bg-white dark:bg-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.05),transparent_50%)] z-0"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-primary/10 text-primary ring-1 ring-inset ring-primary/20 mb-6">
            Smarter Travel Starts Here
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight mb-6">
            About <span className="text-primary italic">GoComfortUSA</span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Your professional partner in travel planning and premium consultation. 
            We simplify the complex to ensure your journey is optimized for comfort and value.
          </p>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-16 mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">Professional Travel Concierge</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
              GoComfortUSA is a premium U.S.-based consultation platform designed to simplify and optimize your travel experiences. 
              We act as your dedicated personal travel consultant, combining expert research and strategic planning to unlock the most efficient and comfortable options available in the market.
            </p>
            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
              We aren't just a search tool; we are a high-touch consultation service. Our team handles the heavy lifting of research, providing you with optimized itineraries that prioritize your time, comfort, and peace of mind. Whether for business or leisure, we ensure every detail of your journey is professionally vetted.
            </p>
            <div className="flex items-center gap-6 pt-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary"><AnimatedCounter target={10000} />+</div>
                <div className="text-sm text-slate-500 uppercase tracking-wider font-medium">Clients Served</div>
              </div>
              <div className="h-10 w-px bg-slate-200 dark:bg-slate-800"></div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">30+</div>
                <div className="text-sm text-slate-500 uppercase tracking-wider font-medium">U.S. States</div>
              </div>
            </div>
          </div>
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
            <div className="relative h-[450px] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/aboutimage.jpeg"
                alt="Professional Travel Consultation"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How We Work Section */}
      <HowWeWork />

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
              Our mission is to empower travelers and professionals with expert planning tools that prioritize efficiency and value.
            </p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-primary font-bold">•</span>
                </div>
                <p className="text-muted-foreground">
                  Optimize fragmented travel systems by offering verified, secure, and expert-led planning alternatives.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-primary font-bold">•</span>
                </div>
                <p className="text-muted-foreground">
                  Empower U.S. consumers to make smarter logistical decisions with the confidence of professional research.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-primary font-bold">•</span>
                </div>
                <p className="text-muted-foreground">
                  Provide a platform that promotes logistical peace of mind and strategic travel planning.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-primary font-bold">•</span>
                </div>
                <p className="text-muted-foreground">
                  Become the premier value-driven consultation hub for professionals and families across the USA.
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
              Our long-term vision is to transform how Americans plan and experience their domestic travel and lifestyle needs.
            </p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-primary font-bold">•</span>
                </div>
                <p className="text-muted-foreground">
                  Be the go-to national platform for optimized travel and lifestyle services in the U.S.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-primary font-bold">•</span>
                </div>
                <p className="text-muted-foreground">
                  Partner with national service providers to expand into more cities and comprehensive travel categories.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-primary font-bold">•</span>
                </div>
                <p className="text-muted-foreground">
                  Lead a new wave of digitally-assisted planning excellence across housing, transport, and entertainment.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-primary font-bold">•</span>
                </div>
                <p className="text-muted-foreground">
                  Build a community of users who believe in smart planning, travel efficiency, and high-value living.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-primary font-bold">•</span>
                </div>
                <p className="text-muted-foreground">
                  Become a household name trusted for professional travel coordination and lifestyle assistance.
                </p>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-20">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-6">Professional Consultation</h2>
            <p className="text-xl text-slate-600 dark:text-slate-400">
              We provide expert research and planning to ensure your travel experience is seamless and optimized.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              {
                icon: <Plane className="h-8 w-8 text-primary" />,
                title: "Flight Optimization",
                description: "Deep research into route planning and carrier options to find the most efficient and comfortable travel paths."
              },
              {
                icon: <ShoppingBag className="h-8 w-8 text-primary" />,
                title: "Stay Recommendations",
                description: "Personalized hotel and accommodation search based on your preference for comfort, location, and amenities."
              },
              {
                icon: <Target className="h-8 w-8 text-primary" />,
                title: "Price & Value Analysis",
                description: "Comprehensive comparison of available options to ensure you receive the best value for your personalized itinerary."
              },
              {
                icon: <Shield className="h-8 w-8 text-primary" />,
                title: "Planning Support",
                description: "Ongoing assistance throughout your travel planning process, from initial research to final booking guidance."
              },
              {
                icon: <Clock className="h-8 w-8 text-primary" />,
                title: "Booking Assistance",
                description: "Optional step-by-step support while you complete your bookings directly with airlines and hotel providers."
              },
              {
                icon: <Eye className="h-8 w-8 text-primary" />,
                title: "Route Planning",
                description: "Complex multi-city or multi-destination route optimization for the modern, busy traveler."
              }
            ].map((service, index) => (
              <div key={index} className="group p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300">
                <div className="h-16 w-16 rounded-2xl bg-primary/5 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  {service.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">{service.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
          
          <div className="mt-20 p-8 rounded-3xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 text-center">
            <p className="text-blue-800 dark:text-blue-300 font-medium">
              Important: GoComfortUSA is a travel assistance and consultation platform. We do not directly sell airline tickets or hotel rooms. 
              All final bookings are managed through official providers in the customer's name.
            </p>
          </div>
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
            Whether you're planning a vacation, managing housing, or organizing retail needs — GoComfortUSA ensures you live better with expert planning.
          </p>
          <div className="flex justify-center gap-4">
            <a
              href={consultationLink}
              className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-4 text-lg font-bold text-primary-foreground shadow-xl transition-all hover:bg-primary/90 hover:translate-y-[-2px]"
            >
              Start Consultation
            </a>
            <a
              href="/contact"
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-background px-8 py-4 text-lg font-bold shadow-sm transition-all hover:bg-slate-50 hover:translate-y-[-2px]"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </div>
  )
} 