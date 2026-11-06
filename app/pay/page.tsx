"use client"

import { useState, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ShieldCheck, CreditCard, Lock, CheckCircle2, FileText, ArrowRight } from "lucide-react"
import { toast } from "sonner"
import { Suspense } from "react"

function PayContent() {
  const searchParams = useSearchParams()
  const paramAmount = searchParams.get("amount")
  const paramService = searchParams.get("service")
  const paramOrderId = searchParams.get("order_id")

  // Determine if this is an official admin invoice link
  const hasInvoice = Boolean(paramOrderId)

  // Normalize initial mode strictly to "consultation" or "custom"
  const initialMode = hasInvoice || (paramAmount && paramAmount !== "29.99") ? "custom" : "consultation"

  const [serviceType, setServiceType] = useState<"consultation" | "custom">(initialMode)
  const [customAmount, setCustomAmount] = useState<string>(paramAmount || "50.00")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [orderId, setOrderId] = useState(paramOrderId || "")
  const [isProcessing, setIsProcessing] = useState(false)

  // Active payable amount
  const activeAmount = useMemo(() => {
    if (serviceType === "consultation") {
      return "29.99"
    }
    return customAmount || "0.00"
  }, [serviceType, customAmount])

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()

    const parsedAmount = parseFloat(activeAmount)
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      toast.error("Please enter a valid payment amount")
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
            : `GoComfortUSA Payment: ${paramService || "Service"} (Ref: ${orderId || "Direct"})`,
          orderId: orderId.trim() || undefined,
          customerName: name.trim(),
          customerEmail: email.trim() || undefined,
          customerPhone: phone.trim(),
        }),
      })

      const data = await res.json()

      if (!res.ok || !data.checkoutUrl) {
        throw new Error(data.error || data.details || "Failed to create payment session")
      }

      toast.success("Connecting to CyberBiz payment terminal...")
      window.location.href = data.checkoutUrl
    } catch (err: any) {
      console.error("Payment initiation error:", err)
      toast.error(err.message || "Unable to start payment process. Please try again.")
      setIsProcessing(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6">
      {/* Top Header */}
      <div className="text-center mb-8">
        <Badge variant="outline" className="mb-2 px-3 py-1 text-primary border-primary/30">
          <Lock className="w-3 h-3 mr-1" />
          Encrypted 256-Bit SSL Checkout
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          Secure Payment Checkout
        </h1>
        <p className="text-muted-foreground text-sm mt-2 max-w-md mx-auto">
          Complete your consultation fee or service payment securely with GoComfortUSA &amp; CyberBiz.
        </p>
      </div>

      {/* Official Admin Invoice Banner if link includes order_id */}
      {hasInvoice && (
        <div className="mb-6 p-4 rounded-xl border border-blue-200 bg-blue-50/70 dark:bg-blue-950/30 flex items-start gap-3">
          <FileText className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
          <div className="flex-1 text-sm">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="font-semibold text-blue-950 dark:text-blue-200">
                Official GoComfortUSA Invoice
              </span>
              <Badge className="bg-blue-600 text-white font-mono text-xs">
                Ref: {paramOrderId}
              </Badge>
            </div>
            {paramService && (
              <p className="text-xs text-blue-900 dark:text-blue-300 mt-1">
                Service: <span className="font-medium">{paramService}</span>
              </p>
            )}
            <p className="text-xs text-muted-foreground mt-0.5">
              This invoice was issued by GoComfortUSA support. Amount is pre-set to your quote.
            </p>
          </div>
        </div>
      )}

      <Card className="shadow-xl border-slate-200 dark:border-slate-800">
        <CardHeader className="bg-slate-50/50 dark:bg-slate-900/50 border-b">
          <CardTitle className="text-lg">Select Service &amp; Amount</CardTitle>
          <CardDescription>Choose standard consultation or enter a custom quote invoice</CardDescription>
        </CardHeader>

        <form onSubmit={handlePayment}>
          <CardContent className="p-6 space-y-6">
            
            {/* Interactive Toggle Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Option 1: Consultation */}
              <button
                type="button"
                onClick={() => setServiceType("consultation")}
                className={`flex items-start justify-between p-4 rounded-xl border-2 text-left transition-all cursor-pointer ${
                  serviceType === "consultation"
                    ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                    : "border-slate-200 dark:border-slate-800 hover:border-slate-300 opacity-70 hover:opacity-100"
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center ${
                    serviceType === "consultation" ? "border-primary bg-primary" : "border-slate-400"
                  }`}>
                    {serviceType === "consultation" && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                  <div>
                    <span className="block text-sm font-semibold text-slate-900 dark:text-slate-100">
                      Travel Consultation
                    </span>
                    <span className="block text-xs text-muted-foreground mt-0.5">
                      Flights &amp; Hotels Research
                    </span>
                  </div>
                </div>
                <span className="text-lg font-bold text-primary">$29.99</span>
              </button>

              {/* Option 2: Custom Quote / Invoice */}
              <button
                type="button"
                onClick={() => setServiceType("custom")}
                className={`flex items-start justify-between p-4 rounded-xl border-2 text-left transition-all cursor-pointer ${
                  serviceType === "custom"
                    ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                    : "border-slate-200 dark:border-slate-800 hover:border-slate-300 opacity-70 hover:opacity-100"
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center ${
                    serviceType === "custom" ? "border-primary bg-primary" : "border-slate-400"
                  }`}>
                    {serviceType === "custom" && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                  <div>
                    <span className="block text-sm font-semibold text-slate-900 dark:text-slate-100">
                      Quote / Invoice
                    </span>
                    <span className="block text-xs text-muted-foreground mt-0.5">
                      Tickets, Rent, or Custom
                    </span>
                  </div>
                </div>
                <span className="text-xs font-semibold text-muted-foreground uppercase mt-1">
                  Custom
                </span>
              </button>
            </div>

            {/* Custom Amount Fields (Visible when Custom is selected) */}
            {serviceType === "custom" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 p-4 rounded-xl bg-slate-50/70 dark:bg-slate-900/40 border">
                <div className="space-y-2">
                  <Label htmlFor="custom-amount">Payment Amount ($ USD) *</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-muted-foreground font-semibold">$</span>
                    <Input
                      id="custom-amount"
                      type="number"
                      step="0.01"
                      min="1"
                      placeholder="e.g. 50.00"
                      className="pl-8 font-semibold"
                      value={customAmount}
                      onChange={e => setCustomAmount(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="order-ref">Invoice / Order Reference</Label>
                  <Input
                    id="order-ref"
                    placeholder="e.g. GCU-RENT-102"
                    value={orderId}
                    onChange={e => setOrderId(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Customer Contact Details */}
            <div className="border-t pt-4 space-y-4">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Customer Information
              </h3>

              <div className="space-y-2">
                <Label htmlFor="c-name">Full Legal Name *</Label>
                <Input
                  id="c-name"
                  placeholder="John Doe"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="c-phone">WhatsApp / Phone Number *</Label>
                  <Input
                    id="c-phone"
                    placeholder="+1 (555) 000-0000"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="c-email">Email Address</Label>
                  <Input
                    id="c-email"
                    type="email"
                    placeholder="john@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Total Payable Summary */}
            <div className="bg-slate-50 dark:bg-slate-900/80 rounded-xl p-4 flex items-center justify-between border">
              <div>
                <span className="text-xs uppercase tracking-wider font-semibold text-muted-foreground block">
                  Total Payable
                </span>
                <span className="text-2xl font-extrabold text-primary">
                  ${parseFloat(activeAmount || "0").toFixed(2)} USD
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <ShieldCheck className="h-5 w-5 text-emerald-600" />
                <span>Zero Hidden Fees</span>
              </div>
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              size="lg" 
              className="w-full text-base py-6 font-bold shadow-lg hover:shadow-primary/25 transition-all"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <CreditCard className="mr-2 h-5 w-5 animate-pulse" />
                  Connecting to CyberBiz Gateway...
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-5 w-5" />
                  Pay ${parseFloat(activeAmount || "0").toFixed(2)} with CyberBiz
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              By proceeding, you agree to GoComfortUSA&apos;s Terms of Service and Privacy Policy. Payment processed securely by CyberBiz Gateway.
            </p>
          </CardContent>
        </form>
      </Card>
    </div>
  )
}

export default function PayPage() {
  return (
    <Suspense fallback={<div className="text-center py-20">Loading payment form...</div>}>
      <PayContent />
    </Suspense>
  )
}
