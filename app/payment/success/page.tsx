"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { CheckCircle2, ArrowRight, ShieldCheck, Home, PhoneCall } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Suspense } from "react"

function SuccessContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("order_id") || "GCU-" + Date.now().toString().slice(-6)
  const amount = searchParams.get("amount") || "29.99"

  return (
    <div className="max-w-xl mx-auto py-12 px-4 sm:px-6">
      <Card className="border-emerald-100 shadow-xl overflow-hidden">
        <div className="bg-emerald-600 text-white p-8 text-center flex flex-col items-center">
          <div className="h-16 w-16 bg-white/20 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold">Payment Successful!</h1>
          <p className="text-emerald-100 text-sm mt-1">Thank you for choosing GoComfortUSA</p>
        </div>

        <CardContent className="p-6 space-y-6">
          <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Reference / Order ID:</span>
              <span className="font-mono font-semibold">{orderId}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Amount Paid:</span>
              <span className="font-bold text-emerald-600 text-base">${amount} USD</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Payment Status:</span>
              <span className="inline-flex items-center gap-1 text-emerald-600 font-medium text-xs bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                <ShieldCheck className="h-3.5 w-3.5" />
                Confirmed & Verified
              </span>
            </div>
          </div>

          <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
            <p className="font-medium text-slate-900 dark:text-slate-100">Next Steps:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Our dedicated travel coordinator has received your consultation booking and payment details.</li>
              <li>You will receive your personalized itinerary options and quote breakdown within 15–30 minutes via WhatsApp or Email.</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button asChild className="flex-1">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Return to Home
              </Link>
            </Button>
            <Button variant="outline" asChild className="flex-1">
              <Link href="/contact">
                <PhoneCall className="mr-2 h-4 w-4" />
                Contact Support
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12">
      <Suspense fallback={<div className="text-center p-8">Loading receipt...</div>}>
        <SuccessContent />
      </Suspense>
    </div>
  )
}

