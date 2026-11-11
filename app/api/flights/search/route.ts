import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 60; // Allow sufficient time for live Booking.com scrape

const VPS_SCRAPER_URL = process.env.SCRAPER_API_URL || "http://187.127.191.92:5001";
const DEFAULT_SCRAPER_KEY = "gcu_sec_7557d718c8998e4f54b841e248e0d117e9601a6aa53f3374047c92abc9c5a6d5";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Candidate URLs for the Python Scraper: checks configured env, VPS endpoint, and local dev if non-production
    const isVercel = Boolean(process.env.VERCEL);
    const candidates = [
      process.env.SCRAPER_API_URL,
      VPS_SCRAPER_URL,
      !isVercel ? "http://127.0.0.1:5001" : null,
      !isVercel ? "http://localhost:5001" : null,
      !isVercel ? "http://127.0.0.1:5002" : null,
      !isVercel ? "http://localhost:5002" : null,
    ].filter(Boolean) as string[];

    const apiKey = process.env.SCRAPER_API_KEY || DEFAULT_SCRAPER_KEY;

    const payload = JSON.stringify({
      from: body.from,
      to: body.to,
      depart: body.depart,
      return: body.return || null,
      type: body.type || "ONEWAY",
      cabin_class: body.cabin_class || "ECONOMY",
      adults: Number(body.adults) || 1,
      children: Number(body.children) || 0,
      children_ages: Array.isArray(body.children_ages) ? body.children_ages : [],
      direct_only: Boolean(body.direct_only),
      currency: "USD",
      force_refresh: Boolean(body.force_refresh)
    });

    let lastError: any = null;
    let data: any = null;

    // Use Set to prevent redundant attempts if process.env.SCRAPER_API_URL is identical to VPS_SCRAPER_URL
    const uniqueCandidates = Array.from(new Set(candidates));

    for (const baseUrl of uniqueCandidates) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 45000);

        const requestHeaders: Record<string, string> = {
          "Content-Type": "application/json",
          "X-API-Key": apiKey
        };

        const response = await fetch(`${baseUrl}/api/search`, {
          method: "POST",
          headers: requestHeaders,
          body: payload,
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (response.ok) {
          data = await response.json();
          break;
        } else {
          let errText = "Failed from " + baseUrl;
          try {
            const errJson = await response.json();
            errText = errJson.message || errJson.error || errText;
          } catch (_) {}
          lastError = new Error(errText);
        }
      } catch (err: any) {
        lastError = err;
        continue;
      }
    }

    if (!data) {
      throw lastError || new Error("Could not connect to flight search engine on VPS or local scraper.");
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Flight search API proxy error:", error);
    return NextResponse.json(
      { error: error?.message || "Could not connect to flight search engine. Please verify the scraper is active." },
      { status: 500 }
    );
  }
}
