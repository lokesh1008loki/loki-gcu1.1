import crypto from "crypto"

export const CYBERBIZ_CONFIG = {
  shopId: process.env.CYBERBIZ_SHOP_ID || "",
  secretKey: process.env.CYBERBIZ_SECRET_KEY || "",
  gatewayUrl: "https://pay.cyberbiz.bz/kassa/pay",
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
  if (!receivedSignature || !CYBERBIZ_CONFIG.secretKey) return false

  try {
    const secret = CYBERBIZ_CONFIG.secretKey
    const dataString = typeof payload === "string" ? payload : JSON.stringify(payload)
    
    const computedSignature = crypto
      .createHmac("sha256", secret)
      .update(dataString)
      .digest("hex")

    const compBuf = Buffer.from(computedSignature.toLowerCase(), "utf8")
    const recvBuf = Buffer.from(receivedSignature.toLowerCase(), "utf8")

    if (compBuf.length !== recvBuf.length) {
      return false
    }

    return crypto.timingSafeEqual(compBuf, recvBuf)
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

