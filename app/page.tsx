import { prisma } from "@/lib/prisma"
import React from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { 
  ArrowRight, 
  Plane, 
  Ticket, 
  Building2, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  Star, 
  Home as HomeIcon,
  ShoppingBag,
  Sparkles,
  Zap,
  Check,
  ChevronRight
} from "lucide-react"
import HowWeWork from "@/components/how-we-work"
import ReviewSlider from "@/components/review-slider"
import { TaglineReveal } from "@/components/tagline-reveal"
import { HeroMultiService } from "@/components/hero-multi-service"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function Home() {
  let consultationPrice = "29"
  let consultationLink = "/pay"

  try {
    const settings = await prisma.siteSettings.findFirst()
    const s = settings as any
    if (s?.consultationPrice) consultationPrice = s.consultationPrice
    if (s?.consultationLink) consultationLink = s.consultationLink
  } catch (error) {
    console.warn("Notice: Database momentarily unavailable for siteSettings, serving static fallback values:", error)
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#F4F7FB] dark:bg-[#181818] text-slate-900 dark:text-neutral-100 antialiased">
      
      {/* 1. Above The Fold: Hero Section (Instant 3-Second Comprehension with Minimalist Cool-Blue Tone) */}
      <section className="py-14 md:py-20 bg-[#EEF4FB] dark:bg-[#181818] border-b border-blue-100/80 dark:border-neutral-800">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Left Column: Clear Value Proposition (Max Width 680px) */}
            <div className="lg:col-span-7 space-y-6 max-w-[680px]">
              
              <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold bg-blue-600/10 dark:bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900/50">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>America&apos;s all in one lifestyle and travel concierge</span>
              </div>

              {/* Headline: Left to Right Gradient on text per B5, No Hyphens, Balanced Wrap */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-tight [text-wrap:balance] bg-gradient-to-r from-slate-950 via-slate-900 to-slate-600 dark:from-white dark:to-neutral-400 bg-clip-text text-transparent">
                Smarter bookings for flights, <br className="hidden sm:inline" />
                theme parks, and living costs
              </h1>

              {/* Subheading: Explicitly lists what the company provides within 3 seconds */}
              <p className="text-base sm:text-lg text-slate-600 dark:text-neutral-400 [text-wrap:pretty] leading-relaxed">
                Save time and money across your biggest expenses. We provide verified assistance for airline routes, Disney and Universal tickets, apartment rent payments, and utility bill reductions.
              </p>

              {/* Service Badges (Instant 3-Second Visual Anchors) */}
              <div className="flex flex-wrap gap-2 pt-1 text-xs font-semibold">
                <Link 
                  href="/travel/flight" 
                  className="px-3 py-1.5 rounded-lg bg-white dark:bg-[#1F1F1F] border border-blue-100 dark:border-neutral-800 text-slate-800 dark:text-neutral-200 hover:border-blue-500 hover:text-blue-600 transition-colors shadow-2xs flex items-center gap-1.5"
                >
                  <Plane className="h-3.5 w-3.5 text-blue-600" />
                  <span>Flights &amp; Hotels</span>
                </Link>

                <Link 
                  href="/tickets/disneyland" 
                  className="px-3 py-1.5 rounded-lg bg-white dark:bg-[#1F1F1F] border border-blue-100 dark:border-neutral-800 text-slate-800 dark:text-neutral-200 hover:border-blue-500 hover:text-blue-600 transition-colors shadow-2xs flex items-center gap-1.5"
                >
                  <Ticket className="h-3.5 w-3.5 text-blue-600" />
                  <span>Theme Park Passes</span>
                </Link>

                <Link 
                  href="/bills/apartment-rental" 
                  className="px-3 py-1.5 rounded-lg bg-white dark:bg-[#1F1F1F] border border-blue-100 dark:border-neutral-800 text-slate-800 dark:text-neutral-200 hover:border-blue-500 hover:text-blue-600 transition-colors shadow-2xs flex items-center gap-1.5"
                >
                  <HomeIcon className="h-3.5 w-3.5 text-blue-600" />
                  <span>Rent &amp; Utility Bills</span>
                </Link>

                <Link 
                  href="/others/ikea" 
                  className="px-3 py-1.5 rounded-lg bg-white dark:bg-[#1F1F1F] border border-blue-100 dark:border-neutral-800 text-slate-800 dark:text-neutral-200 hover:border-blue-500 hover:text-blue-600 transition-colors shadow-2xs flex items-center gap-1.5"
                >
                  <ShoppingBag className="h-3.5 w-3.5 text-blue-600" />
                  <span>IKEA Orders</span>
                </Link>
              </div>

              {/* Primary Call to Action */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Button 
                  size="lg" 
                  className="rounded-xl px-5 py-2.5 text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md active:scale-[0.98] transition-all ease-[cubic-bezier(0.22,1,0.36,1)] duration-300" 
                  asChild
                >
                  <Link href={consultationLink}>
                    Get service quote
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>

                <Button 
                  size="lg" 
                  variant="outline" 
                  className="rounded-xl px-5 py-2.5 text-base font-semibold bg-white dark:bg-[#1F1F1F] border-slate-300 dark:border-neutral-700 hover:bg-slate-50 dark:hover:bg-[#272727] active:scale-[0.98] transition-all ease-[cubic-bezier(0.22,1,0.36,1)] duration-300" 
                  asChild
                >
                  <Link href="/contact">
                    Talk to a specialist
                  </Link>
                </Button>
              </div>

              {/* Proof Signal beside CTA */}
              <div className="flex items-center gap-2 pt-1 text-xs text-slate-500 dark:text-neutral-400">
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-current" />
                  ))}
                </div>
                <span className="font-medium text-slate-700 dark:text-neutral-300">4.9 out of 5 stars</span>
                <span>•</span>
                <span>Over 12,000 satisfied American clients</span>
              </div>
            </div>

            {/* Right Column: Interactive Multi-Service Hub */}
            <div className="lg:col-span-5">
              <HeroMultiService />
            </div>

          </div>
        </div>
      </section>

      {/* 2. Proof Signal Strip */}
      <section className="py-8 bg-slate-50 dark:bg-[#1F1F1F] border-b border-slate-200 dark:border-neutral-800">
        <div className="container mx-auto px-4">
          <p className="text-center text-xs uppercase tracking-wider font-semibold text-slate-400 dark:text-neutral-500 mb-5">
            Accredited standards and verified customer feedback
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-14 opacity-85 hover:opacity-100 transition-opacity duration-300">
            <div className="relative h-10 w-28 grayscale hover:grayscale-0 transition-all duration-300">
              <Image src="/bbb.png" alt="BBB Accredited Business" fill className="object-contain" />
            </div>
            <div className="relative h-9 w-32 grayscale hover:grayscale-0 transition-all duration-300">
              <Image src="/google reviews.png" alt="Google Reviews" fill className="object-contain" />
            </div>
            <div className="relative h-9 w-32 grayscale hover:grayscale-0 transition-all duration-300">
              <Image src="/Trustpilot Stars.png" alt="Trustpilot Rating" fill className="object-contain" />
            </div>
            <div className="relative h-9 w-32 grayscale hover:grayscale-0 transition-all duration-300">
              <Image src="/site jabber.png" alt="Sitejabber Rating" fill className="object-contain" />
            </div>
          </div>
        </div>
      </section>

      {/* 3. The 4 Core Service Pillars: Informative Hub */}
      <section className="py-16 md:py-24 bg-[#F4F7FB] dark:bg-[#181818]">
        <div className="container mx-auto px-4">
          <div className="max-w-[680px] mx-auto text-center mb-14 space-y-3">
            <p className="text-xs uppercase tracking-widest font-semibold text-blue-600 dark:text-blue-400">
              Our Core Services
            </p>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight [text-wrap:balance]">
              Four ways we protect your budget and schedule
            </h2>
            <p className="text-base text-slate-600 dark:text-neutral-400 [text-wrap:pretty]">
              Choose the service you need today. Every request is reviewed by a specialized human consultant.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            
            {/* Pillar 1: Flights & Travel */}
            <div className="p-6 rounded-2xl border border-blue-200/80 dark:border-blue-900/50 bg-white dark:bg-[#1F1F1F] shadow-xs hover:shadow-md hover:border-blue-400 transition-all duration-300 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-primary">
                  <Plane className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[11px] font-mono font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">
                    Up to 30% savings
                  </span>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mt-2">
                    Flights &amp; Travel
                  </h3>
                </div>
                <p className="text-xs text-slate-600 dark:text-neutral-400 leading-relaxed [text-wrap:pretty]">
                  Deep route research across major airlines to find non stop itineraries, optimal transfer times, and hotel stays with zero markup fees.
                </p>
                <div className="space-y-1.5 text-xs text-slate-500 pt-1">
                  <div className="flex items-center gap-1.5">
                    <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>Domestic &amp; international flights</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>Vetted hotels and rental cars</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t">
                <Link 
                  href="/travel/flight" 
                  className="text-xs font-semibold text-primary hover:underline flex items-center justify-between"
                >
                  <span>Book flight research</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Pillar 2: Theme Parks & Tickets */}
            <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-neutral-800 bg-white dark:bg-[#1F1F1F] shadow-xs hover:shadow-md hover:border-blue-400 transition-all duration-300 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-11 h-11 rounded-xl bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800 flex items-center justify-center text-purple-600">
                  <Ticket className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[11px] font-mono font-bold text-purple-700 bg-purple-50 dark:bg-purple-950/40 px-2 py-0.5 rounded">
                    Authorized Passes
                  </span>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mt-2">
                    Theme Parks &amp; Tickets
                  </h3>
                </div>
                <p className="text-xs text-slate-600 dark:text-neutral-400 leading-relaxed [text-wrap:pretty]">
                  Official access tickets for major American attractions without long ticket booth lines or unpredictable reseller pricing.
                </p>
                <div className="space-y-1.5 text-xs text-slate-500 pt-1">
                  <div className="flex items-center gap-1.5">
                    <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>Disneyland &amp; Universal Studios</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>Water parks, SeaWorld &amp; CityPass</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-neutral-800">
                <Link 
                  href="/tickets/disneyland" 
                  className="text-xs font-semibold text-blue-600 hover:underline flex items-center justify-between"
                >
                  <span>Explore theme parks</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Pillar 3: Rent & Utility Bills */}
            <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-neutral-800 bg-white dark:bg-[#1F1F1F] shadow-xs hover:shadow-md hover:border-blue-400 transition-all duration-300 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600">
                  <HomeIcon className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">
                    Up to 35% discount
                  </span>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mt-2">
                    Rent &amp; Utility Bills
                  </h3>
                </div>
                <p className="text-xs text-slate-600 dark:text-neutral-400 leading-relaxed [text-wrap:pretty]">
                  Assistance with house and apartment rental payments and monthly utility expenses, helping residents manage living budgets effectively.
                </p>
                <div className="space-y-1.5 text-xs text-slate-500 pt-1">
                  <div className="flex items-center gap-1.5">
                    <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>Residential apartment &amp; lease relief</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>Electric, heating gas, municipal water</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-neutral-800">
                <Link 
                  href="/bills/apartment-rental" 
                  className="text-xs font-semibold text-blue-600 hover:underline flex items-center justify-between"
                >
                  <span>Request bills assistance</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Pillar 4: IKEA Furniture & Shopping */}
            <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-neutral-800 bg-white dark:bg-[#1F1F1F] shadow-xs hover:shadow-md hover:border-blue-400 transition-all duration-300 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-11 h-11 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-600">
                  <ShoppingBag className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[11px] font-mono font-bold text-amber-700 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded">
                    Up to 40% discount
                  </span>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mt-2">
                    IKEA Orders &amp; Living
                  </h3>
                </div>
                <p className="text-xs text-slate-600 dark:text-neutral-400 leading-relaxed [text-wrap:pretty]">
                  Furnish your residence or office with ease. Submit your IKEA shopping cart or article codes for discounted fulfillment and doorstep delivery.
                </p>
                <div className="space-y-1.5 text-xs text-slate-500 pt-1">
                  <div className="flex items-center gap-1.5">
                    <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>Furniture and room decor packages</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>Food and grocery order options</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-neutral-800">
                <Link 
                  href="/others/ikea" 
                  className="text-xs font-semibold text-blue-600 hover:underline flex items-center justify-between"
                >
                  <span>Submit IKEA cart</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Mandatory Tagline Reveal Section (B11) */}
      <TaglineReveal 
        phrase="Everyday living and travel expenses made affordable. We find verified savings so you keep more of your hard earned income."
        subphrase="Every request is personally verified by a dedicated specialist to eliminate hidden fees, inflated third party surcharges, and stressful delays."
      />

      {/* 5. How It Works Section */}
      <HowWeWork />

      {/* 6. Transparent Pricing & Risk Reversal Card */}
      <section className="py-16 md:py-24 bg-slate-50 dark:bg-[#1F1F1F] border-y border-slate-200 dark:border-neutral-800">
        <div className="container mx-auto px-4">
          <div className="max-w-[680px] mx-auto text-center mb-12 space-y-3">
            <p className="text-xs uppercase tracking-widest font-semibold text-primary">
              Simple Consultation Pricing
            </p>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight [text-wrap:balance]">
              Transparent consultation with zero surprises
            </h2>
            <p className="text-base text-slate-600 dark:text-neutral-400 [text-wrap:pretty]">
              A single flat research fee covering your complete flight, hotel, or custom quote report.
            </p>
          </div>

          <div className="max-w-md mx-auto">
            <Card className="rounded-2xl border-2 border-primary shadow-lg overflow-hidden bg-white dark:bg-neutral-900">
              <div className="p-8 text-center border-b border-slate-100 dark:border-neutral-800">
                <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                  Standard Research Consultation
                </span>
                <div className="flex items-center justify-center mt-3">
                  <span className="text-2xl font-bold text-slate-900 dark:text-white">$</span>
                  <span className="text-6xl font-bold tracking-tight text-slate-900 dark:text-white">
                    {consultationPrice}
                  </span>
                  <span className="text-sm font-medium text-slate-500 ml-2">USD flat</span>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  One time fee per itinerary or quote request
                </p>
              </div>

              <CardContent className="p-6 space-y-6">
                <ul className="space-y-3 text-sm">
                  {[
                    "Comprehensive route and ticket research",
                    "Neighborhood vetted hotel recommendations",
                    "Comparison of baggage policies and transfer times",
                    "Delivery to your inbox within 1 to 24 hours",
                    "Direct booking guidance links",
                    "Phone and WhatsApp support"
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="text-slate-700 dark:text-neutral-300">{item}</span>
                    </li>
                  ))}
                </ul>

                {/* Risk Reversal Box */}
                <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/70 dark:bg-emerald-950/20 text-xs text-emerald-900 dark:text-emerald-300 flex items-start gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Satisfaction Guarantee:</strong> If our specialists cannot identify viable itinerary options for your dates, your consultation fee is fully refunded.
                  </span>
                </div>

                <Button 
                  size="lg" 
                  className="w-full rounded-xl py-3 text-base font-semibold shadow-sm" 
                  asChild
                >
                  <Link href={consultationLink}>
                    Start research request
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 7. Reviews Section */}
      <section className="py-16 md:py-24 bg-white dark:bg-[#181818]">
        <div className="container mx-auto px-4">
          <div className="max-w-[680px] mx-auto text-center mb-12 space-y-3">
            <p className="text-xs uppercase tracking-widest font-semibold text-primary">
              Client Feedback
            </p>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight [text-wrap:balance]">
              What clients say about our services
            </h2>
            <p className="text-base text-slate-600 dark:text-neutral-400 [text-wrap:pretty]">
              Real reviews from families, individual explorers, and corporate residents nationwide.
            </p>
          </div>
          <ReviewSlider />
        </div>
      </section>

      {/* 8. FAQ Section with Interactive Radix Accordion */}
      <section className="py-16 md:py-24 bg-slate-50 dark:bg-[#1F1F1F] border-t border-slate-200 dark:border-neutral-800">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-12 space-y-3">
            <p className="text-xs uppercase tracking-widest font-semibold text-primary">
              Frequent Inquiries
            </p>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight [text-wrap:balance]">
              Frequently asked questions
            </h2>
          </div>

          <div className="space-y-3">
            <Accordion type="single" collapsible defaultValue="item-0" className="space-y-3">
              {[
                {
                  q: "What exact services does GoComfortUSA provide?",
                  a: "GoComfortUSA is a lifestyle and travel assistance concierge. We provide four primary services: flight and hotel route optimization, verified theme park tickets (Disneyland, Universal Studios, SeaWorld), apartment rent and utility bill assistance, and discounted IKEA furniture order fulfillment."
                },
                {
                  q: "Do you sell airline tickets or hotel rooms directly?",
                  a: "No. GoComfortUSA is a travel research and planning consultation company. We analyze schedules, prices, and comfort levels across carriers. You complete your reservation directly with the official provider so you retain complete control over your ticket."
                },
                {
                  q: "How does the rent and utility bill assistance program work?",
                  a: "You submit your residential lease invoice or utility bill statement (electric, gas, or water). Our team applies available partnership credits and relief allocations, allowing you to settle the obligation with savings of up to 35 percent."
                },
                {
                  q: "How do I purchase discounted theme park tickets?",
                  a: "Select your destination park (such as Disneyland Resort, Universal Studios, or CityPass), choose your visit dates, and our team provides authorized partner admissions with express access guidance."
                },
                {
                  q: "How quickly do I receive my travel or quotation report?",
                  a: "Most reports and quotation summaries are delivered between 1 and 24 hours after submission, sent directly to your email and WhatsApp."
                },
                {
                  q: "What payment methods do you accept for consultation?",
                  a: "We accept all major bank cards, debit cards, and secure electronic payments processed through 256 bit SSL encrypted gateway partners with zero hidden fees."
                }
              ].map((faq, i) => (
                <AccordionItem 
                  key={i} 
                  value={`item-${i}`}
                  className="rounded-xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 px-5 shadow-xs"
                >
                  <AccordionTrigger className="text-base font-semibold text-slate-900 dark:text-white py-4 hover:no-underline text-left">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-slate-600 dark:text-neutral-400 leading-relaxed pb-4 [text-wrap:pretty]">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* 9. Final CTA Section with Signature Minimalist Blue Theme */}
      <section className="py-16 md:py-24 bg-[#F4F7FB] dark:bg-[#181818] border-t border-slate-200/80 dark:border-neutral-800">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="rounded-3xl bg-blue-600 dark:bg-blue-600 text-white p-8 sm:p-14 text-center space-y-6 shadow-md border border-blue-500">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-blue-200" />
              <span>Direct Concierge Desk</span>
            </span>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight [text-wrap:balance] text-white">
              Ready to save on travel and living expenses?
            </h2>
            <p className="text-base sm:text-lg text-blue-100 max-w-xl mx-auto [text-wrap:pretty]">
              Whether booking flights, visiting Disney, managing rent, or ordering IKEA furniture, our specialists handle the details.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Button 
                size="lg" 
                className="rounded-xl px-6 py-2.5 text-base font-semibold bg-white text-blue-600 hover:bg-blue-50 shadow-sm active:scale-[0.98] transition-all ease-[cubic-bezier(0.22,1,0.36,1)] duration-300" 
                asChild
              >
                <Link href={consultationLink}>
                  Get service quote
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>

              <Button 
                size="lg" 
                variant="outline" 
                className="rounded-xl px-6 py-2.5 text-base font-semibold border-white/40 text-white hover:bg-blue-700/60 active:scale-[0.98] transition-all ease-[cubic-bezier(0.22,1,0.36,1)] duration-300" 
                asChild
              >
                <Link href="/contact">
                  Contact support
                </Link>
              </Button>
            </div>

            <p className="text-xs text-blue-200 pt-2 font-medium">
              Backed by our 100 percent satisfaction guarantee • Assistance line +1 (210) 418-2745
            </p>
          </div>
        </div>
      </section>

    </div>
  )
}
