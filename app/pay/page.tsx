"use client"

import { useState, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { 
  ShieldCheck, 
  Lock, 
  ArrowLeft, 
  Check, 
  CreditCard, 
  FileText, 
  HelpCircle,
  Sparkles
} from "lucide-react"
import { toast } from "sonner"
import { Suspense } from "react"

function PayContent() {
  const searchParams = useSearchParams()
  const paramAmount = searchParams.get("amount")
  const paramService = searchParams.get("service")
  const paramOrderId = searchParams.get("order_id")

  // Check if an official order reference was passed
  const hasInvoice = Boolean(paramOrderId)
  const defaultMode = hasInvoice || (paramAmount && paramAmount !== "29.99") ? "custom" : "consultation"

  const [serviceType, setServiceType] = useState<"consultation" | "custom">(defaultMode)
  const [customAmount, setCustomAmount] = useState<string>(paramAmount || "50.00")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [orderId, setOrderId] = useState(paramOrderId || "")
  const [isProcessing, setIsProcessing] = useState(false)

  // Current payable amount
  const activeAmount = useMemo(() => {
    if (serviceType === "consultation") {
      return "29.99"
    }
    return customAmount || "0.00"
  }, [serviceType, customAmount])

  const formattedTotal = parseFloat(activeAmount || "0").toFixed(2)

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()

    const parsedAmount = parseFloat(activeAmount)
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      toast.error("Please enter a valid payment amount")
      return
    }

    if (!email.trim() || !email.includes("@")) {
      toast.error("Please enter a valid email address")
      return
    }

    if (!name.trim()) {
      toast.error("Please enter your full legal name")
      return
    }

    if (!phone.trim()) {
      toast.error("Please enter your phone or WhatsApp number")
      return
    }

    try {
      setIsProcessing(true)
      const res = await fetch("/api/payment/cyberbiz/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: parsedAmount.toFixed(2),
          description: serviceType === "consultation" 
            ? "GoComfortUSA Travel Consultation & Research Fee"
            : `GoComfortUSA Payment: ${paramService || "Custom Service"} (Ref: ${orderId || "Invoice"})`,
          orderId: orderId.trim() || undefined,
          customerName: name.trim(),
          customerEmail: email.trim(),
          customerPhone: phone.trim(),
        }),
      })

      const data = await res.json()

      if (!res.ok || !data.checkoutUrl) {
        throw new Error(data.error || data.details || "Failed to create payment session")
      }

      toast.success("Connecting to secure CyberBiz checkout...")
      window.location.href = data.checkoutUrl
    } catch (err: any) {
      console.error("Payment initiation error:", err)
      toast.error(err.message || "Unable to start payment process. Please try again.")
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col justify-between antialiased">
      {/* Top Header Bar */}
      <header className="border-b bg-white/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link 
            href="/" 
            className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="font-medium">Back to GoComfortUSA</span>
          </Link>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Lock className="h-3.5 w-3.5 text-emerald-600" />
            <span className="font-medium text-slate-700">256-Bit SSL Encrypted</span>
          </div>
        </div>
      </header>

      {/* Main Stripe-style Split Screen Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Stripe-Style Order Summary */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                <Image 
                  src="/ass/logo-round.png" 
                  alt="GoComfortUSA Logo" 
                  width={48} 
                  height={48} 
                  className="object-cover"
                />
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider font-semibold text-primary">
                  GoComfortUSA
                </span>
                <h2 className="text-lg font-bold text-slate-900 leading-tight">
                  Checkout &amp; Invoicing
                </h2>
              </div>
            </div>

            {/* Service Selection Toggle (Consultation vs Quote/Invoice) */}
            <div className="bg-slate-100 p-1 rounded-xl flex gap-1 border">
              <button
                type="button"
                onClick={() => setServiceType("consultation")}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                  serviceType === "consultation"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Travel Consultation
              </button>
              <button
                type="button"
                onClick={() => setServiceType("custom")}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                  serviceType === "custom"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Quote / Invoice
              </button>
            </div>

            {/* Price Display */}
            <div className="space-y-1">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                Total Due Today
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
                  ${formattedTotal}
                </span>
                <span className="text-slate-500 font-semibold text-lg">USD</span>
              </div>
            </div>

            {/* Official Invoice Badge if order_id is present */}
            {hasInvoice && (
              <div className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/70 text-xs space-y-1">
                <div className="flex items-center justify-between font-semibold text-blue-950">
                  <span className="flex items-center gap-1.5">
                    <FileText className="h-4 w-4 text-blue-600" />
                    Verified Invoice
                  </span>
                  <Badge variant="outline" className="font-mono bg-white text-blue-700 border-blue-300">
                    {paramOrderId}
                  </Badge>
                </div>
                {paramService && (
                  <p className="text-blue-900 font-medium">Service: {paramService}</p>
                )}
              </div>
            )}

            {/* Itemized Breakdown Table */}
            <div className="border rounded-xl bg-white p-4 space-y-3 shadow-sm text-sm">
              <div className="flex justify-between items-start pb-3 border-b">
                <div>
                  <span className="font-medium text-slate-800 block">
                    {serviceType === "consultation" 
                      ? "Travel Consultation & Booking Research" 
                      : (paramService || "Service Invoice Payment")}
                  </span>
                  <span className="text-xs text-slate-500">
                    {serviceType === "consultation" 
                      ? "Expert assistance for flights, hotels, and custom travel" 
                      : `Invoice reference: ${orderId || "Direct"}`}
                  </span>
                </div>
                <span className="font-semibold text-slate-900">${formattedTotal}</span>
              </div>

              <div className="flex justify-between text-xs text-slate-500">
                <span>Subtotal</span>
                <span>${formattedTotal}</span>
              </div>

              <div className="flex justify-between text-xs text-slate-500">
                <span>Taxes &amp; Processing</span>
                <span className="text-emerald-600 font-medium">$0.00 (Included)</span>
              </div>

              <div className="flex justify-between pt-2 border-t font-bold text-slate-900 text-base">
                <span>Total Amount</span>
                <span>${formattedTotal} USD</span>
              </div>
            </div>

            {/* Trust and Guarantee Highlights */}
            <div className="space-y-2 pt-2 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Zero hidden fees or additional surcharges</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Instant payment confirmation sent to your email &amp; WhatsApp</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Direct customer service via +1 (210) 418-2745</span>
              </div>
            </div>
          </div>

          {/* Right Column: Clean White Stripe Checkout Card */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
              <form onSubmit={handlePayment} className="space-y-6">
                
                {/* Step 1: Contact Information */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-slate-900">
                      Contact Information
                    </h3>
                    <span className="text-xs text-slate-400">Required</span>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="c-email" className="text-xs font-medium text-slate-700">
                      Email address
                    </Label>
                    <Input
                      id="c-email"
                      type="email"
                      placeholder="alex@example.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="h-11 rounded-lg border-slate-300 focus:border-primary focus:ring-1 focus:ring-primary text-sm"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="c-name" className="text-xs font-medium text-slate-700">
                        Full Legal Name
                      </Label>
                      <Input
                        id="c-name"
                        placeholder="Alex Morgan"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="h-11 rounded-lg border-slate-300 focus:border-primary focus:ring-1 focus:ring-primary text-sm"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="c-phone" className="text-xs font-medium text-slate-700">
                        Phone / WhatsApp
                      </Label>
                      <Input
                        id="c-phone"
                        placeholder="+1 (555) 000-0000"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        className="h-11 rounded-lg border-slate-300 focus:border-primary focus:ring-1 focus:ring-primary text-sm"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Step 2: Custom Quote / Invoice Amount (If custom mode selected) */}
                {serviceType === "custom" && (
                  <div className="pt-4 border-t space-y-4">
                    <h3 className="text-sm font-semibold text-slate-900">
                      Invoice Details
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="c-amount" className="text-xs font-medium text-slate-700">
                          Custom Amount ($ USD)
                        </Label>
                        <div className="relative">
                          <span className="absolute left-3.5 top-3 text-slate-400 font-semibold">$</span>
                          <Input
                            id="c-amount"
                            type="number"
                            step="0.01"
                            min="1"
                            placeholder="50.00"
                            value={customAmount}
                            onChange={e => setCustomAmount(e.target.value)}
                            className="h-11 pl-8 font-semibold rounded-lg border-slate-300 focus:border-primary text-sm"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="c-ref" className="text-xs font-medium text-slate-700">
                          Invoice / Order Number
                        </Label>
                        <Input
                          id="c-ref"
                          placeholder="e.g. GCU-RENT-409"
                          value={orderId}
                          onChange={e => setOrderId(e.target.value)}
                          className="h-11 rounded-lg border-slate-300 focus:border-primary text-sm"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Payment Method Info */}
                <div className="pt-4 border-t space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-slate-900">
                      Payment Method
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <CreditCard className="h-4 w-4" />
                      <span>Card / Instant Pay</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-white border flex items-center justify-center shadow-xs">
                        <CreditCard className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">
                          Bank Cards &amp; Fast Checkout
                        </span>
                        <span className="text-[11px] text-slate-500">
                          Visa, Mastercard, Mir, SBP &amp; Alternative Rails
                        </span>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-white text-[11px] text-slate-600">
                      CyberBiz Verified
                    </Badge>
                  </div>
                </div>

                {/* Big Clean Stripe-Style Submit Button */}
                <Button
                  type="submit"
                  size="lg"
                  disabled={isProcessing}
                  className="w-full h-12 text-base font-semibold rounded-xl bg-primary hover:bg-primary/95 text-white shadow-sm transition-all"
                >
                  {isProcessing ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Preparing Payment Terminal...
                    </span>
                  ) : (
                    <span>Pay ${formattedTotal} USD</span>
                  )}
                </Button>

                {/* Micro-footer */}
                <div className="text-center space-y-2 pt-2">
                  <p className="text-[11px] text-slate-400">
                    Payments are encrypted and processed by CyberBiz Payment Solutions. By paying, you agree to the Terms of Service.
                  </p>
                  <div className="flex items-center justify-center gap-4 text-xs text-slate-400">
                    <Link href="/terms" className="hover:underline">Terms</Link>
                    <span>•</span>
                    <Link href="/privacy" className="hover:underline">Privacy</Link>
                    <span>•</span>
                    <Link href="/contact" className="hover:underline">Contact Support</Link>
                  </div>
                </div>

              </form>
            </div>
          </div>

        </div>
      </main>

      {/* Clean Bottom Footer */}
      <footer className="border-t bg-white py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} GoComfortUSA Inc. All rights reserved.</p>
          <div className="flex items-center gap-1.5 text-slate-500 font-medium">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>Secure 256-Bit SSL Encrypted Checkout</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default function PayPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
          <span className="text-xs text-slate-500 font-medium">Loading secure checkout...</span>
        </div>
      </div>
    }>
      <PayContent />
    </Suspense>
  )
}
