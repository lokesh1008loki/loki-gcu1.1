import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

const SAFE_FILENAME_REGEX = /^[a-zA-Z0-9._-]+$/

export async function GET(
  _request: Request,
  { params }: { params: { filename: string } | Promise<{ filename: string }> }
) {
  try {
    const resolved = await Promise.resolve(params)
    const filename = resolved?.filename

    if (!filename || !SAFE_FILENAME_REGEX.test(filename)) {
      return new NextResponse("Not Found", { status: 404 })
    }

    const media = await (prisma as any).uploadedMedia.findUnique({
      where: { fileName: filename },
    })

    if (!media || !media.data) {
      return new NextResponse("Not Found", { status: 404 })
    }

    const bytes = Buffer.from(media.data)

    return new NextResponse(bytes, {
      status: 200,
      headers: {
        "Content-Type": media.contentType || "application/octet-stream",
        "Content-Length": String(bytes.length),
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    })
  } catch (error) {
    console.error("Error serving uploaded media:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
