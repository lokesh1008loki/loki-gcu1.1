import { NextRequest, NextResponse } from "next/server"
import { searchIkeaProducts } from "@/lib/ikea-catalog"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const query = searchParams.get("q")?.trim() || "sofa"
  const size = Math.min(Number(searchParams.get("size")) || 24, 48)

  const result = await searchIkeaProducts(query, size)

  if (result.status === "error") {
    return NextResponse.json(result, { status: 502 })
  }

  return NextResponse.json(result)
}
