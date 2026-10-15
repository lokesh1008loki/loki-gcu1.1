import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Candidate URLs for the Python Scraper (user's local tab / dev server or VPS)
    const candidates = [
      process.env.SCRAPER_API_URL,
      "http://127.0.0.1:5001",
      "http://127.0.0.1:5002",
      "http://127.0.0.1:5000",
      "http://localhost:5001",
      "http://localhost:5002",
      "http://localhost:5000"
    ].filter(Boolean) as string[];

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

    for (const baseUrl of candidates) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 35000);

        const response = await fetch(`${baseUrl}/api/search`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
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
      throw lastError || new Error("Could not connect to any active flight scraper backend (ports 5001, 5002, 5000).");
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Flight search API proxy error:", error);
    return NextResponse.json(
      { error: error?.message || "Could not connect to flight search engine. Please verify the scraper tab is running." },
      { status: 500 }
    );
  }
}
