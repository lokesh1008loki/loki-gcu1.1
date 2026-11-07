"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { 
  Plane, 
  Ticket, 
  Home as HomeIcon, 
  ShoppingBag, 
  ArrowRight, 
  ShieldCheck, 
  Clock, 
  Check, 
  Building2,
  Percent
} from "lucide-react"

export function HeroMultiService() {
  const [activeService, setActiveService] = useState<"flight" | "parks" | "rent" | "ikea">("flight")

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm p-4 space-y-4">
      
      {/* 4-Pillar Instant Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 bg-slate-100 dark:bg-neutral-800 p-1.5 rounded-xl text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveService("flight")}
          className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg transition-all ${
            activeService === "flight"
              ? "bg-blue-600 text-white shadow-xs"
              : "text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <Plane className={`h-3.5 w-3.5 ${activeService === "flight" ? "text-white" : "text-primary"}`} />
          <span>Flights</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveService("parks")}
          className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg transition-all ${
            activeService === "parks"
              ? "bg-blue-600 text-white shadow-xs"
              : "text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <Ticket className={`h-3.5 w-3.5 ${activeService === "parks" ? "text-white" : "text-primary"}`} />
          <span>Theme Parks</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveService("rent")}
          className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg transition-all ${
            activeService === "rent"
              ? "bg-blue-600 text-white shadow-xs"
              : "text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <HomeIcon className={`h-3.5 w-3.5 ${activeService === "rent" ? "text-white" : "text-primary"}`} />
          <span>Rent &amp; Bills</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveService("ikea")}
          className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg transition-all ${
            activeService === "ikea"
              ? "bg-blue-600 text-white shadow-xs"
              : "text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <ShoppingBag className={`h-3.5 w-3.5 ${activeService === "ikea" ? "text-white" : "text-primary"}`} />
          <span>IKEA Orders</span>
        </button>
      </div>

      {/* Service 1: Flight Booking Card */}
      {activeService === "flight" && (
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-neutral-950 border border-slate-200/80 dark:border-neutral-800 space-y-3.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Plane className="h-4 w-4 text-primary" />
              Flight Route Optimization
            </span>
            <span className="text-[11px] font-mono text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
              Save up to 30%
            </span>
          </div>

          <div className="p-3 rounded-lg bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-base font-bold text-slate-900 dark:text-white">JFK</span>
                <span className="text-[10px] text-slate-400 block">New York</span>
              </div>
              <div className="flex flex-col items-center px-4">
                <span className="text-[10px] text-emerald-600 font-semibold">Nonstop Direct</span>
                <div className="w-24 sm:w-28 h-[1.5px] bg-slate-200 dark:bg-neutral-700 relative my-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
                <span className="text-[9px] text-slate-400">United · Delta · British Airways</span>
              </div>
              <div className="text-right">
                <span className="text-base font-bold text-slate-900 dark:text-white">LHR</span>
                <span className="text-[10px] text-slate-400 block">London</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-slate-500">Includes baggage and connection audit</span>
            <Link 
              href="/travel/flight" 
              className="font-semibold text-primary hover:underline flex items-center gap-1"
            >
              Search flights <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      )}

      {/* Service 2: Theme Parks Card */}
      {activeService === "parks" && (
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-neutral-950 border border-slate-200/80 dark:border-neutral-800 space-y-3.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Ticket className="h-4 w-4 text-primary" />
              Theme Park &amp; Event Admissions
            </span>
            <span className="text-[11px] font-mono text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
              Verified Partner Passes
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-lg bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 space-y-1">
              <span className="font-bold text-slate-900 dark:text-white block">Disneyland Resort</span>
              <span className="text-[11px] text-emerald-600 font-medium">Single &amp; Multi Day Passes</span>
            </div>
            <div className="p-2.5 rounded-lg bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 space-y-1">
              <span className="font-bold text-slate-900 dark:text-white block">Universal Studios</span>
              <span className="text-[11px] text-emerald-600 font-medium">VIP &amp; Express Admissions</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-slate-500">Also SeaWorld, Water Parks, CityPass</span>
            <Link 
              href="/tickets/disneyland" 
              className="font-semibold text-primary hover:underline flex items-center gap-1"
            >
              Explore park passes <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      )}

      {/* Service 3: Rent & Utility Bills Card */}
      {activeService === "rent" && (
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-neutral-950 border border-slate-200/80 dark:border-neutral-800 space-y-3.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
              <HomeIcon className="h-4 w-4 text-primary" />
              Living Expense &amp; Rental Relief
            </span>
            <span className="text-[11px] font-mono text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
              Up to 35% Off
            </span>
          </div>

          <div className="p-3 rounded-lg bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 space-y-1.5 text-xs">
            <div className="flex justify-between font-semibold">
              <span className="text-slate-900 dark:text-white">Apartment &amp; House Rent Assistance</span>
              <span className="text-emerald-600">Active Program</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Verified third party payment reconciliation for residential leases and municipal utilities.
            </p>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-slate-500">Electric, gas, municipal water bills</span>
            <Link 
              href="/bills/apartment-rental" 
              className="font-semibold text-primary hover:underline flex items-center gap-1"
            >
              View bills assistance <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      )}

      {/* Service 4: IKEA Shopping Card */}
      {activeService === "ikea" && (
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-neutral-950 border border-slate-200/80 dark:border-neutral-800 space-y-3.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
              <ShoppingBag className="h-4 w-4 text-primary" />
              IKEA Furniture &amp; Home Delivery
            </span>
            <span className="text-[11px] font-mono text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
              Up to 40% Off
            </span>
          </div>

          <div className="p-3 rounded-lg bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 space-y-1.5 text-xs">
            <div className="flex justify-between font-semibold">
              <span className="text-slate-900 dark:text-white">Direct Article Number Reconciliation</span>
              <span className="text-emerald-600">All USA Stores</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Submit your IKEA item numbers or cart links for discounted order fulfillment and home shipping.
            </p>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-slate-500">Furnish apartments and offices for less</span>
            <Link 
              href="/others/ikea" 
              className="font-semibold text-primary hover:underline flex items-center gap-1"
            >
              Start IKEA order <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      )}

      {/* Micro-footer proof */}
      <div className="flex items-center justify-between px-1 text-[11px] text-slate-500">
        <span className="flex items-center gap-1">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
          Verified American consultation service
        </span>
        <span>Customer support +1 (210) 418-2745</span>
      </div>

    </div>
  )
}

