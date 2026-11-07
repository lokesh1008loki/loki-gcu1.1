"use client"

import React, { useState, useEffect, useRef } from "react"
import {
  FileText,
  Search,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Sparkles,
} from "lucide-react"

interface ProcessStep {
  stepNumber: string
  badge: string
  title: string
  description: string
  detailHighlight: string
  actionHint: string
  icon: React.ElementType
  color: {
    bg: string
    text: string
    border: string
    ring: string
  }
  miniPreview: {
    label: string
    sublabel: string
    tags: string[]
  }
}

export default function HowWeWork() {
  const [activeStep, setActiveStep] = useState<number | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIsVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
            observer.disconnect()
          }
        })
      },
      { threshold: 0.15 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const steps: ProcessStep[] = [
    {
      stepNumber: "01",
      badge: "Step One · 2 Minutes",
      title: "Submit your request details",
      description:
        "Select your service: flight dates, theme park tickets, apartment lease invoice, or IKEA cart link. Provide your timeline with zero upfront payment commitment.",
      detailHighlight: "Simple online request form",
      actionHint: "No credit card needed to submit",
      icon: FileText,
      color: {
        bg: "bg-blue-500/10 dark:bg-blue-500/15",
        text: "text-blue-600 dark:text-blue-400",
        border: "border-blue-200 dark:border-blue-900/50",
        ring: "group-hover:border-blue-500/40",
      },
      miniPreview: {
        label: "Quick Selection",
        sublabel: "Select service to initiate",
        tags: ["Flights", "Theme Parks", "Rent Bills", "IKEA"],
      },
    },
    {
      stepNumber: "02",
      badge: "Step Two · Deep Audit",
      title: "Specialist audits options and discounts",
      description:
        "Our human consultants evaluate route timetables, partner inventory allocations, and authorized discount programs to eliminate layovers and unnecessary surcharges.",
      detailHighlight: "Human verified research",
      actionHint: "Audited across 40+ airline and partner channels",
      icon: Search,
      color: {
        bg: "bg-amber-500/10 dark:bg-amber-500/15",
        text: "text-amber-600 dark:text-amber-400",
        border: "border-amber-200 dark:border-amber-900/50",
        ring: "group-hover:border-amber-500/40",
      },
      miniPreview: {
        label: "Marketplace Scan",
        sublabel: "Comparing wholesale inventories",
        tags: ["Safety Score", "Route Speed", "True Price"],
      },
    },
    {
      stepNumber: "03",
      badge: "Step Three · Final Delivery",
      title: "Receive your verified dossier and reserve",
      description:
        "Get your complete report via email and WhatsApp within 1 to 24 hours. Complete reservations directly with official airlines, hotels, or landlords at true cost.",
      detailHighlight: "Direct booking freedom",
      actionHint: "Zero middleman markup guarantee",
      icon: CheckCircle2,
      color: {
        bg: "bg-emerald-500/10 dark:bg-emerald-500/15",
        text: "text-emerald-600 dark:text-emerald-400",
        border: "border-emerald-200 dark:border-emerald-900/50",
        ring: "group-hover:border-emerald-500/40",
      },
      miniPreview: {
        label: "Official Handover",
        sublabel: "Direct checkout with suppliers",
        tags: ["No Markups", "Official PNR", "Direct Link"],
      },
    },
  ]

  return (
    <section
      ref={sectionRef}
      className="py-20 md:py-24 bg-[#F4F7FB] dark:bg-[#181818] border-t border-slate-200/80 dark:border-neutral-800 relative overflow-hidden"
    >
      <div className="container mx-auto px-4 max-w-6xl relative">
        
        {/* Section Header (Skill.md B5 & B1: max width 680px, no hyphens, sentence case) */}
        <div
          className={`max-w-[680px] mx-auto text-center mb-14 md:mb-16 space-y-3 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/10 text-blue-700 dark:text-blue-300 text-xs font-semibold tracking-wide uppercase border border-blue-200 dark:border-blue-900/50">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>How The Concierge Works</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900 dark:text-white [text-wrap:balance]">
            From initial inquiry to verified booking in three simple steps
          </h2>
          <p className="text-base text-slate-600 dark:text-neutral-400 [text-wrap:pretty]">
            We remove the hours of comparison shopping so you can finalize your travel or living arrangements with complete clarity.
          </p>
        </div>

        {/* Desktop Connected Progress Indicator */}
        <div className="hidden md:grid grid-cols-3 gap-6 mb-4 px-2">
          {steps.map((step, idx) => (
            <div key={step.stepNumber} className="flex items-center gap-3">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  activeStep === idx
                    ? "bg-blue-600 text-white scale-110 shadow-sm"
                    : "bg-white dark:bg-[#1F1F1F] border border-slate-300 dark:border-neutral-700 text-slate-600 dark:text-neutral-400"
                }`}
              >
                {step.stepNumber}
              </div>
              <div className="flex-1 h-0.5 bg-slate-200 dark:bg-neutral-800 rounded-full overflow-hidden relative">
                {idx < 2 && (
                  <div
                    className={`absolute inset-0 bg-blue-600/40 origin-left transition-transform duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                      isVisible ? "scale-x-100" : "scale-x-0"
                    }`}
                    style={{ transitionDelay: `${300 + idx * 200}ms` }}
                  />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* 3-Step Connected Process Flow */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {steps.map((step, index) => {
            const Icon = step.icon
            const isHovered = activeStep === index

            return (
              <div
                key={step.stepNumber}
                onMouseEnter={() => setActiveStep(index)}
                onMouseLeave={() => setActiveStep(null)}
                style={{
                  transitionDelay: `${index * 120}ms`,
                }}
                className={`group rounded-2xl border bg-white dark:bg-[#1F1F1F] p-6 shadow-xs flex flex-col justify-between space-y-6 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] cursor-default hover:-translate-y-1 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                } ${
                  isHovered
                    ? "border-blue-400 dark:border-blue-700 shadow-md ring-1 ring-blue-500/20"
                    : "border-slate-200/80 dark:border-neutral-800"
                }`}
              >
                {/* Top Step Counter & Header Badge */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105 ${step.color.bg} ${step.color.text}`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="font-mono text-2xl font-bold tracking-tight text-slate-300 dark:text-neutral-700 group-hover:text-blue-500 transition-colors">
                        {step.stepNumber}
                      </span>
                    </div>

                    <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-[#272727] text-slate-700 dark:text-neutral-300 border border-slate-200 dark:border-neutral-700 flex items-center gap-1.5">
                      {index === 1 && (
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                        </span>
                      )}
                      {step.badge}
                    </span>
                  </div>

                  {/* Title and Description */}
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white [text-wrap:balance] group-hover:text-blue-600 transition-colors duration-200">
                      {step.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-neutral-400 leading-relaxed [text-wrap:pretty]">
                      {step.description}
                    </p>
                  </div>

                  {/* Lightweight Interactive Micro-Preview */}
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#272727]/60 border border-slate-100 dark:border-neutral-800 space-y-2 transition-colors duration-200 group-hover:border-blue-200 dark:group-hover:border-neutral-700">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-medium text-slate-700 dark:text-neutral-300">
                        {step.miniPreview.label}
                      </span>
                      <span className="text-slate-400 dark:text-neutral-500">
                        {step.miniPreview.sublabel}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {step.miniPreview.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-md bg-white dark:bg-[#181818] border border-slate-200/80 dark:border-neutral-700/80 text-[10px] font-medium text-slate-600 dark:text-neutral-400"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom Feature Pill & Hint */}
                <div className="pt-4 border-t border-slate-100 dark:border-neutral-800 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-neutral-200">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>{step.detailHighlight}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-neutral-400 font-mono">
                    {step.actionHint}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Reassurance Banner under Steps (Skill.md B4 & B9: Flat dark surfaces, live status) */}
        <div
          className={`mt-10 p-4 rounded-xl border border-slate-200/80 dark:border-neutral-800 bg-white dark:bg-[#1F1F1F] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs shadow-xs transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "400ms" }}
        >
          <div className="flex items-center gap-2.5 text-slate-700 dark:text-neutral-300 font-medium">
            <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0" />
            <span>
              Every itinerary is evaluated against safety records, transfer risk, and verified partner rates.
            </span>
          </div>

          <div className="flex items-center gap-2 font-semibold shrink-0">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-slate-800 dark:text-neutral-200">Average turnaround:</span>
            <span className="text-blue-600 font-bold">4 hours</span>
            <Clock className="h-4 w-4 text-blue-600 ml-0.5" />
          </div>
        </div>

      </div>
    </section>
  )
}