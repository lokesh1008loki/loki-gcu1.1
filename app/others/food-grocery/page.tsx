"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import Script from "next/script"
import { 
  Phone, 
  Check, 
  Truck, 
  ShoppingBag, 
  MapPin, 
  User, 
  Mail, 
  ShieldCheck, 
  Clock, 
  Sparkles, 
  ChevronRight, 
  Store,
  MessageSquare
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Google Sheets App Script URL for form submission
const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbxg56QJu-tLKmO2lQ-PrxJMgK8SVb_HSR0K5Tc1GPUgN8zPgz6K5U-S0Q85QiwulynWNg/exec"
const PRIMARY_PHONE = "+1 (210) 418-2745"
const CLEANED_PHONE = "12104182745"

const stores = [
  { id: "walmart", name: "Walmart" },
  { id: "instacart", name: "Instacart" },
  { id: "costco", name: "Costco" },
  { id: "target", name: "Target" },
  { id: "aldi", name: "ALDI" },
  { id: "kroger", name: "Kroger" },
  { id: "wholefoods", name: "Whole Foods" },
  { id: "traderjoes", name: "Trader Joe's" },
  { id: "other", name: "Other Store (Specify in List)" }
]

export default function FoodGroceryLandingPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    zipCode: "",
    preferredStore: "",
    groceryRequest: "",
    formId: "grocery-delivery",
    timestamp: new Date().toISOString()
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const [activeSlide, setActiveSlide] = useState(0)
  const sliderImages = [
    "/ass/g1.jpg",
    "/ass/g2.jpg",
    "/ass/g3.jpg",
    "/ass/g4.jpg",
    "/ass/g5.jpg"
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % 5)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    if (name === "phone") {
      const cleaned = value.replace(/\D/g, "").slice(0, 10)
      setFormData(prev => ({ ...prev, [name]: cleaned }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const validatePhone = (phone: string) => {
    const digits = phone.replace(/\D/g, "")
    return digits.length === 10
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus("idle")
    setErrorMessage("")

    if (!validatePhone(formData.phone)) {
      setErrorMessage("Please enter a valid phone number.")
      setSubmitStatus("error")
      setIsSubmitting(false)
      return
    }

    try {
      // Direct POST to Google Sheets via Apps Script Web App
      await fetch(GOOGLE_SHEET_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          timestamp: new Date().toISOString()
        }),
        mode: "no-cors" // Standard mode for cross-domain Apps Script requests
      })

      setSubmitStatus("success")
      
      // Trigger Google Ads conversion tracking event
      if (typeof window !== "undefined" && (window as any).gtag_report_conversion) {
        (window as any).gtag_report_conversion();
      }

      setFormData({
        fullName: "",
        phone: "",
        email: "",
        address: "",
        zipCode: "",
        preferredStore: "",
        groceryRequest: "",
        formId: "grocery-delivery",
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error("Error submitting form:", error)
      setSubmitStatus("error")
      setErrorMessage("Network error. Please check your connection and try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-20 md:pb-8 overflow-x-hidden">
      {/* Google tag (gtag.js) is loaded globally in layout.tsx */}
      <Script id="google-ads-conversion" strategy="afterInteractive">
        {`
          window.gtag_report_conversion = function(url) {
            var callback = function () {
              if (typeof(url) != 'undefined') {
                window.location = url;
              }
            };
            if (typeof window.gtag === 'function') {
              window.gtag('event', 'conversion', {
                  'send_to': 'AW-18183373348/bvZ5CPSr-7EcEKSEwd5D',
                  'value': 1.0,
                  'currency': 'USD',
                  'event_callback': callback
              });
            }
            return false;
          };
        `}
      </Script>
      {/* Promotional Top Bar */}
      <div className="bg-emerald-700 text-white py-2 px-4 text-center text-xs sm:text-sm font-semibold tracking-wide shadow-sm">
        ✨ Save Up To <span className="text-yellow-300 font-bold">35% OFF</span> On Your Final Price. We Shop, You Relax!
      </div>

      {/* Hero Section */}
      <section className="relative bg-white dark:bg-slate-950 py-12 md:py-20 overflow-hidden border-b border-slate-100">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.08),transparent_50%)] z-0"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-100/30 rounded-full blur-3xl -z-10"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs sm:text-sm font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm animate-pulse">
                <Sparkles className="h-4 w-4" />
                <span>USA-Wide Personal Shopping & Delivery</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.15] text-slate-900">
                Fresh Groceries <br />
                <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                  Delivered To Your Door 🛒
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-slate-600 max-w-2xl leading-relaxed">
                Save on grocery orders with fast delivery across the USA. Send your grocery request and our team will contact you shortly.
              </p>

              {/* Promo Banner / Card inside Hero */}
              <div className="bg-gradient-to-br from-emerald-50 to-yellow-50/50 border border-emerald-100 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row gap-4 items-center">
                <div className="bg-yellow-300 text-emerald-950 font-black rounded-full h-16 w-16 flex flex-col items-center justify-center text-center shrink-0 shadow-md transform rotate-[-3deg]">
                  <span className="text-xs font-semibold leading-none">SAVE UP TO</span>
                  <span className="text-xl leading-none">35%</span>
                  <span className="text-[10px] font-bold leading-none">OFF</span>
                </div>
                <div className="text-center sm:text-left space-y-1">
                  <h3 className="font-bold text-emerald-900 text-lg">Send Your Grocery List On WhatsApp</h3>
                  <p className="text-sm text-slate-600">Get the absolute best price comparison and fast delivery today.</p>
                </div>
              </div>

              {/* Direct CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-7 shadow-lg shadow-emerald-200 transition-all duration-300 text-base flex justify-center items-center"
                  asChild
                >
                  <Link href={`https://wa.me/${CLEANED_PHONE}?text=Hi,%20I%20want%20to%20submit%20a%20grocery%20order%20request.`} target="_blank" className="w-full flex justify-center items-center">
                    <MessageSquare className="mr-2 h-5 w-5 fill-white text-emerald-600" />
                    WhatsApp Grocery List
                  </Link>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="w-full sm:w-auto rounded-full border-2 border-slate-200 hover:bg-slate-50 font-bold px-8 py-7 transition-all duration-300 text-base flex justify-center items-center"
                  asChild
                >
                  <Link href={`tel:${CLEANED_PHONE}`} className="w-full flex justify-center items-center">
                    <Phone className="mr-2 h-5 w-5 text-emerald-600" />
                    Call Now: {PRIMARY_PHONE}
                  </Link>
                </Button>
              </div>

              {/* Image Slider / Slidebar */}
              <div className="relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden shadow-md group border border-slate-100 bg-slate-100">
                {sliderImages.map((src, idx) => (
                  <div
                    key={idx}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                      idx === activeSlide ? "opacity-100 z-10" : "opacity-0 z-0"
                    }`}
                  >
                    <Image
                      src={src}
                      alt={`Fresh Groceries ${idx + 1}`}
                      fill
                      className="object-cover"
                      priority={idx === 0}
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                ))}
                
                {/* Navigation Dots */}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20">
                  {sliderImages.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveSlide(idx)}
                      className={`h-2.5 w-2.5 rounded-full transition-all ${
                        idx === activeSlide 
                          ? "bg-white scale-125 shadow-sm" 
                          : "bg-white/50 hover:bg-white/80"
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>

              {/* Partner Stores Row */}
              <div className="pt-4 border-t border-slate-100">
                <p className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-3">Order from your favorite stores</p>
                <div className="flex flex-wrap items-center gap-6 opacity-75">
                  <span className="font-bold text-slate-700 tracking-tight text-lg">Walmart</span>
                  <span className="font-bold text-slate-700 tracking-tight text-lg text-emerald-600 flex items-center">
                    <span className="text-orange-500 mr-0.5 font-black">i</span>nstacart
                  </span>
                  <span className="font-bold text-slate-700 tracking-tight text-lg">Costco</span>
                  <span className="font-bold text-slate-700 tracking-tight text-lg text-red-600">Target</span>
                  <span className="font-bold text-slate-400 tracking-tight text-sm">& more!</span>
                </div>
              </div>
            </div>

            {/* Right Column (Lead Form Anchor) */}
            <div className="lg:col-span-5 relative" id="request-form">
              <div className="absolute -inset-1.5 bg-gradient-to-r from-emerald-500 to-yellow-400 rounded-3xl blur opacity-20 animate-pulse"></div>
              <Card className="relative rounded-2xl shadow-xl border-slate-100 overflow-hidden bg-white">
                <div className="bg-emerald-600 text-white p-5 text-center font-bold text-lg flex items-center justify-center gap-2">
                  <ShoppingBag className="h-5 w-5" />
                  Quick Grocery Request Form
                </div>
                
                <CardContent className="p-6 space-y-4">
                  {submitStatus === "success" && (
                    <Alert className="bg-green-50 border-green-200 text-green-800">
                      <Check className="h-4 w-4 text-green-600" />
                      <AlertTitle className="font-bold">Request Received!</AlertTitle>
                      <AlertDescription>
                        Thank you! Your grocery request has been logged successfully. A specialist will review it and contact you shortly within 30 minutes.
                      </AlertDescription>
                    </Alert>
                  )}

                  {submitStatus === "error" && (
                    <Alert variant="destructive">
                      <AlertTitle className="font-bold">Error</AlertTitle>
                      <AlertDescription>{errorMessage}</AlertDescription>
                    </Alert>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="fullName">Full Name <span className="text-red-500">*</span></Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input
                          id="fullName"
                          name="fullName"
                          placeholder="First and last name"
                          value={formData.fullName}
                          onChange={handleChange}
                          required
                          className="pl-9 text-base sm:text-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="phone">Phone Number <span className="text-red-500">*</span></Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          placeholder="Enter 10-digit phone number"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                          maxLength={10}
                          className="pl-9 text-base sm:text-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="email">Email Address <span className="text-red-500">*</span></Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="your.email@example.com"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="pl-9 text-base sm:text-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="address">Delivery Address <span className="text-red-500">*</span></Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input
                          id="address"
                          name="address"
                          placeholder="Street address, City, State"
                          value={formData.address}
                          onChange={handleChange}
                          required
                          className="pl-9 text-base sm:text-sm"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="zipCode">ZIP Code <span className="text-red-500">*</span></Label>
                        <Input
                          id="zipCode"
                          name="zipCode"
                          placeholder="e.g. 90210"
                          value={formData.zipCode}
                          onChange={handleChange}
                          required
                          className="text-base sm:text-sm"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="preferredStore">Preferred Store <span className="text-red-500">*</span></Label>
                        <select
                          id="preferredStore"
                          name="preferredStore"
                          value={formData.preferredStore}
                          onChange={handleChange}
                          required
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base sm:text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        >
                          <option value="">Select store</option>
                          {stores.map(store => (
                            <option key={store.id} value={store.id}>
                              {store.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="groceryRequest">Grocery Request / List <span className="text-red-500">*</span></Label>
                      <Textarea
                        id="groceryRequest"
                        name="groceryRequest"
                        placeholder="List items, brand preferences, and quantities. E.g.
- 2 Gallons of Whole Milk (Organic)
- 3 lbs Fresh Bananas
- 1 Loaf of Wheat Bread"
                        value={formData.groceryRequest}
                        onChange={handleChange}
                        required
                        className="min-h-[120px] text-base sm:text-sm"
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-6 rounded-lg text-lg shadow-md transition-all"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Submitting Request..." : "Submit Grocery Request"}
                    </Button>
                    
                    <p className="text-[10px] text-center text-slate-400">
                      *By submitting, you agree to receive follow-up support calls/messages. We protect your privacy.
                    </p>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges Bar */}
      <section className="bg-yellow-300 py-6 border-y border-yellow-400 shadow-inner">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            
            <div className="flex flex-col items-center space-y-1.5">
              <div className="bg-white/80 p-2.5 rounded-full shadow-sm text-emerald-700">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h4 className="font-extrabold text-slate-900 text-sm sm:text-base">USA-Wide Support</h4>
              <p className="text-xs text-slate-700">Servicing all major states & cities</p>
            </div>

            <div className="flex flex-col items-center space-y-1.5">
              <div className="bg-white/80 p-2.5 rounded-full shadow-sm text-emerald-700">
                <Clock className="h-6 w-6" />
              </div>
              <h4 className="font-extrabold text-slate-900 text-sm sm:text-base">Fast Response</h4>
              <p className="text-xs text-slate-700">Processed in minutes, not hours</p>
            </div>

            <div className="flex flex-col items-center space-y-1.5">
              <div className="bg-white/80 p-2.5 rounded-full shadow-sm text-emerald-700">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h4 className="font-extrabold text-slate-900 text-sm sm:text-base">Secure Order Assistance</h4>
              <p className="text-xs text-slate-700">Protected, verification-first flows</p>
            </div>

            <div className="flex flex-col items-center space-y-1.5">
              <div className="bg-white/80 p-2.5 rounded-full shadow-sm text-emerald-700">
                <Truck className="h-6 w-6" />
              </div>
              <h4 className="font-extrabold text-slate-900 text-sm sm:text-base">Home Delivery Convenience</h4>
              <p className="text-xs text-slate-700">Straight to your kitchen table</p>
            </div>

          </div>
        </div>
      </section>

      {/* Benefit Cards Section */}
      <section className="py-16 md:py-24 container mx-auto px-4 max-w-6xl">
        <div className="text-center space-y-3 mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">Why Customers Love Our Service</h2>
          <p className="text-slate-500 max-w-xl mx-auto">We connect you directly to the best grocery deals with concierge delivery support.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          
          <Card className="hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border-slate-100 bg-white">
            <CardContent className="p-6 text-center space-y-4">
              <div className="bg-emerald-50 h-14 w-14 rounded-full flex items-center justify-center mx-auto text-emerald-600 font-bold text-2xl">
                🍏
              </div>
              <h3 className="font-extrabold text-lg text-slate-900">Fresh Fruits & Vegetables</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Hand-selected produce inspected for premium quality, freshness, and optimal flavor.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border-slate-100 bg-white">
            <CardContent className="p-6 text-center space-y-4">
              <div className="bg-emerald-50 h-14 w-14 rounded-full flex items-center justify-center mx-auto text-emerald-600 font-bold text-2xl">
                🥩
              </div>
              <h3 className="font-extrabold text-lg text-slate-900">Chicken, Seafood & Essentials</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Premium butchery cuts, fresh-catch seafood, and dairy essentials kept at peak cold temperatures.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border-slate-100 bg-white">
            <CardContent className="p-6 text-center space-y-4">
              <div className="bg-emerald-50 h-14 w-14 rounded-full flex items-center justify-center mx-auto text-emerald-600 font-bold text-2xl">
                ⚡
              </div>
              <h3 className="font-extrabold text-lg text-slate-900">Fast Home Delivery</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Express same-day shipping scheduling options tailored to match your busy work week.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border-slate-100 bg-white">
            <CardContent className="p-6 text-center space-y-4">
              <div className="bg-emerald-50 h-14 w-14 rounded-full flex items-center justify-center mx-auto text-emerald-600 font-bold text-2xl">
                💰
              </div>
              <h3 className="font-extrabold text-lg text-slate-900">Everyday Grocery Savings</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                We compare prices across multiple stores to guarantee you get the best discounts and coupon matchings.
              </p>
            </CardContent>
          </Card>

        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-emerald-900 text-white py-16 md:py-24 border-t border-emerald-950">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center space-y-3 mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold">How The Process Works</h2>
            <p className="text-emerald-100/70 max-w-md mx-auto">Get your grocery shopping done in four simple steps without ever leaving your home.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            
            <div className="text-center space-y-4 relative">
              <div className="bg-emerald-800 text-yellow-300 font-black h-12 w-12 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-700 text-lg shadow-md">
                1
              </div>
              <h3 className="font-bold text-lg text-white">Submit Request</h3>
              <p className="text-sm text-emerald-100/75">
                Fill out the quick request form with your basic contact info and your desired grocery list.
              </p>
            </div>

            <div className="text-center space-y-4 relative">
              <div className="bg-emerald-800 text-yellow-300 font-black h-12 w-12 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-700 text-lg shadow-md">
                2
              </div>
              <h3 className="font-bold text-lg text-white">Team Review</h3>
              <p className="text-sm text-emerald-100/75">
                Our support team reviews your store choices and item lists for availability and best discount matching.
              </p>
            </div>

            <div className="text-center space-y-4 relative">
              <div className="bg-emerald-800 text-yellow-300 font-black h-12 w-12 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-700 text-lg shadow-md">
                3
              </div>
              <h3 className="font-bold text-lg text-white">Customer Contacted</h3>
              <p className="text-sm text-emerald-100/75">
                A personal concierge agent reaches out via call or WhatsApp to confirm pricing, quantities, and schedule.
              </p>
            </div>

            <div className="text-center space-y-4 relative">
              <div className="bg-emerald-800 text-yellow-300 font-black h-12 w-12 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-700 text-lg shadow-md">
                4
              </div>
              <h3 className="font-bold text-lg text-white">Delivery Process</h3>
              <p className="text-sm text-emerald-100/75">
                We fulfill your list, bag your products carefully, and transport them directly to your home.
              </p>
            </div>

          </div>
          
          <div className="mt-16 text-center">
            <Button 
              size="lg" 
              className="bg-yellow-300 hover:bg-yellow-400 text-emerald-950 font-black px-8 py-6 rounded-full text-md shadow-lg"
              onClick={() => {
                document.getElementById("request-form")?.scrollIntoView({ behavior: "smooth" })
              }}
            >
              Get Started Now <ChevronRight className="ml-1 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="py-16 md:py-24 container mx-auto px-4 max-w-3xl">
        <h2 className="text-3xl font-extrabold text-slate-900 text-center mb-12">Frequently Asked Questions</h2>
        
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
            <h3 className="font-extrabold text-base sm:text-lg text-slate-900 mb-2">How do you save up to 35% on grocery bills?</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              We cross-check inventory, weekly flyers, and member-only bulk promotions across major outlets like Walmart, Target, and Costco to procure items at their lowest dynamic price point.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
            <h3 className="font-extrabold text-base sm:text-lg text-slate-900 mb-2">What happens after I submit my grocery list?</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              One of our personal shoppers reviews the list, checks availability, maps the cheapest routes, and contacts you via WhatsApp or phone to confirm final items and delivery timeline.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
            <h3 className="font-extrabold text-base sm:text-lg text-slate-900 mb-2">Is my payment secure?</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Yes. We do not store sensitive credit card info. All assistance bookings are processed via secure invoices and verification protocols for your complete safety.
            </p>
          </div>
        </div>
      </section>

      {/* Sticky Call & WhatsApp Mobile Conversion Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 p-3 flex gap-3 shadow-2xl md:hidden">
        <Button 
          variant="outline"
          className="flex-1 rounded-full py-6 font-bold border-2 border-slate-200 text-slate-800 text-sm flex items-center justify-center gap-1.5"
          asChild
        >
          <Link href={`tel:${CLEANED_PHONE}`}>
            <Phone className="h-4 w-4 text-emerald-600" />
            Call Now
          </Link>
        </Button>
        <Button 
          className="flex-1 rounded-full py-6 font-bold bg-emerald-600 hover:bg-emerald-700 text-white text-sm flex items-center justify-center gap-1.5"
          asChild
        >
          <Link href={`https://wa.me/${CLEANED_PHONE}?text=Hi,%20I%20want%20to%20submit%20a%20grocery%20order%20request.`} target="_blank">
            <MessageSquare className="h-4 w-4 fill-white text-emerald-600" />
            WhatsApp List
          </Link>
        </Button>
      </div>
    </div>
  )
}