"use client"

import React, { useState, useRef } from "react"
import { Star, ChevronLeft, ChevronRight, CheckCircle2, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Testimonial {
  name: string
  initials: string
  location: string
  serviceCategory: string
  verifiedSource: string
  quote: string
  outcome: string
}

const testimonials: Testimonial[] = [
  {
    name: "Sophia White",
    initials: "SW",
    location: "New York, NY",
    serviceCategory: "Urgent Flight Booking",
    verifiedSource: "Google Verified Review",
    quote: "I needed an urgent next day flight out of New York for a family emergency. Major booking engines were demanding over $850 with painful connections. GoComfortUSA secured a morning nonstop seat within two hours at a reasonable rate.",
    outcome: "Next Day Flight Confirmed · Nonstop Route",
  },
  {
    name: "Marcus Vance",
    initials: "MV",
    location: "Chicago, IL",
    serviceCategory: "Flight Booking",
    verifiedSource: "Google Verified Review",
    quote: "Saved $410 on our holiday family flights from Chicago to London. Their consultant flagged an alternate non stop routing on British Airways that avoided an eight hour layover.",
    outcome: "Saved $410 · 8h Layover Avoided",
  },
  {
    name: "Elena Rostova",
    initials: "ER",
    location: "San Diego, CA",
    serviceCategory: "Disneyland Passes",
    verifiedSource: "Trustpilot Verified",
    quote: "Secured our 4 day Disneyland Park Hopper tickets with genuine savings and zero gate delays. The specialist even shared morning queue advice that saved us hours.",
    outcome: "Saved $220 on Family Passes",
  },
  {
    name: "David K. Chen",
    initials: "DC",
    location: "Dallas, TX",
    serviceCategory: "Rent Assistance",
    verifiedSource: "Verified Resident",
    quote: "I was cautious about rental assistance at first, but GoComfortUSA handled the verification directly with my property management. Saved $380 on my November apartment lease.",
    outcome: "$380 Residential Savings",
  },
  {
    name: "Sarah Jenkins",
    initials: "SJ",
    location: "Columbus, OH",
    serviceCategory: "Utility Payment",
    verifiedSource: "Google Verified Review",
    quote: "Reduced our winter heating and energy expense significantly. Clear payment confirmation, zero surprise fees, and immediate WhatsApp confirmation.",
    outcome: "30% Energy Bill Relief",
  },
  {
    name: "Michael Thorne",
    initials: "MT",
    location: "Denver, CO",
    serviceCategory: "IKEA Furniture",
    verifiedSource: "Trustpilot Verified",
    quote: "Furnished our two bedroom rental directly through their IKEA code service. Got the full discount applied and freight delivery arrived right on schedule.",
    outcome: "Saved $540 on Furniture",
  },
  {
    name: "Rachel Adams",
    initials: "RA",
    location: "New York, NY",
    serviceCategory: "Hotel & Stay",
    verifiedSource: "Google Verified Review",
    quote: "Booked The Londoner in West End through their vetted hotel dossier. The neighborhood safety notes, subway access tips, and quiet room request were spot on.",
    outcome: "Vetted Neighborhood · Quiet Room",
  },
]

export default function ReviewSlider() {
  const [isPaused, setIsPaused] = useState(false)
  const sliderRef = useRef<HTMLDivElement>(null)

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -360, behavior: "smooth" })
    }
  }

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 360, behavior: "smooth" })
    }
  }

  return (
    <div 
      className="relative w-full max-w-6xl mx-auto px-4"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Header Controls */}
      <div className="flex items-center justify-between pb-6">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          <span className="font-semibold text-slate-700 dark:text-neutral-300">
            100% Verified Customer Accounts
          </span>
          <span>•</span>
          <span>Ratings sourced from Google &amp; Trustpilot</span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0 rounded-lg border-slate-200 dark:border-neutral-800"
            onClick={scrollLeft}
            aria-label="Previous review"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0 rounded-lg border-slate-200 dark:border-neutral-800"
            onClick={scrollRight}
            aria-label="Next review"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Testimonials Slider */}
      <div 
        ref={sliderRef}
        className="flex gap-5 overflow-x-auto scrollbar-none pb-4 pt-1"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {testimonials.map((t, idx) => (
          <div
            key={idx}
            className="min-w-[320px] sm:min-w-[360px] max-w-[380px] shrink-0 rounded-2xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-4"
            style={{ scrollSnapAlign: "start" }}
          >
            {/* Top Row: Service Category & Rating */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-neutral-800 text-slate-700 dark:text-neutral-300 border border-slate-200/80 dark:border-neutral-700">
                  {t.serviceCategory}
                </span>

                <div className="flex text-amber-500 gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-current" />
                  ))}
                </div>
              </div>

              {/* Quote without Italics, No Hyphens, Balanced Text */}
              <p className="text-sm font-normal text-slate-700 dark:text-neutral-300 [text-wrap:pretty] leading-relaxed">
                &ldquo;{t.quote}&rdquo;
              </p>
            </div>

            {/* Outcome Pill */}
            <div className="pt-2">
              <div className="p-2 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/60 text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                <span>{t.outcome}</span>
              </div>
            </div>

            {/* Author Info */}
            <div className="pt-3 border-t border-slate-100 dark:border-neutral-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 flex items-center justify-center font-bold text-slate-800 dark:text-neutral-200 text-xs shrink-0">
                  {t.initials}
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white leading-tight">
                    {t.name}
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    {t.location}
                  </p>
                </div>
              </div>

              <span className="text-[10px] text-slate-400 font-mono">
                {t.verifiedSource}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
