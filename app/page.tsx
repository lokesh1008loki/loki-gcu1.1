import { prisma } from "@/lib/prisma"
import React from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { 
  ArrowRight, 
  Plane, 
  Building2, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Star, 
  Compass, 
  BadgeCheck 
} from "lucide-react"
import { AutoSlider } from "@/components/ui/auto-slider"
import HowWeWork from "@/components/how-we-work"
import ReviewSlider from "@/components/review-slider"
import { TaglineReveal } from "@/components/tagline-reveal"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function Home() {
  const settings = await prisma.siteSettings.findFirst()
  const s = settings as any
  const consultationPrice = s?.consultationPrice || "29"
  const consultationLink = s?.consultationLink || "/pay"

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-[#181818] text-slate-900 dark:text-neutral-100">
      
      {/* 1. Above The Fold: Hero Section */}
      <section className="relative py-16 md:py-24 bg-white dark:bg-[#181818] border-b border-slate-100 dark:border-neutral-800">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Column: Copy & Primary Action (Max Width 680px) */}
            <div className="lg:col-span-7 space-y-6 max-w-[680px]">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Personalized travel research</span>
              </div>

              {/* Heading: Left to Right Gradient on text per B5 */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-tight [text-wrap:balance] bg-gradient-to-r from-black to-neutral-500 dark:from-white dark:to-neutral-400 bg-clip-text text-transparent">
                Smarter flight and hotel options <br className="hidden sm:inline" />
                for busy travelers
              </h1>

              {/* Subheading: Clarifies how and adds specificity per A5, max-w-[680px] */}
              <p className="text-base sm:text-lg lg:text-xl text-slate-600 dark:text-neutral-400 [text-wrap:pretty] leading-relaxed">
                Personalized route research, verified accommodation choices, and direct booking guidance delivered to your inbox in under 24 hours.
              </p>

              {/* Primary Action Button (Button-md 8px vert, 12px horiz per B2) */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Button 
                  size="lg" 
                  className="rounded-xl px-5 py-2.5 text-base font-semibold shadow-sm hover:shadow-md transition-all ease-[cubic-bezier(0.22,1,0.36,1)] duration-500" 
                  asChild
                >
                  <Link href={consultationLink}>
                    Get travel options
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>

                <Button 
                  size="lg" 
                  variant="outline" 
                  className="rounded-xl px-5 py-2.5 text-base font-semibold border-slate-300 dark:border-neutral-700 hover:bg-slate-50 dark:hover:bg-neutral-800 transition-all ease-[cubic-bezier(0.22,1,0.36,1)] duration-500" 
                  asChild
                >
                  <Link href="/contact">
                    Talk to a specialist
                  </Link>
                </Button>
              </div>

              {/* Proof Signal beside CTA per A2 */}
              <div className="flex items-center gap-2 pt-2 text-xs text-slate-500 dark:text-neutral-400">
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-current" />
                  ))}
                </div>
                <span className="font-medium text-slate-700 dark:text-neutral-300">4.9 out of 5 stars</span>
                <span>•</span>
                <span>Verified ratings across Google and Trustpilot</span>
              </div>
            </div>

            {/* Right Column: Hero Visual (AutoSlider) */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-slate-200 dark:border-neutral-800 p-2 bg-slate-50 dark:bg-neutral-900 shadow-sm">
                <div className="relative h-[360px] sm:h-[440px] rounded-xl overflow-hidden bg-white dark:bg-neutral-950">
                  <AutoSlider />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Proof Signal Strip: Verified Partner & Review Badges */}
      <section className="py-10 bg-slate-50 dark:bg-[#1F1F1F] border-b border-slate-200 dark:border-neutral-800">
        <div className="container mx-auto px-4">
          <p className="text-center text-xs uppercase tracking-wider font-semibold text-slate-400 dark:text-neutral-500 mb-6">
            Recognized and accredited travel research standards
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-85 hover:opacity-100 transition-opacity duration-300">
            <div className="relative h-12 w-28 grayscale hover:grayscale-0 transition-all duration-300">
              <Image src="/bbb.png" alt="BBB Accredited Business" fill className="object-contain" />
            </div>
            <div className="relative h-10 w-36 grayscale hover:grayscale-0 transition-all duration-300">
              <Image src="/google reviews.png" alt="Google Reviews" fill className="object-contain" />
            </div>
            <div className="relative h-10 w-36 grayscale hover:grayscale-0 transition-all duration-300">
              <Image src="/Trustpilot Stars.png" alt="Trustpilot Rating" fill className="object-contain" />
            </div>
            <div className="relative h-10 w-36 grayscale hover:grayscale-0 transition-all duration-300">
              <Image src="/site jabber.png" alt="Sitejabber Rating" fill className="object-contain" />
            </div>
          </div>
        </div>
      </section>

      {/* 3. Mandatory Tagline Reveal Section (B11) */}
      <TaglineReveal 
        phrase="Travel planning without hours of search. We find your best routes and stays while you prepare for your journey."
        subphrase="Every itinerary recommendation is evaluated by dedicated specialists to eliminate hidden fees, long layovers, and unpredictable connections."
      />

      {/* 4. Mid Page: Outcome-Driven Benefits */}
      <section className="py-20 md:py-24 bg-white dark:bg-[#181818]">
        <div className="container mx-auto px-4">
          <div className="max-w-[680px] mx-auto text-center mb-16 space-y-3">
            <p className="text-xs uppercase tracking-widest font-semibold text-primary">
              Core Benefits
            </p>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight [text-wrap:balance]">
              Built for people who value time and travel comfort
            </h2>
            <p className="text-base text-slate-600 dark:text-neutral-400 [text-wrap:pretty]">
              We handle the complex comparison work across dozens of airline networks and accommodation providers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: <Plane className="h-6 w-6 text-primary" />,
                title: "Optimized flight connections",
                description: "Cut unnecessary layovers and select departure times that preserve your energy and productivity."
              },
              {
                icon: <Building2 className="h-6 w-6 text-primary" />,
                title: "Vetted accommodation choices",
                description: "Neighborhood safety, cleanliness, and proximity to your destinations verified before you reserve."
              },
              {
                icon: <ShieldCheck className="h-6 w-6 text-primary" />,
                title: "Zero ticket markups",
                description: "You finalize reservations directly through official airline and hotel channels with zero middleman fees."
              },
              {
                icon: <Clock className="h-6 w-6 text-primary" />,
                title: "Fast 24 hour turnaround",
                description: "Your personalized travel option report lands in your inbox within 1 to 24 hours of submission."
              },
              {
                icon: <Compass className="h-6 w-6 text-primary" />,
                title: "Custom route planning",
                description: "Complex multi destination schedules organized with clear transition times and baggage allowances."
              },
              {
                icon: <BadgeCheck className="h-6 w-6 text-primary" />,
                title: "Dedicated guidance support",
                description: "Direct WhatsApp and phone assistance available whenever you need help picking between options."
              }
            ].map((benefit, i) => (
              <div 
                key={i} 
                className="p-6 rounded-2xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm hover:shadow-md transition-all duration-300 space-y-3"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  {benefit.icon}
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  {benefit.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-neutral-400 leading-relaxed [text-wrap:pretty]">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>

          {/* Compliance note */}
          <div className="max-w-2xl mx-auto mt-12 p-4 rounded-xl border border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-900 text-center">
            <p className="text-xs text-slate-600 dark:text-neutral-400">
              GoComfortUSA is an independent travel research consultation firm. We provide tailored recommendations; all flight tickets and hotel bookings are completed directly through official carrier platforms.
            </p>
          </div>
        </div>
      </section>

      {/* 5. How It Works Section */}
      <HowWeWork />

      {/* 6. Transparent Pricing & Risk Reversal Card */}
      <section className="py-20 md:py-24 bg-slate-50 dark:bg-[#1F1F1F] border-y border-slate-200 dark:border-neutral-800">
        <div className="container mx-auto px-4">
          <div className="max-w-[680px] mx-auto text-center mb-12 space-y-3">
            <p className="text-xs uppercase tracking-widest font-semibold text-primary">
              Simple Pricing
            </p>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight [text-wrap:balance]">
              Transparent consultation with zero surprises
            </h2>
            <p className="text-base text-slate-600 dark:text-neutral-400 [text-wrap:pretty]">
              A single flat research fee covering your complete flight and hotel comparison report.
            </p>
          </div>

          <div className="max-w-md mx-auto">
            <Card className="rounded-2xl border-2 border-primary shadow-lg overflow-hidden bg-white dark:bg-neutral-900">
              <div className="p-8 text-center border-b border-slate-100 dark:border-neutral-800">
                <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                  Standard Travel Research
                </span>
                <div className="flex items-center justify-center mt-3">
                  <span className="text-2xl font-bold text-slate-900 dark:text-white">$</span>
                  <span className="text-6xl font-bold tracking-tight text-slate-900 dark:text-white">
                    {consultationPrice}
                  </span>
                  <span className="text-sm font-medium text-slate-500 ml-2">USD flat</span>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  One time fee per itinerary request
                </p>
              </div>

              <CardContent className="p-6 space-y-6">
                <ul className="space-y-3 text-sm">
                  {[
                    "Comprehensive flight route research",
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
                <div className="p-3 rounded-xl border border-emerald-200 bg-emerald-50/70 dark:bg-emerald-950/20 text-xs text-emerald-900 dark:text-emerald-300 flex items-start gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Satisfaction Guarantee:</strong> If our research cannot present viable itinerary options for your dates, your consultation fee is fully refunded.
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
      <section className="py-20 md:py-24 bg-white dark:bg-[#181818]">
        <div className="container mx-auto px-4">
          <div className="max-w-[680px] mx-auto text-center mb-12 space-y-3">
            <p className="text-xs uppercase tracking-widest font-semibold text-primary">
              Client Feedback
            </p>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight [text-wrap:balance]">
              What travelers say about our research
            </h2>
            <p className="text-base text-slate-600 dark:text-neutral-400 [text-wrap:pretty]">
              Real reviews from families, individual explorers, and corporate professionals.
            </p>
          </div>
          <ReviewSlider />
        </div>
      </section>

      {/* 8. FAQ Section: 6 Questions, Plain Question & Answer, No Hyphens */}
      <section className="py-20 md:py-24 bg-slate-50 dark:bg-[#1F1F1F] border-t border-slate-200 dark:border-neutral-800">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-12 space-y-3">
            <p className="text-xs uppercase tracking-widest font-semibold text-primary">
              Frequent Inquiries
            </p>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight [text-wrap:balance]">
              Frequently asked questions
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "Do you sell airline tickets or hotel rooms directly?",
                a: "No. GoComfortUSA is a travel research and planning consultation company. We analyze schedules, prices, and comfort levels across carriers. You complete your reservation directly with the official provider so you retain complete control over your ticket."
              },
              {
                q: "What do I receive for the consultation fee?",
                a: "You receive a clear itinerary report detailing the most efficient flight paths, vetted hotel options matching your standards, notes on baggage allowances, and direct links to book without middleman fees."
              },
              {
                q: "Can you assist me during the actual checkout process?",
                a: "Yes. If you prefer live guidance while entering your details on the airline or hotel checkout page, our team is available via phone or WhatsApp to walk you through each step."
              },
              {
                q: "How fast do I receive my travel recommendations?",
                a: "Most reports are delivered between 1 and 24 hours after submission, depending on the number of destinations and complexity of your schedule."
              },
              {
                q: "What happens if my travel dates change before booking?",
                a: "Simply message your designated consultant. We will update the route analysis for your new timeline without requiring a new fee."
              },
              {
                q: "Why use GoComfortUSA instead of public aggregators?",
                a: "Public search tools prioritize sponsored results and high commission carriers. Our specialists prioritize your flight comfort, shortest connection times, and verified neighborhood safety."
              }
            ].map((faq, i) => (
              <div 
                key={i} 
                className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 space-y-2 shadow-xs"
              >
                <h3 className="text-base font-semibold text-slate-900 dark:text-white [text-wrap:balance]">
                  {faq.q}
                </h3>
                <p className="text-sm text-slate-600 dark:text-neutral-400 leading-relaxed [text-wrap:pretty]">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Final CTA Section */}
      <section className="py-20 md:py-24 bg-white dark:bg-[#181818] border-t border-slate-200 dark:border-neutral-800">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="rounded-2xl border border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-900 p-8 sm:p-12 text-center space-y-6 shadow-sm">
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight [text-wrap:balance] text-slate-900 dark:text-white">
              Ready for a better travel experience?
            </h2>
            <p className="text-base sm:text-lg text-slate-600 dark:text-neutral-400 max-w-xl mx-auto [text-wrap:pretty]">
              Leave the tedious flight comparisons and hotel vetting to our specialists. Start your consultation today.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Button 
                size="lg" 
                className="rounded-xl px-6 py-2.5 text-base font-semibold shadow-sm hover:shadow-md transition-all ease-[cubic-bezier(0.22,1,0.36,1)] duration-500" 
                asChild
              >
                <Link href={consultationLink}>
                  Get travel options
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>

              <Button 
                size="lg" 
                variant="outline" 
                className="rounded-xl px-6 py-2.5 text-base font-semibold border-slate-300 dark:border-neutral-700 hover:bg-white dark:hover:bg-neutral-800 transition-all ease-[cubic-bezier(0.22,1,0.36,1)] duration-500" 
                asChild
              >
                <Link href="/contact">
                  Contact support
                </Link>
              </Button>
            </div>

            <p className="text-xs text-slate-400 pt-2">
              Backed by our 100 percent satisfaction guarantee • Flat ${consultationPrice} fee
            </p>
          </div>
        </div>
      </section>

    </div>
  )
}
