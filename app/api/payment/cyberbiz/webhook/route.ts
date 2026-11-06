import { NextResponse } from "next/server"
import { verifyCyberbizSignature, CYBERBIZ_CONFIG } from "@/lib/cyberbiz"

export const dynamic = "force-dynamic"
export const revalidate = 0

// Handle GET for CyberBiz webhook url healthcheck / validation ping
export async function GET() {
  return NextResponse.json({
    status: "ok",
    shopId: CYBERBIZ_CONFIG.shopId,
    domain: CYBERBIZ_CONFIG.domain,
    message: "CyberBiz webhook endpoint is active and listening."
  }, {
    status: 200,
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate"
    }
  })
}

// Handle POST for real-time payment notifications
export async function POST(request: Request) {
  try {
    const rawBody = await request.text()
    let payload: any = {}
    try {
      payload = JSON.parse(rawBody)
    } catch {
      // Fallback for form-encoded webhook data
      const searchParams = new URLSearchParams(rawBody)
      payload = Object.fromEntries(searchParams.entries())
    }

    console.log("CyberBiz Webhook received:", payload)

    const signature = 
      request.headers.get("x-cyberbiz-signature") ||
      request.headers.get("x-signature") ||
      payload.signature ||
      payload.sign

    // Log details for debugging
    const { order_id, orderId, id, amount, status, currency } = payload
    const effectiveOrderId = order_id || orderId || id || "UNKNOWN"
    const effectiveStatus = (status || "").toUpperCase()

    console.log(`Payment webhook for order: ${effectiveOrderId}, status: ${effectiveStatus}, amount: ${amount} ${currency || "USD"}`)

    // Always respond with 200 OK so CyberBiz marks webhook delivery as successful
    return NextResponse.json({
      status: "success",
      received: true,
      orderId: effectiveOrderId
    }, {
      status: 200
    })
  } catch (error: any) {
    console.error("Error processing CyberBiz webhook:", error)
    // Return 200 with error log to avoid repeated redelivery loops while investigating
    return NextResponse.json({
      status: "error",
      message: error?.message || "Webhook processing error"
    }, {
      status: 200
    })
  }
}
