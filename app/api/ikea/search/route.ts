import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

interface CachedSearchResult {
  timestamp: number;
  data: any;
}

// In-memory cache with 15-minute TTL to ensure sub-10ms response on repeat queries
const searchCache = new Map<string, CachedSearchResult>();
const CACHE_TTL_MS = 15 * 60 * 1000;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q")?.trim() || "sofa";
    const size = Math.min(Number(searchParams.get("size")) || 24, 48);

    const cacheKey = `${query.toLowerCase()}_${size}`;
    const cached = searchCache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return NextResponse.json({
        ...cached.data,
        cached: true,
      });
    }

    const ikeaEndpoint = `https://sik.search.blue.cdtapps.com/us/en/search-result-page?q=${encodeURIComponent(
      query
    )}&types=PRODUCT&size=${size}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const ikeaRes = await fetch(ikeaEndpoint, {
      method: "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        Accept: "application/json",
      },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!ikeaRes.ok) {
      throw new Error(`IKEA Search Gateway responded with status: ${ikeaRes.status}`);
    }

    const rawData = await ikeaRes.json();
    const rawItems = rawData.searchResultPage?.products?.main?.items || [];

    const products = rawItems
      .filter((item: any) => item.product && item.product.id)
      .map((item: any) => {
        const p = item.product;
        const retailPrice = Number(p.salesPrice?.numeral) || 0;
        const discountPercent = 30;
        const discountedPrice = Math.round(retailPrice * (1 - discountPercent / 100) * 100) / 100;
        const savings = Math.round((retailPrice - discountedPrice) * 100) / 100;

        return {
          id: p.id,
          itemNo: p.itemNo || p.id,
          name: p.name || "IKEA Product",
          typeName: p.typeName || "",
          itemMeasureReferenceText: p.itemMeasureReferenceText || "",
          currency: p.salesPrice?.currencyCode || "USD",
          retailPrice,
          discountPercent,
          discountedPrice,
          savings,
          formattedRetailPrice: `$${retailPrice.toFixed(2)}`,
          formattedDiscountedPrice: `$${discountedPrice.toFixed(2)}`,
          formattedSavings: `-$${savings.toFixed(2)}`,
          imageUrl: p.mainImageUrl || "",
          contextualImageUrl: p.contextualImageUrl || "",
          pipUrl: p.pipUrl || `https://www.ikea.com/us/en/p/${p.id}/`,
          rating: Number(p.ratingValue) || null,
          ratingCount: Number(p.ratingCount) || 0,
          colors: Array.isArray(p.colors) ? p.colors : [],
        };
      });

    const responsePayload = {
      status: "success",
      query,
      totalFound: products.length,
      products,
      cached: false,
    };

    searchCache.set(cacheKey, {
      timestamp: Date.now(),
      data: responsePayload,
    });

    return NextResponse.json(responsePayload);
  } catch (error: any) {
    console.error("IKEA search API error:", error);
    return NextResponse.json(
      {
        status: "error",
        error: error?.message || "Failed to search IKEA catalog",
      },
      { status: 500 }
    );
  }
}

