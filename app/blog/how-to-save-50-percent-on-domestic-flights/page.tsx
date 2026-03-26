import { Metadata } from "next"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Hotel, Ticket, Home, ArrowRight, Plane, ChevronRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Mastering Flight Optimization: Expert Travel Research Guide 2025 | GoComfortUSA",
  description: "Learn how to optimize your flight routes and travel planning in 2025. Discover professional research strategies and expert assistance for a seamless journey with GoComfortUSA.",
  keywords: "flight optimization, travel research, route planning, professional travel assistance, USA travel planning, expert booking guidance",
  openGraph: {
    title: "Mastering Flight Optimization: Expert Travel Research Guide 2025",
    description: "Discover professional strategies to optimize your flight routes and travel planning in 2025. Expert assistance for a seamless journey.",
    type: "article",
  },
}

export default function FlightOptimizationPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-primary/10 text-primary mb-6">
            Expert Travel Guide
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6 leading-tight">
            Mastering Flight Optimization: <br />
            <span className="text-primary italic">Expert Research Guide 2025</span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed">
            Discover professional strategies to optimize your flight routes and travel planning. 
            Learn how GoComfortUSA's expert assistance ensures a seamless and efficient journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/travel/flight">
              <Button size="lg" className="rounded-full px-8 py-6 text-lg shadow-lg">
                Get Travel Options
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg" className="rounded-full px-8 py-6 text-lg">
                Consult an Expert
              </Button>
            </Link>
          </div>
        </div>

        {/* Content Sections */}
        <div className="max-w-4xl mx-auto space-y-12">
          {/* why optimization */}
          <section className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-800">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
              The Value of Professional Flight Optimization
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
              Navigating the complexities of modern air travel requires more than just a simple search. 
              Professional optimization involves deep research into routes, carrier options, and timing 
              to ensure your journey is as efficient and comfortable as possible.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                "Optimized Multi-City Route Planning",
                "Expert Carrier and Connection Analysis",
                "Personalized Preference Integration",
                "Ongoing Travel Planning Support"
              ].map((point, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary"></div>
                  <span className="text-slate-700 dark:text-slate-300 font-medium">{point}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Top Strategies */}
          <section className="space-y-8">
            <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white">
              Professional Planning Strategies
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  title: "Strategic Timing Analysis",
                  description: "Expert evaluation of seasonal trends and carrier schedules to identify the most favorable travel periods for your destination."
                },
                {
                  title: "Route Efficiency Research",
                  description: "In-depth analysis of hub connections and direct flight options to minimize travel time and maximize comfort."
                },
                {
                  title: "Carrier Value Comparison",
                  description: "Comprehensive review of airline amenities, baggage policies, and reliability to find the best fit for your needs."
                },
                {
                  title: "Buffer & Contingency Planning",
                  description: "Professional guidance on connection times and alternative routes to ensure a stress-free travel experience."
                }
              ].map((strategy, index) => (
                <div key={index} className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{strategy.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{strategy.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* How we help */}
          <section className="bg-primary text-white p-8 md:p-12 rounded-[2rem] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-6">How GoComfortUSA Enhances Your Trip</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-xl font-bold mb-3">Personalized Research</h4>
                  <p className="text-white/80 leading-relaxed">
                    Our team performs the heavy lifting, scouring multiple sources to find 
                    the most optimized flight options tailored specifically to your itinerary.
                  </p>
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-3">Booking Guidance</h4>
                  <p className="text-white/80 leading-relaxed">
                    We provide clear, step-by-step instructions on how to book your chosen 
                    options directly with official providers for maximum security.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Related */}
          <div className="pt-12 border-t border-slate-200 dark:border-slate-800">
            <h3 className="text-2xl font-bold mb-8 text-slate-900 dark:text-white">Related Research Services</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: "Hotel Research", href: "/travel/hotel", icon: <Hotel className="h-5 w-5" /> },
                { title: "Park Planning", href: "/tickets/disneyland", icon: <Ticket className="h-5 w-5" /> },
                { title: "Housing Support", href: "/bills/apartment-rental", icon: <Home className="h-5 w-5" /> }
              ].map((service, i) => (
                <Link key={i} href={service.href} className="group flex items-center justify-between p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl hover:border-primary transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="text-primary">{service.icon}</div>
                    <span className="font-bold text-slate-900 dark:text-white">{service.title}</span>
                  </div>
                  <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
 