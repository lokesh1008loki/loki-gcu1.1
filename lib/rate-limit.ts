/**
 * High-performance sliding window in-memory rate limiter for Edge/Node.js runtimes.
 */

interface RateLimitRecord {
  count: number
  resetTime: number
}

// In-memory bucket store
const rateLimitStore = new Map<string, RateLimitRecord>()

// Periodically clean up stale entries (every 2 minutes)
let lastCleanup = Date.now()
function purgeStaleRecords() {
  const now = Date.now()
  if (now - lastCleanup > 120_000) {
    lastCleanup = now
    for (const [key, record] of rateLimitStore.entries()) {
      if (now > record.resetTime) {
        rateLimitStore.delete(key)
      }
    }
  }
}

export interface RateLimitResult {
  allowed: boolean
  limit: number
  remaining: number
  resetTime: number
  retryAfterSeconds: number
}

/**
 * Check if an identifier (e.g. IP + endpoint) has exceeded the rate limit.
 *
 * @param identifier Unique key representing the client and endpoint (e.g., "192.168.1.1:/api/flights/inquiry")
 * @param limit Maximum allowed requests within the time window (default 15)
 * @param windowMs Time window in milliseconds (default 60,000 ms = 1 minute)
 */
export function checkRateLimit(
  identifier: string,
  limit: number = 15,
  windowMs: number = 60_000
): RateLimitResult {
  purgeStaleRecords()
  const now = Date.now()
  const record = rateLimitStore.get(identifier)

  if (!record || now > record.resetTime) {
    const resetTime = now + windowMs
    rateLimitStore.set(identifier, { count: 1, resetTime })
    return {
      allowed: true,
      limit,
      remaining: Math.max(0, limit - 1),
      resetTime,
      retryAfterSeconds: Math.ceil(windowMs / 1000),
    }
  }

  if (record.count >= limit) {
    const retryAfterSeconds = Math.max(1, Math.ceil((record.resetTime - now) / 1000))
    return {
      allowed: false,
      limit,
      remaining: 0,
      resetTime: record.resetTime,
      retryAfterSeconds,
    }
  }

  record.count += 1
  return {
    allowed: true,
    limit,
    remaining: Math.max(0, limit - record.count),
    resetTime: record.resetTime,
    retryAfterSeconds: Math.max(1, Math.ceil((record.resetTime - now) / 1000)),
  }
}

/**
 * Extract client IP address from request headers with reverse-proxy support.
 */
export function getClientIp(req: Request): string {
  const cfConnectingIp = req.headers.get("cf-connecting-ip")
  if (cfConnectingIp) return cfConnectingIp.trim()

  const xRealIp = req.headers.get("x-real-ip")
  if (xRealIp) return xRealIp.trim()

  const xForwardedFor = req.headers.get("x-forwarded-for")
  if (xForwardedFor) {
    const firstIp = xForwardedFor.split(",")[0]
    if (firstIp) return firstIp.trim()
  }

  return "127.0.0.1"
}

