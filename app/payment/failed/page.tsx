"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { AlertCircle, RotateCcw, Home, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Suspense } from "react"

function FailedContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("order_id") || ""

  return (
    <div className="max-w-md mx-auto py-12 px-4 sm:px-6">
      <Card className="border-rose-100 shadow-xl overflow-hidden">
        <div className="bg-rose-600 text-white p-8 text-center flex flex-col items-center">
          <div className="h-16 w-16 bg-white/20 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold">Payment Not Completed</h1>
          <p className="text-rose-100 text-sm mt-1">The transaction was cancelled or could not be processed</p>
        </div>

        <CardContent className="p-6 space-y-6">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            No funds were charged. If this was unexpected, please verify your payment details with your card provider or choose an alternative payment option.
          </p>

          {orderId && (
            <div className="bg-slate-50 dark:bg-slate-900 rounded p-3 text-xs flex justify-between font-mono">
              <span className="text-muted-foreground">Order Reference:</span>
              <span>{orderId}</span>
            </div>
          )}

          <div className="flex flex-col gap-3 pt-2">
            <Button asChild className="w-full">
              <Link href="/pay">
                <RotateCcw className="mr-2 h-4 w-4" />
                Try Again
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link href="/contact">
                <HelpCircle className="mr-2 h-4 w-4" />
                Contact Helpdesk
              </Link>
            </Button>
            <Button variant="ghost" asChild className="w-full text-xs">
              <Link href="/">
                <Home className="mr-2 h-3.5 w-3.5" />
                Back to Homepage
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function PaymentFailedPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12">
      <Suspense fallback={<div className="text-center p-8">Loading...</div>}>
        <FailedContent />
      </Suspense>
    </div>
  )
}
