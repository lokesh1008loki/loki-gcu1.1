"use client"

import React, { useState } from "react"
import { 
  Plane, 
  Building2, 
  Clock, 
  ArrowRight, 
  ShieldCheck, 
  Check, 
  Sparkles,
  Luggage,
  Calendar
} from "lucide-react"
import { AutoSlider } from "@/components/ui/auto-slider"

export function HeroTravelCard() {
  const [activeTab, setActiveTab] = useState<"dossier" | "destinations">("dossier")

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm p-3 space-y-3">
      {/* Tab Switcher */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-neutral-800 pb-2.5 px-1">
        <div className="flex gap-1 bg-slate-100 dark:bg-neutral-800 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveTab("dossier")}
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
              activeTab === "dossier"
                ? "bg-white dark:bg-neutral-900 text-slate-900 dark:text-white shadow-xs"
                : "text-slate-600 dark:text-neutral-400 hover:text-slate-900"
            }`}
          >
            Sample Research Dossier
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("destinations")}
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
              activeTab === "destinations"
                ? "bg-white dark:bg-neutral-900 text-slate-900 dark:text-white shadow-xs"
                : "text-slate-600 dark:text-neutral-400 hover:text-slate-900"
            }`}
          >
            Featured Destinations
          </button>
        </div>

        <span className="hidden sm:inline-flex text-[11px] font-mono text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
          ● Verified Route
        </span>
      </div>

      {/* Tab 1: Interactive Realistic Travel Dossier */}
      {activeTab === "dossier" && (
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-neutral-950 border border-slate-200/80 dark:border-neutral-800 space-y-4">
          
          {/* Header Row */}
          <div className="flex items-center justify-between text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Consultation Case Study
              </span>
              <p className="font-semibold text-slate-900 dark:text-white">
                New York (JFK) ➔ London (LHR)
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block">Deliverable</span>
              <span className="font-mono text-xs font-bold text-primary">Inquiry #GCU-7821</span>
            </div>
          </div>

          {/* Flight Card */}
          <div className="p-3.5 rounded-lg bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-slate-800 dark:text-neutral-200">
                <Plane className="h-3.5 w-3.5 text-primary" />
                British Airways · Nonstop Option
              </span>
              <span className="text-[11px] font-mono text-slate-500">Flight BA178</span>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <div>
                <span className="text-base font-bold text-slate-900 dark:text-white">08:30 PM</span>
                <span className="text-[10px] text-slate-400 block font-mono">JFK Terminal 7</span>
              </div>

              <div className="flex flex-col items-center px-4">
                <span className="text-[10px] text-slate-500 font-medium">7h 05m direct</span>
                <div className="w-24 sm:w-32 h-[1.5px] bg-slate-200 dark:bg-neutral-700 relative my-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
                <span className="text-[9px] text-emerald-600 font-semibold">No Layovers</span>
              </div>

              <div className="text-right">
                <span className="text-base font-bold text-slate-900 dark:text-white">08:35 AM</span>
                <span className="text-[10px] text-slate-400 block font-mono">LHR Terminal 5</span>
              </div>
            </div>
          </div>

          {/* Hotel & Neighborhood Vetting */}
          <div className="p-3 rounded-lg bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 text-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5 text-primary" />
                The Londoner, Leicester Square
              </span>
              <span className="font-semibold text-emerald-600 text-[11px]">Safety Score: 98 / 100</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-neutral-400">
              Vetted for walkability, low street noise, and subway access within two minutes.
            </p>
          </div>

          {/* Savings & Direct Booking Banner */}
          <div className="p-3 rounded-lg bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-800 dark:text-emerald-400 block">
                Total Traveler Savings
              </span>
              <p className="font-bold text-emerald-900 dark:text-emerald-200">
                $360 saved vs standard online aggregators
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] line-through text-slate-400 block">$1,180 search</span>
              <span className="font-bold text-emerald-700 text-sm">$820 verified</span>
            </div>
          </div>

        </div>
      )}

      {/* Tab 2: Visual AutoSlider */}
      {activeTab === "destinations" && (
        <div className="relative h-[320px] rounded-xl overflow-hidden bg-slate-100 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800">
          <AutoSlider />
        </div>
      )}

      {/* Micro-footer proof */}
      <div className="flex items-center justify-between px-2 pt-1 text-[11px] text-slate-500">
        <span className="flex items-center gap-1">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
          Direct booking with official providers
        </span>
        <span>Delivery in 1 to 24 hours</span>
      </div>
    </div>
  )
}

