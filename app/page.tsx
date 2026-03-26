import { prisma } from "@/lib/prisma";

import React from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Ticket, CreditCard, Plane, ShoppingBag, Star, ChevronRight, CheckCircle } from "lucide-react"
import { AutoSlider } from "@/components/ui/auto-slider"
import HowWeWork from "@/components/how-we-work"
import ReviewSlider from "@/components/review-slider"
import { AnimatedCounter } from "@/components/animated-counter"
import { BookingLinks } from "@/components/BookingLinks"

export default async function Home() {
  const settings = await prisma.siteSettings.findFirst()
  const s = settings as any
  const consultationPrice = s?.consultationPrice || "29"
  const consultationLink = s?.consultationLink || "/tickets/water-park"

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden bg-white dark:bg-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.1),transparent_50%)] z-0"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 animate-in fade-in slide-in-from-left duration-1000">
              <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-primary/10 text-primary ring-1 ring-inset ring-primary/20">
                Premium Travel Consultation
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1]">
                Smarter Travel <br />
                <span className="text-primary italic">Starts Here</span>
              </h1>
              <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">
                Get personalized flight and hotel options, optimized routes, and expert booking guidance tailored to your unique journey. 
                Experience travel made easy with professional assistance.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Button size="lg" className="rounded-full px-8 py-6 text-lg shadow-lg hover:shadow-primary/20 transition-all duration-300" asChild>
                  <Link href={consultationLink}>Get Travel Options</Link>
                </Button>
                <Button size="lg" variant="outline" className="rounded-full px-8 py-6 text-lg hover:bg-slate-50 transition-all duration-300" asChild>
                  <Link href="/contact">View Consultation Flow</Link>
                </Button>
              </div>
            </div>
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative h-[350px] md:h-[450px] lg:h-[550px] rounded-2xl overflow-hidden shadow-2xl bg-white">
                <AutoSlider />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-12 bg-slate-50 dark:bg-slate-900/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-80 hover:opacity-100 transition-opacity duration-300">
            <div className="relative h-16 w-32 grayscale hover:grayscale-0 transition-all duration-300">
              <Image src="/bbb.png" alt="BBB Accredited Business" fill className="object-contain" />
            </div>
            <div className="relative h-12 w-40 grayscale hover:grayscale-0 transition-all duration-300">
              <Image src="/google reviews.png" alt="Google Reviews" fill className="object-contain" />
            </div>
            <div className="relative h-12 w-40 grayscale hover:grayscale-0 transition-all duration-300">
              <Image src="/Trustpilot Stars.png" alt="Trustpilot Rating" fill className="object-contain" />
            </div>
            <div className="relative h-12 w-40 grayscale hover:grayscale-0 transition-all duration-300">
              <Image src="/site jabber.png" alt="Sitejabber Rating" fill className="object-contain" />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">Our Consultation Services</h2>
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
                icon: <Star className="h-8 w-8 text-primary" />,
                title: "Price & Value Analysis",
                description: "Comprehensive comparison of available options to ensure you receive the best value for your personalized itinerary."
              },
              {
                icon: <ArrowRight className="h-8 w-8 text-primary" />,
                title: "Planning Support",
                description: "Ongoing assistance throughout your travel planning process, from initial research to final booking guidance."
              },
              {
                icon: <ChevronRight className="h-8 w-8 text-primary" />,
                title: "Booking Assistance",
                description: "Optional step-by-step support while you complete your bookings directly with airlines and hotel providers."
              },
              {
                icon: <CreditCard className="h-8 w-8 text-primary" />,
                title: "Route Planning",
                description: "Complex multi-city or multi-destination route optimization for the modern, busy traveler."
              }
            ].map((service, index) => (
              <div key={index} className="group p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="h-16 w-16 rounded-2xl bg-primary/5 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  {service.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">{service.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
          
          <div className="mt-20 p-8 rounded-3xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 text-center">
            <p className="text-blue-800 dark:text-blue-300 font-medium">
              Important: We do not directly sell airline tickets or hotel rooms. All bookings are managed through official providers.
            </p>
          </div>
        </div>
      </section>

      {/* How We Work Section */}
      <HowWeWork />

      {/* Pricing Section */}
      <section className="py-24 md:py-32 bg-slate-50 dark:bg-slate-900/50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">Service Pricing</h2>
            <p className="text-xl text-slate-600 dark:text-slate-400">
              Professional travel research and consultation at a transparent, flat fee.
            </p>
          </div>

          <div className="max-w-lg mx-auto">
            <Card className="rounded-3xl border-2 border-primary shadow-2xl overflow-hidden">
              <div className="bg-primary p-8 text-center text-white">
                <span className="text-lg font-medium opacity-90 uppercase tracking-widest">Expert Consultation</span>
                <div className="flex items-center justify-center mt-4">
                  <span className="text-3xl font-bold">$</span>
                  <span className="text-7xl font-extrabold tracking-tight">{consultationPrice}</span>
                </div>
                <p className="mt-4 opacity-100 font-semibold underline underline-offset-4 decoration-2">Travel Consultation Fee</p>
              </div>
              <CardContent className="p-8 bg-white dark:bg-slate-900">
                <ul className="space-y-4 mb-8">
                  {[
                    "Personalized Flight Research",
                    "Hotel stay recommendations",
                    "Optimized route planning",
                    "Value and price analysis",
                    "Expert booking guidance",
                    "Delivery within 1–24 hours"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className="h-5 w-5 rounded-full bg-green-500/20 flex items-center justify-center overflow-hidden">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      </div>
                      <span className="text-slate-700 dark:text-slate-300">{item}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full rounded-2xl py-8 text-lg font-bold shadow-lg" asChild>
                  <Link href={consultationLink}>Start Your Request</Link>
                </Button>
                <p className="mt-6 text-center text-sm text-slate-500 italic">
                  *This fee covers personalized research for flights and/or hotel stays.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">Professional Feedback</h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Trusted by travelers across the United States for expert planning and assistance.
            </p>
          </div>
          <ReviewSlider />
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 md:py-32 bg-white dark:bg-slate-950">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">Frequent Questions</h2>
          </div>
          <div className="space-y-8">
            {[
              {
                q: "Do you sell flights or hotels?",
                a: "No, GoComfortUSA is a travel assistance and consultation platform. We perform the research and optimize your travel options. You book directly with the official providers."
              },
              {
                q: "What do I get for the consultation fee?",
                a: "You receive a personalized research report containing optimized flight routes, stay recommendations, and expert guidance on how to secure the best value for your trip."
              },
              {
                q: "Can you help me with the booking process?",
                a: "Yes, we offer optional booking assistance where we guide you through the process of booking directly with airlines and hotels using the options we've researched for you."
              },
              {
                q: "How fast will I receive my travel options?",
                a: "Our team typically delivers your personalized travel research report within 1 to 24 hours, depending on the complexity of your request."
              }
            ].map((faq, i) => (
              <div key={i} className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">{faq.q}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-4">
          <div className="relative rounded-[40px] bg-primary px-8 py-16 md:py-24 text-center overflow-hidden shadow-3xl">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_bottom_left,white,transparent_70%)]"></div>
            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-8">Ready for a Better Way to Travel?</h2>
              <p className="text-xl text-white/90 mb-12 leading-relaxed">
                Join the professionals who trust GoComfortUSA for optimized travel planning and expert assistance. 
                Start your consultation request today.
              </p>
              <div className="flex flex-wrap justify-center gap-6">
                <Button size="lg" variant="secondary" className="rounded-full px-10 py-8 text-lg font-bold shadow-xl hover:translate-y-[-2px] transition-all" asChild>
                  <Link href={consultationLink}>Start Consultation</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full px-10 py-8 text-lg font-bold bg-transparent border-white/40 text-white hover:bg-white hover:text-primary transition-all"
                  asChild
                >
                  <Link href="/contact">Learn More</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
