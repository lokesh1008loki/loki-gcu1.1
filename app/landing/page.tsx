"use client"

import React, { useState, useMemo } from "react"
import Script from "next/script"
import { motion, AnimatePresence } from "framer-motion"
import { 
  ShoppingBag, 
  Ticket, 
  MapPin, 
  Calendar, 
  Users, 
  Clock, 
  Search, 
  Plus, 
  Minus, 
  Trash2, 
  Check, 
  ArrowRight, 
  Phone, 
  Mail, 
  User, 
  QrCode, 
  AlertCircle,
  Sparkles,
  PartyPopper
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Toaster } from "@/components/ui/sonner"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"

// Constants
const PRIMARY_PHONE = "+1 (210) 418-2745"
const CLEANED_PHONE = "12104182745"

const GROCERY_STORES = [
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

// Predefined grocery items list
const PREDEFINED_GROCERIES = [
  { id: "g1", name: "Organic Bananas", category: "Produce" },
  { id: "g2", name: "Fresh Strawberries (1 lb)", category: "Produce" },
  { id: "g3", name: "Whole Milk (1 Gallon)", category: "Dairy" },
  { id: "g4", name: "Grade A Large Eggs (Dozen)", category: "Dairy & Eggs" },
  { id: "g5", name: "Avocados (Bag of 4)", category: "Produce" },
  { id: "g6", name: "Fresh Spinach (5 oz)", category: "Produce" },
  { id: "g7", name: "Whole Wheat Bread", category: "Bakery" },
  { id: "g8", name: "Boneless Chicken Breast (1.5 lbs)", category: "Meat & Seafood" },
  { id: "g9", name: "Greek Yogurt (32 oz)", category: "Dairy" },
  { id: "g10", name: "Atlantic Salmon Fillet", category: "Meat & Seafood" },
  { id: "g11", name: "Organic Fuji Apples (1 lb)", category: "Produce" },
  { id: "g12", name: "Roma Tomatoes (1 lb)", category: "Produce" }
]

// Predefined parks list
const PARKS_LIST = [
  { id: "disneyland", name: "Disneyland Resort (California)" },
  { id: "disneyworld", name: "Walt Disney World (Florida)" },
  { id: "universal-hollywood", name: "Universal Studios Hollywood" },
  { id: "universal-orlando", name: "Universal Orlando Resort" },
  { id: "seaworld", name: "SeaWorld San Diego" },
  { id: "waterpark", name: "GoComfort Preferred Waterparks" },
  { id: "citypass", name: "USA City Pass Attractions" }
]

// Predefined delivery slots
const DELIVERY_SLOTS = [
  "ASAP (Within 2 Hours)",
  "Today: 4:00 PM - 6:00 PM",
  "Today: 7:00 PM - 9:00 PM",
  "Tomorrow: 9:00 AM - 11:00 AM",
  "Tomorrow: 2:00 PM - 4:00 PM",
  "Tomorrow: 6:00 PM - 8:00 PM"
]

// Predefined park slots
const PARK_SLOTS = [
  "Early Morning (8:00 AM - 12:00 PM)",
  "Mid-Day (12:00 PM - 4:00 PM)",
  "Evening Access (4:00 PM - Close)",
  "Full Day Admission"
]

interface SelectedGrocery {
  id: string
  name: string
  quantity: number
}

export default function MultiServiceLandingPage() {
  const [activeService, setActiveService] = useState<"grocery" | "ticket" | null>(null)
  
  // Grocery Form States
  const [groceryLocation, setGroceryLocation] = useState("")
  const [groceryZip, setGroceryZip] = useState("")
  const [preferredStore, setPreferredStore] = useState("")
  const [groceryRequest, setGroceryRequest] = useState("")
  const [deliverySlot, setDeliverySlot] = useState("")
  
  // Park Ticket Form States
  const [selectedPark, setSelectedPark] = useState("")
  const [visitDate, setVisitDate] = useState("")
  const [ticketSlot, setTicketSlot] = useState("")
  const [ticketCounts, setTicketCounts] = useState({
    adult: 1,
    child: 0,
    senior: 0
  })

  // Common Contact States
  const [contactName, setContactName] = useState("")
  const [contactPhone, setContactPhone] = useState("")
  const [contactEmail, setContactEmail] = useState("")

  // Phone number auto-formatter to (XXX) XXX-XXXX
  const formatPhoneNumber = (value: string) => {
    const clean = value.replace(/\D/g, "")
    if (clean.length === 0) return ""
    if (clean.length <= 3) return clean
    if (clean.length <= 6) return `(${clean.slice(0, 3)}) ${clean.slice(3)}`
    return `(${clean.slice(0, 3)}) ${clean.slice(3, 6)}-${clean.slice(6, 10)}`
  }

  // Handle phone changes and apply formatting
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = e.target.value.replace(/\D/g, "").slice(0, 10)
    const formatted = formatPhoneNumber(cleaned)
    setContactPhone(formatted)
  }

  // Form Validation Errors
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  // Success Receipt Modal State
  const [showReceipt, setShowReceipt] = useState(false)
  const [receiptData, setReceiptData] = useState<any>(null)



  // Adjust ticket counts
  const updateTicketCount = (type: "adult" | "child" | "senior", delta: number) => {
    setTicketCounts(prev => {
      const current = prev[type]
      const min = type === "adult" ? 1 : 0 // at least 1 adult required if tickets booked
      const next = Math.max(min, current + delta)
      return { ...prev, [type]: next }
    })
  }

  // Validation Logic
  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    // Contact Info Validation
    if (!contactName.trim()) {
      newErrors.contactName = "Full name is required"
    } else if (contactName.trim().length < 2) {
      newErrors.contactName = "Name must be at least 2 characters"
    }

    if (!contactPhone.trim()) {
      newErrors.contactPhone = "Phone number is required"
    } else {
      const cleanPhone = contactPhone.replace(/\D/g, "")
      if (cleanPhone.length !== 10) {
        newErrors.contactPhone = "Please enter a valid 10-digit phone number"
      }
    }

    if (!contactEmail.trim()) {
      newErrors.contactEmail = "Email address is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) {
      newErrors.contactEmail = "Please enter a valid email address"
    }

    if (activeService === "grocery") {
      if (!groceryLocation.trim()) {
        newErrors.groceryLocation = "Delivery address is required"
      }
      if (!groceryZip.trim()) {
        newErrors.groceryZip = "ZIP code is required"
      } else if (!/^\d{5}$/.test(groceryZip)) {
        newErrors.groceryZip = "ZIP code must be exactly 5 digits"
      }
      if (!preferredStore) {
        newErrors.preferredStore = "Please select a preferred store"
      }
      if (!groceryRequest.trim()) {
        newErrors.groceryRequest = "Please enter your grocery list or request"
      }
      if (!deliverySlot) {
        newErrors.deliverySlot = "Please select a delivery time slot"
      }
    } else if (activeService === "ticket") {
      if (!selectedPark) {
        newErrors.selectedPark = "Please select a theme park"
      }
      if (!visitDate) {
        newErrors.visitDate = "Please choose a date for your visit"
      } else {
        const selectedDate = new Date(visitDate)
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        if (selectedDate < today) {
          newErrors.visitDate = "Visit date cannot be in the past"
        }
      }
      const totalTickets = ticketCounts.adult + ticketCounts.child + ticketCounts.senior
      if (totalTickets === 0) {
        newErrors.ticketCounts = "Please select at least 1 ticket"
      }
      if (!ticketSlot) {
        newErrors.ticketSlot = "Please select a time slot for your park entry"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast.error("Please correct the errors in the form before proceeding.")
      return
    }

    // Generate custom receipt details
    const orderId = `GCU-${Math.floor(10000000 + Math.random() * 90000000)}`
    const timestamp = new Date().toLocaleString()

    let summary = {}
    if (activeService === "grocery") {
      const cleanPhone = contactPhone.replace(/\D/g, "")

      // Direct POST payload to Google Sheets Apps Script endpoint (matches /others/food-grocery schema)
      const payload = {
        fullName: contactName,
        phone: cleanPhone,
        email: contactEmail,
        address: groceryLocation,
        zipCode: groceryZip,
        preferredStore: preferredStore,
        deliverySlot: deliverySlot,
        groceryRequest: groceryRequest,
        formId: "grocery-delivery",
        timestamp: new Date().toISOString()
      }

      const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbxg56QJu-tLKmO2lQ-PrxJMgK8SVb_HSR0K5Tc1GPUgN8zPgz6K5U-S0Q85QiwulynWNg/exec"

      const submitPromise = fetch(GOOGLE_SHEET_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        mode: "no-cors"
      })

      toast.promise(submitPromise, {
        loading: 'Submitting grocery request to database...',
        success: 'Request successfully logged to database!',
        error: 'Network submission error. Please try again.',
      })

      summary = {
        type: "Grocery Delivery",
        orderId,
        timestamp,
        customerName: contactName,
        phone: contactPhone,
        email: contactEmail,
        location: `${groceryLocation}, ZIP: ${groceryZip}`,
        preferredStore: GROCERY_STORES.find(s => s.id === preferredStore)?.name || preferredStore,
        items: groceryRequest,
        slot: deliverySlot
      }
    } else {
      const cleanPhone = contactPhone.replace(/\D/g, "")
      const names = contactName.trim().split(/\s+/)
      const firstName = names[0] || ""
      const lastName = names.slice(1).join(" ") || ""
      const parkName = PARKS_LIST.find(p => p.id === selectedPark)?.name || selectedPark

      const payload = {
        firstName,
        lastName,
        phone: cleanPhone,
        contactInfo: contactEmail,
        parkLink: parkName,
        visitDate,
        entryTime: ticketSlot,
        adultCount: ticketCounts.adult,
        childCount: ticketCounts.child,
        seniorCount: ticketCounts.senior,
        addOns: [],
        specialRequests: "Submitted via Landing Page Ticket Form.",
        status: "Pending"
      }

      const GOOGLE_SHEET_TICKET_URL = "https://script.google.com/macros/s/AKfycbzkuhLxsgG77Keem-7nNR3lIdVErDIBte0_PhojuR55__Aoudk1MhV24kS-BNC1mEry/exec"

      const submitPromise = fetch(GOOGLE_SHEET_TICKET_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        mode: "no-cors"
      })

      toast.promise(submitPromise, {
        loading: 'Submitting ticket booking request to database...',
        success: 'Booking request successfully logged to database!',
        error: 'Network submission error. Please try again.',
      })

      summary = {
        type: "Park Ticket Booking",
        orderId,
        timestamp,
        customerName: contactName,
        phone: contactPhone,
        email: contactEmail,
        park: parkName,
        date: visitDate,
        tickets: ticketCounts,
        slot: ticketSlot
      }
    }

    setReceiptData(summary)
    setShowReceipt(true)
    toast.success("Request processed successfully! Generating invoice...")
  }

  // Generate WhatsApp Share Link
  const getWhatsAppLink = () => {
    if (!receiptData) return ""
    let messageText = `Hi GoComfortUSA! I'd like to confirm my ${receiptData.type} request.\n\n`
    messageText += `*Order ID:* ${receiptData.orderId}\n`
    messageText += `*Name:* ${receiptData.customerName}\n`
    messageText += `*Phone:* ${receiptData.phone}\n`
    messageText += `*Email:* ${receiptData.email}\n`

    if (activeService === "grocery") {
      messageText += `*Delivery Location:* ${receiptData.location}\n`
      messageText += `*Delivery Slot:* ${receiptData.slot}\n`
      messageText += `*Items List:*\n${receiptData.items}\n`
    } else {
      messageText += `*Park:* ${receiptData.park}\n`
      messageText += `*Date of Visit:* ${receiptData.date}\n`
      messageText += `*Entry Slot:* ${receiptData.slot}\n`
      messageText += `*Tickets Summary:*\n`
      messageText += `  - Adults: ${receiptData.tickets.adult}\n`
      messageText += `  - Children: ${receiptData.tickets.child}\n`
      messageText += `  - Seniors: ${receiptData.tickets.senior}\n`
    }

    return `https://wa.me/${CLEANED_PHONE}?text=${encodeURIComponent(messageText)}`
  }

  // Reset page form
  const handleReset = () => {
    setGroceryLocation("")
    setGroceryZip("")
    setPreferredStore("")
    setGroceryRequest("")
    setDeliverySlot("")
    setSelectedPark("")
    setVisitDate("")
    setTicketSlot("")
    setTicketCounts({ adult: 1, child: 0, senior: 0 })
    setContactName("")
    setContactPhone("")
    setContactEmail("")
    setErrors({})
    setShowReceipt(false)
    setReceiptData(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 text-slate-800 dark:text-slate-200 pb-12 relative overflow-hidden">
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=AW-18186338290"
        strategy="afterInteractive"
      />
      <Script id="google-tag-landing" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'AW-18186338290');
        `}
      </Script>
      <Script id="roku-pixel-landing" strategy="afterInteractive">
        {`
          !function(e,r){if(!e.rkp){var t=e.rkp=function(){
          var e=Array.prototype.slice.call(arguments)
          ;e.push(Date.now()),t.eventProcessor?t.eventProcessor.apply(t,e):t.queue.push(e)
          };t.initiatorVersion="1.0",t.queue=[],t.load=function(e){
          var t=r.createElement("script");t.async=!0,t.src=e
          ;var n=r.getElementsByTagName("script")[0]
          ;(n?n.parentNode:r.body).insertBefore(t,n)},rkp.load("https://cdn.ravm.tv/ust/dist/rkp.loader.js")}
          }(window,document);
          rkp("init","PaccB3hDqEZS"),rkp('event', 'PAGE_VIEW');
        `}
      </Script>
      <Toaster position="top-center" richColors />

      {/* Top Promotional Bar */}
      <div className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-blue-600 text-white py-3 px-4 text-center text-xs sm:text-sm font-extrabold tracking-wide shadow-md relative z-20 whitespace-normal break-words leading-tight">
        ✨ Get <span className="text-yellow-350 font-black">35% OFF</span> on all services – Lower Than Market Price Guarantee!
      </div>

      {/* Decorative Blur Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-10 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute top-40 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto space-y-12 relative z-10 py-12 px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <section className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center justify-center gap-2 px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-bold bg-yellow-100 dark:bg-yellow-950/30 text-yellow-800 dark:text-yellow-455 border border-yellow-200 dark:border-yellow-900 shadow-md animate-pulse max-w-full flex-wrap text-center">
            <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-yellow-600 dark:text-yellow-400 shrink-0 animate-spin" style={{ animationDuration: "3s" }} />
            <span>35% OFF All Services &bull; Lower Than Market Price Guarantee</span>
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
            What do you need <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">today?</span>
          </h1>
          <p className="text-sm sm:text-lg text-slate-600 dark:text-slate-400">
            Select one of our premium concierge services below. We shop your groceries or coordinate theme park admissions for you with zero hassle.
          </p>
        </section>

        {/* Service Toggle Cards */}
        <section className="grid grid-cols-2 gap-4 sm:gap-6 max-w-3xl mx-auto">
          
          {/* Grocery Card */}
          <button
            type="button"
            onClick={() => {
              setActiveService("grocery")
              setErrors({})
            }}
            className={`group text-left p-4 sm:p-8 rounded-3xl border-2 transition-all duration-500 relative overflow-hidden bg-white dark:bg-slate-900 shadow-md hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between h-44 sm:h-56 ${
              activeService === "grocery" 
                ? "border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/10 dark:bg-emerald-950/10" 
                : "border-slate-100 dark:border-slate-800 hover:border-emerald-300"
            }`}
          >
            <div className={`absolute top-0 right-0 w-16 h-16 sm:w-24 sm:h-24 rounded-bl-full bg-emerald-500/10 transition-transform duration-500 ${
              activeService === "grocery" ? "scale-110" : "group-hover:scale-105"
            }`} />
            
            <div className="flex items-start justify-between">
              <div className={`h-10 w-10 sm:h-14 sm:w-14 rounded-xl sm:rounded-2xl flex items-center justify-center transition-colors duration-300 ${
                activeService === "grocery" 
                  ? "bg-emerald-500 text-white" 
                  : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white"
              }`}>
                <ShoppingBag className="h-5 w-5 sm:h-7 sm:w-7 animate-bounce" style={{ animationDuration: "3s" }} />
              </div>
              
              {activeService === "grocery" && (
                <span className="bg-emerald-500 text-white p-1 rounded-full shadow-sm text-xs">
                  <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4 stroke-[3]" />
                </span>
              )}
            </div>

            <div className="space-y-1 sm:space-y-2 mt-2 sm:mt-4 relative z-10">
              <h2 className="text-sm sm:text-2xl font-bold text-slate-900 dark:text-white">Grocery Delivery</h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
                Order fresh foods, pantry essentials, and household goods from local stores delivered directly.
              </p>
            </div>
          </button>

          {/* Ticket Card */}
          <button
            type="button"
            onClick={() => {
              setActiveService("ticket")
              setErrors({})
            }}
            className={`group text-left p-4 sm:p-8 rounded-3xl border-2 transition-all duration-500 relative overflow-hidden bg-white dark:bg-slate-900 shadow-md hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between h-44 sm:h-56 ${
              activeService === "ticket" 
                ? "border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/10 dark:bg-blue-950/10" 
                : "border-slate-100 dark:border-slate-800 hover:border-blue-300"
            }`}
          >
            <div className={`absolute top-0 right-0 w-16 h-16 sm:w-24 sm:h-24 rounded-bl-full bg-blue-500/10 transition-transform duration-500 ${
              activeService === "ticket" ? "scale-110" : "group-hover:scale-105"
            }`} />

            <div className="flex items-start justify-between">
              <div className={`h-10 w-10 sm:h-14 sm:w-14 rounded-xl sm:rounded-2xl flex items-center justify-center transition-colors duration-300 ${
                activeService === "ticket" 
                  ? "bg-blue-500 text-white" 
                  : "bg-blue-500/10 text-blue-600 dark:text-blue-400 group-hover:bg-blue-500 group-hover:text-white"
              }`}>
                <Ticket className="h-5 w-5 sm:h-7 sm:w-7 rotate-12 group-hover:rotate-0 transition-transform" />
              </div>

              {activeService === "ticket" && (
                <span className="bg-blue-500 text-white p-1 rounded-full shadow-sm text-xs">
                  <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4 stroke-[3]" />
                </span>
              )}
            </div>

            <div className="space-y-1 sm:space-y-2 mt-2 sm:mt-4 relative z-10">
              <h2 className="text-sm sm:text-2xl font-bold text-slate-900 dark:text-white">Park Tickets</h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
                Book entry admissions to major USA theme parks, water parks, and city pass experiences.
              </p>
            </div>
          </button>

        </section>

        {/* Dynamic Forms Container */}
        <section className="max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            {activeService === "grocery" && (
              <motion.div
                key="grocery-form"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.4 }}
              >
                <Card className="rounded-3xl border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden">
                  <div className="h-2 bg-gradient-to-r from-emerald-400 to-emerald-600" />
                  <CardContent className="p-4 sm:p-10 space-y-6 sm:space-y-8">
                    
                    {/* Header */}
                    <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-850">
                      <ShoppingBag className="h-6 w-6 text-emerald-500" />
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Quick Grocery Request Form</h3>
                        <p className="text-sm text-slate-550">Provide details for your fresh concierge shopping list</p>
                      </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      
                      {/* Name */}
                      <div className="space-y-1.5">
                        <Label htmlFor="contactName" className="text-sm font-semibold">Full Name <span className="text-red-500">*</span></Label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                          <Input
                            id="contactName"
                            placeholder="First and last name"
                            value={contactName}
                            onChange={(e) => setContactName(e.target.value)}
                            required
                            className="pl-9 text-base sm:text-sm"
                          />
                        </div>
                        {errors.contactName && (
                          <p className="text-rose-500 text-xs font-medium mt-1">{errors.contactName}</p>
                        )}
                      </div>

                      {/* Phone */}
                      <div className="space-y-1.5">
                        <Label htmlFor="contactPhone" className="text-sm font-semibold">Phone Number <span className="text-red-500">*</span></Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                          <Input
                            id="contactPhone"
                            type="tel"
                            placeholder="Enter 10-digit phone number"
                            value={contactPhone}
                            onChange={handlePhoneChange}
                            required
                            maxLength={14}
                            className="pl-9 text-base sm:text-sm"
                          />
                        </div>
                        {errors.contactPhone && (
                          <p className="text-rose-500 text-xs font-medium mt-1">{errors.contactPhone}</p>
                        )}
                      </div>

                      {/* Email */}
                      <div className="space-y-1.5">
                        <Label htmlFor="contactEmail" className="text-sm font-semibold">Email Address <span className="text-red-500">*</span></Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                          <Input
                            id="contactEmail"
                            type="email"
                            placeholder="your.email@example.com"
                            value={contactEmail}
                            onChange={(e) => setContactEmail(e.target.value)}
                            required
                            className="pl-9 text-base sm:text-sm"
                          />
                        </div>
                        {errors.contactEmail && (
                          <p className="text-rose-500 text-xs font-medium mt-1">{errors.contactEmail}</p>
                        )}
                      </div>

                      {/* Address */}
                      <div className="space-y-1.5">
                        <Label htmlFor="groceryLocation" className="text-sm font-semibold">Delivery Address <span className="text-red-500">*</span></Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                          <Input
                            id="groceryLocation"
                            placeholder="Street address, City, State"
                            value={groceryLocation}
                            onChange={(e) => setGroceryLocation(e.target.value)}
                            required
                            className="pl-9 text-base sm:text-sm"
                          />
                        </div>
                        {errors.groceryLocation && (
                          <p className="text-rose-500 text-xs font-medium mt-1">{errors.groceryLocation}</p>
                        )}
                      </div>

                      {/* ZIP and Store Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* ZIP code */}
                        <div className="space-y-1.5">
                          <Label htmlFor="groceryZip" className="text-sm font-semibold">ZIP Code <span className="text-red-500">*</span></Label>
                          <Input
                            id="groceryZip"
                            placeholder="e.g. 90210"
                            value={groceryZip}
                            onChange={(e) => setGroceryZip(e.target.value.replace(/\D/g, ""))}
                            required
                            maxLength={5}
                            className="text-base sm:text-sm"
                          />
                          {errors.groceryZip && (
                            <p className="text-rose-500 text-xs font-medium mt-1">{errors.groceryZip}</p>
                          )}
                        </div>

                        {/* Preferred Store */}
                        <div className="space-y-1.5">
                          <Label htmlFor="preferredStore" className="text-sm font-semibold">Preferred Store <span className="text-red-500">*</span></Label>
                          <select
                            id="preferredStore"
                            value={preferredStore}
                            onChange={(e) => setPreferredStore(e.target.value)}
                            required
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base sm:text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          >
                            <option value="">Select store</option>
                            {GROCERY_STORES.map(store => (
                              <option key={store.id} value={store.id}>
                                {store.name}
                              </option>
                            ))}
                          </select>
                          {errors.preferredStore && (
                            <p className="text-rose-500 text-xs font-medium mt-1">{errors.preferredStore}</p>
                          )}
                        </div>
                      </div>

                      {/* Delivery Time Selection */}
                      <div className="space-y-3 pt-2">
                        <Label className="text-sm font-semibold flex items-center gap-1.5">
                          <Clock className="h-4 w-4 text-emerald-500" />
                          Delivery Time Selection <span className="text-rose-500">*</span>
                        </Label>
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
                          {DELIVERY_SLOTS.map((slot) => (
                            <button
                              key={slot}
                              type="button"
                              onClick={() => setDeliverySlot(slot)}
                              className={`p-3 rounded-2xl text-xs font-bold text-center border-2 transition-all duration-300 ${
                                deliverySlot === slot
                                  ? "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                                  : "border-slate-100 dark:border-slate-800 hover:border-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800"
                              }`}
                            >
                              {slot}
                            </button>
                          ))}
                        </div>
                        {errors.deliverySlot && (
                          <p className="text-rose-500 text-xs flex items-center gap-1 font-medium mt-1">
                            <AlertCircle className="h-3 w-3" /> {errors.deliverySlot}
                          </p>
                        )}
                      </div>

                      {/* Grocery Request Textarea */}
                      <div className="space-y-1.5 pt-2">
                        <Label htmlFor="groceryRequest" className="text-sm font-semibold">Grocery Request / List <span className="text-red-500">*</span></Label>
                        <Textarea
                          id="groceryRequest"
                          placeholder="List items, brand preferences, and quantities. E.g.&#10;- 2 Gallons of Whole Milk (Organic)&#10;- 3 lbs Fresh Bananas&#10;- 1 Loaf of Wheat Bread"
                          value={groceryRequest}
                          onChange={(e) => setGroceryRequest(e.target.value)}
                          required
                          className="min-h-[120px] text-base sm:text-sm"
                        />
                        {errors.groceryRequest && (
                          <p className="text-rose-500 text-xs font-medium mt-1">{errors.groceryRequest}</p>
                        )}
                      </div>

                      {/* Submit Button */}
                      <Button 
                        type="submit" 
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-6 rounded-lg text-lg shadow-md transition-all mt-4"
                      >
                        Submit Grocery Request
                      </Button>
                      
                      <p className="text-[10px] text-center text-slate-400">
                        *By submitting, you agree to receive follow-up support calls/messages. We protect your privacy.
                      </p>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeService === "ticket" && (
              <motion.div
                key="ticket-form"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.4 }}
              >
                <Card className="rounded-3xl border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden">
                  <div className="h-2 bg-gradient-to-r from-blue-400 to-blue-600" />
                  <CardContent className="p-4 sm:p-10 space-y-6 sm:space-y-8">

                    {/* Header */}
                    <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-855">
                      <Ticket className="h-6 w-6 text-blue-500" />
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Park Ticket Booking Form</h3>
                        <p className="text-sm text-slate-550">Provide details for your USA theme park bookings</p>
                      </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">

                      {/* Park Dropdown */}
                      <div className="space-y-2">
                        <Label htmlFor="selectedPark" className="text-sm font-semibold flex items-center gap-1.5">
                          <Ticket className="h-4 w-4 text-blue-500" />
                          Select Theme Park <span className="text-rose-500">*</span>
                        </Label>
                        <select
                          id="selectedPark"
                          value={selectedPark}
                          onChange={(e) => setSelectedPark(e.target.value)}
                          className={`flex h-12 w-full rounded-2xl border-2 border-slate-200 dark:border-slate-750 bg-background px-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                            errors.selectedPark ? "border-rose-500" : ""
                          }`}
                        >
                          <option value="">Choose a park...</option>
                          {PARKS_LIST.map((park) => (
                            <option key={park.id} value={park.id}>
                              {park.name}
                            </option>
                          ))}
                        </select>
                        {errors.selectedPark && (
                          <p className="text-rose-500 text-xs flex items-center gap-1 font-medium mt-1">
                            <AlertCircle className="h-3 w-3" /> {errors.selectedPark}
                          </p>
                        )}
                      </div>

                      {/* Date Picker */}
                      <div className="space-y-2">
                        <Label htmlFor="visitDate" className="text-sm font-semibold flex items-center gap-1.5">
                          <Calendar className="h-4 w-4 text-blue-500" />
                          Date of Visit <span className="text-rose-500">*</span>
                        </Label>
                        <Input
                          id="visitDate"
                          type="date"
                          min={new Date().toISOString().split("T")[0]}
                          value={visitDate}
                          onChange={(e) => setVisitDate(e.target.value)}
                          className={errors.visitDate ? "border-rose-500 focus-visible:ring-rose-500" : ""}
                        />
                        {errors.visitDate && (
                          <p className="text-rose-500 text-xs flex items-center gap-1 font-medium mt-1">
                            <AlertCircle className="h-3 w-3" /> {errors.visitDate}
                          </p>
                        )}
                      </div>

                      {/* Number of tickets */}
                      <div className="space-y-3">
                        <Label className="text-sm font-semibold flex items-center gap-1.5">
                          <Users className="h-4 w-4 text-blue-500" />
                          Number of Tickets <span className="text-rose-500">*</span>
                        </Label>

                        <div className="space-y-3 border border-slate-100 dark:border-slate-800 p-3 sm:p-4 bg-slate-50/50 dark:bg-slate-900/50 rounded-2xl">
                          {/* Adults */}
                          <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm">
                            <div className="text-left">
                              <span className="text-sm font-bold text-slate-850 dark:text-slate-150 block">Adults</span>
                              <span className="text-[11px] text-slate-400 block font-medium">Ages 10+</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 rounded-xl shrink-0"
                                onClick={() => updateTicketCount("adult", -1)}
                              >
                                <Minus className="h-3.5 w-3.5" />
                              </Button>
                              <span className="font-extrabold w-6 text-center text-sm">{ticketCounts.adult}</span>
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 rounded-xl shrink-0"
                                onClick={() => updateTicketCount("adult", 1)}
                              >
                                <Plus className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </div>

                          {/* Children */}
                          <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm">
                            <div className="text-left">
                              <span className="text-sm font-bold text-slate-850 dark:text-slate-150 block">Children</span>
                              <span className="text-[11px] text-slate-400 block font-medium">Ages 3-9</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 rounded-xl shrink-0"
                                onClick={() => updateTicketCount("child", -1)}
                              >
                                <Minus className="h-3.5 w-3.5" />
                              </Button>
                              <span className="font-extrabold w-6 text-center text-sm">{ticketCounts.child}</span>
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 rounded-xl shrink-0"
                                onClick={() => updateTicketCount("child", 1)}
                              >
                                <Plus className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </div>

                          {/* Seniors */}
                          <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm">
                            <div className="text-left">
                              <span className="text-sm font-bold text-slate-850 dark:text-slate-150 block">Seniors</span>
                              <span className="text-[11px] text-slate-400 block font-medium">Ages 65+</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 rounded-xl shrink-0"
                                onClick={() => updateTicketCount("senior", -1)}
                              >
                                <Minus className="h-3.5 w-3.5" />
                              </Button>
                              <span className="font-extrabold w-6 text-center text-sm">{ticketCounts.senior}</span>
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 rounded-xl shrink-0"
                                onClick={() => updateTicketCount("senior", 1)}
                              >
                                <Plus className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </div>
                        </div>
                        {errors.ticketCounts && (
                          <p className="text-rose-500 text-xs flex items-center gap-1 font-medium">
                            <AlertCircle className="h-3 w-3" /> {errors.ticketCounts}
                          </p>
                        )}
                      </div>

                      {/* Time Slot Selection */}
                      <div className="space-y-3">
                        <Label className="text-sm font-semibold flex items-center gap-1.5">
                          <Clock className="h-4 w-4 text-blue-500" />
                          Time Slot Selection <span className="text-rose-500">*</span>
                        </Label>

                        <div className="grid grid-cols-2 gap-2 sm:gap-3">
                          {PARK_SLOTS.map((slot) => (
                            <button
                              key={slot}
                              type="button"
                              onClick={() => setTicketSlot(slot)}
                              className={`p-3 rounded-2xl text-xs font-bold text-center border-2 transition-all duration-300 ${
                                ticketSlot === slot
                                  ? "border-blue-500 bg-blue-500/10 text-blue-700 dark:text-blue-400"
                                  : "border-slate-100 dark:border-slate-800 hover:border-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800"
                              }`}
                            >
                              {slot}
                            </button>
                          ))}
                        </div>
                        {errors.ticketSlot && (
                          <p className="text-rose-500 text-xs flex items-center gap-1 font-medium mt-1">
                            <AlertCircle className="h-3 w-3" /> {errors.ticketSlot}
                          </p>
                        )}
                      </div>

                      {/* Shared Contact Section */}
                      <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <User className="h-4 w-4 text-blue-500" />
                          Contact Information
                        </h4>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          {/* Name */}
                          <div className="space-y-1.5">
                            <Label htmlFor="ticketName" className="text-xs font-bold text-slate-500">
                              Full Name *
                            </Label>
                            <Input
                              id="ticketName"
                              placeholder="John Doe"
                              value={contactName}
                              onChange={(e) => setContactName(e.target.value)}
                              className={errors.contactName ? "border-rose-500" : ""}
                            />
                            {errors.contactName && (
                              <p className="text-rose-500 text-[10px] font-medium">{errors.contactName}</p>
                            )}
                          </div>

                          {/* Phone */}
                          <div className="space-y-1.5">
                            <Label htmlFor="ticketPhone" className="text-xs font-bold text-slate-500">
                              Phone Number *
                            </Label>
                            <Input
                              id="ticketPhone"
                              placeholder="(123) 456-7890"
                              value={contactPhone}
                              onChange={handlePhoneChange}
                              className={errors.contactPhone ? "border-rose-500" : ""}
                            />
                            {errors.contactPhone && (
                              <p className="text-rose-500 text-[10px] font-medium">{errors.contactPhone}</p>
                            )}
                          </div>

                          {/* Email */}
                          <div className="space-y-1.5">
                            <Label htmlFor="ticketEmail" className="text-xs font-bold text-slate-500">
                              Email Address *
                            </Label>
                            <Input
                              id="ticketEmail"
                              type="email"
                              placeholder="john@example.com"
                              value={contactEmail}
                              onChange={(e) => setContactEmail(e.target.value)}
                              className={errors.contactEmail ? "border-rose-500" : ""}
                            />
                            {errors.contactEmail && (
                              <p className="text-rose-500 text-[10px] font-medium">{errors.contactEmail}</p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Submit Button */}
                      <Button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-6 rounded-2xl text-lg shadow-lg hover:shadow-blue-500/20 transition-all flex items-center justify-center gap-2 mt-4"
                      >
                        <span>Book Tickets Now</span>
                        <ArrowRight className="h-5 w-5" />
                      </Button>

                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Empty selection placeholder state */}
            {!activeService && (
              <motion.div
                key="empty-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-16 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-white/40 dark:bg-slate-900/20 p-8"
              >
                <div className="h-16 w-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                  <Sparkles className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-700 dark:text-slate-350">No service selected</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-sm mx-auto">
                  Click on either Grocery Delivery or Park Tickets cards above to load the interactive custom forms.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

      </div>

      {/* Success Receipt Modal */}
      <AnimatePresence>
        {showReceipt && receiptData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowReceipt(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            
            {/* Receipt Content Container */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl z-10 border border-slate-100 dark:border-slate-800"
            >
              
              {/* Receipt Top Graphic Banner */}
              <div className={`p-6 text-center text-white ${
                activeService === "grocery" 
                  ? "bg-gradient-to-r from-emerald-500 to-green-600" 
                  : "bg-gradient-to-r from-blue-500 to-indigo-600"
              }`}>
                <div className="h-12 w-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <PartyPopper className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-extrabold tracking-wide">Request Pre-Generated</h3>
                <p className="text-xs text-white/80 mt-1">Pending Concierge Activation</p>
              </div>

              {/* Receipt Body */}
              <div className="p-6 space-y-6 text-sm text-slate-600 dark:text-slate-350">
                
                {/* Meta details */}
                <div className="flex justify-between items-center text-xs border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div>
                    <p className="font-bold text-slate-450 uppercase">Order ID</p>
                    <p className="text-slate-850 dark:text-slate-150 font-mono font-extrabold text-sm">{receiptData.orderId}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-450 uppercase">Timestamp</p>
                    <p className="text-slate-800 dark:text-slate-200 font-medium">{receiptData.timestamp.split(",")[0]}</p>
                  </div>
                </div>

                {/* Main Summary */}
                <div className="space-y-4">
                  <div className="bg-slate-50 dark:bg-slate-850 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-3">
                    <h4 className="font-black text-slate-900 dark:text-white uppercase text-xs tracking-wider">
                      {receiptData.type} Details
                    </h4>

                    {/* Conditional breakdown */}
                    {activeService === "grocery" ? (
                      <div className="space-y-2 text-xs">
                        <p><strong className="text-slate-700 dark:text-slate-300">Deliver To:</strong> {receiptData.location}</p>
                        <p><strong className="text-slate-700 dark:text-slate-300">Preferred Store:</strong> {receiptData.preferredStore}</p>
                        <p><strong className="text-slate-700 dark:text-slate-300">Target Time:</strong> {receiptData.slot}</p>
                        <div className="border-t border-slate-200 dark:border-slate-700 pt-2 mt-2">
                          <p className="font-bold text-slate-700 dark:text-slate-300 mb-1">Requested List:</p>
                          <p className="text-slate-550 dark:text-slate-400 whitespace-pre-wrap font-mono text-[11px] leading-relaxed bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                            {receiptData.items}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2 text-xs">
                        <p><strong className="text-slate-700 dark:text-slate-300">Theme Park:</strong> {receiptData.park}</p>
                        <p><strong className="text-slate-700 dark:text-slate-300">Date of Visit:</strong> {receiptData.date}</p>
                        <p><strong className="text-slate-700 dark:text-slate-300">Access Period:</strong> {receiptData.slot}</p>
                        <div className="border-t border-slate-200 dark:border-slate-700 pt-2 mt-2 flex justify-between">
                          <span className="font-bold text-slate-700 dark:text-slate-300">Ticket Breakdown:</span>
                          <span className="font-mono font-bold text-slate-800 dark:text-slate-250">
                            {receiptData.tickets.adult > 0 && `Ad:${receiptData.tickets.adult} `}
                            {receiptData.tickets.child > 0 && `Ch:${receiptData.tickets.child} `}
                            {receiptData.tickets.senior > 0 && `Sr:${receiptData.tickets.senior}`}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Customer Info */}
                  <div className="text-xs space-y-1.5 px-2">
                    <p><strong className="text-slate-450 uppercase">Recipient:</strong> {receiptData.customerName}</p>
                    <p><strong className="text-slate-450 uppercase">Phone contact:</strong> {receiptData.phone}</p>
                    <p><strong className="text-slate-450 uppercase">Email invoice:</strong> {receiptData.email}</p>
                  </div>
                </div>

                {/* Decorative Dotted Divider line */}
                <div className="relative py-2">
                  <div className="border-t-2 border-dashed border-slate-250 dark:border-slate-700 w-full" />
                  <div className="absolute -left-8 -top-0.5 h-5 w-5 rounded-full bg-slate-50 dark:bg-slate-950 border-r border-slate-100 dark:border-slate-800" />
                  <div className="absolute -right-8 -top-0.5 h-5 w-5 rounded-full bg-slate-50 dark:bg-slate-950 border-l border-slate-100 dark:border-slate-800" />
                </div>

                {/* QR Code Graphic for Premium Vibe */}
                <div className="flex flex-col items-center justify-center space-y-2 py-2">
                  <QrCode className="h-16 w-16 text-slate-800 dark:text-slate-250 opacity-90 stroke-[1.5]" />
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Scan or Save Invoice Receipt</span>
                </div>

              </div>

              {/* Receipt Footer Actions */}
              <div className="bg-slate-50 dark:bg-slate-850 p-4 border-t border-slate-150 dark:border-slate-800 flex flex-col sm:flex-row gap-3">
                <Button
                  variant="outline"
                  onClick={handleReset}
                  className="flex-1 rounded-2xl py-5 border-slate-200 dark:border-slate-700 text-xs font-bold"
                >
                  Book Another
                </Button>
                
                <Button
                  className={`flex-1 rounded-2xl py-5 text-xs font-extrabold flex items-center justify-center gap-1.5 text-white ${
                    activeService === "grocery"
                      ? "bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-600/20"
                      : "bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20"
                  }`}
                  asChild
                >
                  <a href={getWhatsAppLink()} target="_blank" rel="noopener noreferrer">
                    <Phone className="h-4 w-4 fill-white stroke-none" />
                    Confirm on WhatsApp
                  </a>
                </Button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  )
}
