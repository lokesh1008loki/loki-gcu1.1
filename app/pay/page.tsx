"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ShieldCheck, CreditCard, Lock, Sparkles, Loader2, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"
import { Suspense } from "react"

function PayContent() {
  const searchParams = useSearchParams()
  const initialAmount = searchParams.get("amount") || "29.99"
  const initialService = searchParams.get("service") || "consultation"
  const initialOrderId = searchParams.get("order_id") || ""

  const [serviceType, setServiceType] = useState(initialService)
  const [customAmount, setCustomAmount] = useState(initialAmount)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [orderId, setOrderId] = useState(initialOrderId)
  const [isProcessing, setIsProcessing] = useState(false)

  const activeAmount = serviceType === "consultation" ? "29.99" : customAmount

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()

    const parsedAmount = parseFloat(activeAmount)
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      toast.error("Please enter a valid payment amount")
      return
    }

    if (!name || !phone) {
      toast.error("Please enter your name and phone/WhatsApp number")
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
            : `GoComfortUSA Service Payment (Ref: ${orderId || "Invoice"})`,
          orderId: orderId || undefined,
          customerName: name,
          customerEmail: email || undefined,
          customerPhone: phone,
        }),
      })

      const data = await res.json()

      if (!res.ok || !data.checkoutUrl) {
        throw new Error(data.error || data.details || "Failed to create payment session")
      }

      toast.success("Redirecting to secure CyberBiz checkout...")
      // Redirect to CyberBiz secure payment gateway
      window.location.href = data.checkoutUrl
    } catch (err: any) {
      console.error("Payment initiation error:", err)
      toast.error(err.message || "Unable to start payment process. Please try again.")
      setIsProcessing(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6">
      <div className="text-center mb-8">
        <Badge variant="outline" className="mb-2 px-3 py-1 text-primary border-primary/30">
          <Lock className="w-3 h-3 mr-1" />
          Encrypted 256-Bit SSL Gateway
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          Secure Payment Checkout
        </h1>
        <p className="text-muted-foreground text-sm mt-2 max-w-md mx-auto">
          Complete your consultation fee or service payment securely with GoComfortUSA & CyberBiz.
        </p>
      </div>

      <Card className="shadow-xl border-slate-200 dark:border-slate-800">
        <CardHeader className="bg-slate-50/50 dark:bg-slate-900/50 border-b">
          <CardTitle className="text-lg">Select Service & Amount</CardTitle>
          <CardDescription>Choose standard consultation or enter a custom quote invoice</CardDescription>
        </CardHeader>

        <form onSubmit={handlePayment}>
          <CardContent className="p-6 space-y-6">
            <RadioGroup 
              value={serviceType} 
              onValueChange={setServiceType}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              <div 
                onClick={() => setServiceType("consultation")}
                className={`flex items-start justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  serviceType === "consultation" 
                    ? "border-primary bg-primary/5 ring-1 ring-primary" 
                    : "border-slate-200 dark:border-slate-800 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="consultation" id="r-consultation" />
                  <Label htmlFor="r-consultation" className="cursor-pointer font-medium">
                    <span className="block text-sm font-semibold">Travel Consultation</span>
                    <span className="block text-xs text-muted-foreground mt-0.5">Flights & Hotels Research</span>
                  </Label>
                </div>
                <span className="text-lg font-bold text-primary">$29.99</span>
              </div>

              <div 
                onClick={() => setServiceType("custom")}
                className={`flex items-start justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  serviceType === "custom" 
                    ? "border-primary bg-primary/5 ring-1 ring-primary" 
                    : "border-slate-200 dark:border-slate-800 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="custom" id="r-custom" />
                  <Label htmlFor="r-custom" className="cursor-pointer font-medium">
                    <span className="block text-sm font-semibold">Quote / Invoice</span>
                    <span className="block text-xs text-muted-foreground mt-0.5">Tickets, Rent, or Custom</span>
                  </Label>
                </div>
                <span className="text-xs font-semibold text-muted-foreground uppercase">Custom</span>
              </div>
            </RadioGroup>

            {serviceType === "custom" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-2">
                  <Label htmlFor="custom-amount">Payment Amount ($ USD) *</Label>
                  <Input
                    id="custom-amount"
                    type="number"
                    step="0.01"
                    min="1"
                    placeholder="e.g. 50.00"
                    value={customAmount}
                    onChange={e => setCustomAmount(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="order-ref">Invoice / Order Reference</Label>
                  <Input
                    id="order-ref"
                    placeholder="e.g. GCU-FLIGHT-102"
                    value={orderId}
                    onChange={e => setOrderId(e.target.value)}
                  />
                </div>
              </div>
            )}

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

            <Button 
              type="submit" 
              size="lg" 
              className="w-full text-base py-6 font-bold shadow-lg hover:shadow-primary/25 transition-all"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Connecting to CyberBiz Gateway...
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-5 w-5" />
                  Pay ${parseFloat(activeAmount || "0").toFixed(2)} with CyberBiz
                </>
              )}
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              By proceeding, you agree to GoComfortUSA's Terms of Service and Privacy Policy. Payment processed securely by CyberBiz Gateway.
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
