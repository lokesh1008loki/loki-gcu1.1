import crypto from "crypto"

export const CYBERBIZ_CONFIG = {
  shopId: process.env.CYBERBIZ_SHOP_ID || "1793867127",
  secretKey: process.env.CYBERBIZ_SECRET_KEY || "s5crNWKMwnhTAzWJlb",
  domain: "gocomfortusa.com",
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || "https://gocomfortusa.com",
  webhookUrl: "https://gocomfortusa.com/api/payment/cyberbiz/webhook",
  successUrl: "https://gocomfortusa.com/payment/success",
  errorUrl: "https://gocomfortusa.com/payment/failed",
}

/**
 * Verify HMAC-SHA256 signature from incoming CyberBiz webhook
 */
export function verifyCyberbizSignature(payload: any, receivedSignature?: string | null): boolean {
  if (!receivedSignature) return false

  try {
    const secret = CYBERBIZ_CONFIG.secretKey
    const dataString = typeof payload === "string" ? payload : JSON.stringify(payload)
    
    const computedSignature = crypto
      .createHmac("sha256", secret)
      .update(dataString)
      .digest("hex")

    return (
      crypto.timingSafeEqual(
        Buffer.from(computedSignature, "utf8"),
        Buffer.from(receivedSignature, "utf8")
      ) || computedSignature.toLowerCase() === receivedSignature.toLowerCase()
    )
  } catch (error) {
    console.error("Error verifying CyberBiz signature:", error)
    return false
  }
}

/**
 * Generate unique order tracking reference
 */
export function generateOrderId(prefix = "GCU"): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `${prefix}-${timestamp}-${random}`
}
