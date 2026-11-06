import { NextResponse } from "next/server"
import { CYBERBIZ_CONFIG, generateOrderId } from "@/lib/cyberbiz"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { 
      amount, 
      description = "GoComfortUSA Travel Service Consultation", 
      orderId, 
      customerName, 
      customerEmail, 
      customerPhone 
    } = body

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      return NextResponse.json(
        { error: "Valid payment amount is required" },
        { status: 400 }
      )
    }

    const uniqueOrderId = orderId || generateOrderId("GCU")
    const numAmount = Number(amount).toFixed(2)

    // Build checkout redirect parameters according to CyberBiz gateway specs
    const successUrl = `${CYBERBIZ_CONFIG.successUrl}?order_id=${encodeURIComponent(uniqueOrderId)}&amount=${encodeURIComponent(numAmount)}`
    const errorUrl = `${CYBERBIZ_CONFIG.errorUrl}?order_id=${encodeURIComponent(uniqueOrderId)}`

    // CyberBiz payment URL structure (pay.cyberbiz.bz/kassa/pay)
    const paymentParams = new URLSearchParams({
      merchant: CYBERBIZ_CONFIG.shopId,
      amount: numAmount,
      comment: uniqueOrderId,
      desc: String(description).slice(0, 255),
      payment: "1",
      url_sucess: successUrl,
      url_fail: errorUrl,
      url_callback: CYBERBIZ_CONFIG.webhookUrl,
      // Fallback aliases for broader compatibility
      shop_id: CYBERBIZ_CONFIG.shopId,
      order_id: uniqueOrderId,
      currency: "USD",
      success_url: successUrl,
      error_url: errorUrl,
      webhook_url: CYBERBIZ_CONFIG.webhookUrl,
    })

    if (customerEmail) {
      paymentParams.append("email", customerEmail)
      paymentParams.append("mail", customerEmail)
    }
    if (customerPhone) paymentParams.append("phone", customerPhone)
    if (customerName) paymentParams.append("name", customerName)

    const checkoutUrl = `${CYBERBIZ_CONFIG.gatewayUrl}?${paymentParams.toString()}`

    return NextResponse.json({
      success: true,
      orderId: uniqueOrderId,
      amount: numAmount,
      currency: "USD",
      checkoutUrl,
      widgetParams: {
        shopId: CYBERBIZ_CONFIG.shopId,
        orderId: uniqueOrderId,
        amount: numAmount,
        description,
        successUrl,
        errorUrl,
      }
    })
  } catch (error: any) {
    console.error("Error creating CyberBiz payment:", error)
    return NextResponse.json(
      { error: "Failed to initiate payment", details: error?.message || String(error) },
      { status: 500 }
    )
  }
}

