import { NextResponse } from "next/server"
import crypto from "crypto"
import { verifyAdminAuth } from "@/lib/admin-auth"
import { isB2Configured, uploadImageToB2 } from "@/lib/b2"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"
export const maxDuration = 60

// 3 MB strict size limit
const MAX_FILE_SIZE = 3 * 1024 * 1024

// Patterns of dangerous extensions anywhere in the filename (e.g. .php.png, .phtml.jpg)
const DANGEROUS_EXT_REGEX =
  /\.(php\d*|phtml|phar|inc|asp|aspx|jsp|jspx|cgi|pl|py|sh|bash|exe|bat|cmd|dll|vbs|js|mjs|cjs|html|htm|shtml|svg|xml|swf)(\.|$)/i

// Suspicious script payloads within buffer header
const SCRIPT_SIGNATURES = [
  "<?php",
  "<?=",
  "<script",
  "<html",
  "<!doctype",
  "eval(",
  "base64_decode",
  "passthru(",
  "shell_exec",
  "<svg",
  "system(",
  "popen(",
  "proc_open",
]

interface ImageSignature {
  format: "jpeg" | "png" | "webp" | "gif" | "avif"
  mime: string
  ext: string
}

function verifyMagicBytes(buffer: Buffer): ImageSignature | null {
  if (buffer.length < 12) return null

  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return { format: "jpeg", mime: "image/jpeg", ext: "jpg" }
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return { format: "png", mime: "image/png", ext: "png" }
  }

  // GIF: GIF87a or GIF89a
  if (
    buffer[0] === 0x47 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x38 &&
    (buffer[4] === 0x37 || buffer[4] === 0x39) &&
    buffer[5] === 0x61
  ) {
    return { format: "gif", mime: "image/gif", ext: "gif" }
  }

  // WebP: RIFF .... WEBP
  if (
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46 &&
    buffer[8] === 0x57 &&
    buffer[9] === 0x45 &&
    buffer[10] === 0x42 &&
    buffer[11] === 0x50
  ) {
    return { format: "webp", mime: "image/webp", ext: "webp" }
  }

  // AVIF: ....ftypavif or ....ftypavis
  const brand = buffer.subarray(4, 12).toString("ascii")
  if (brand.startsWith("ftypavif") || brand.startsWith("ftypavis")) {
    return { format: "avif", mime: "image/avif", ext: "avif" }
  }

  return null
}

async function sanitizeImageBuffer(
  rawBuffer: Buffer,
  sig: ImageSignature
): Promise<Buffer> {
  if (sig.format === "gif") {
    return rawBuffer
  }

  let sharpMod: any
  try {
    const imported = await import("sharp")
    sharpMod = imported.default || imported
  } catch (loadErr) {
    console.warn("sharp unavailable at runtime, using magic-byte verified buffer:", loadErr)
    return rawBuffer
  }

  const image = sharpMod(rawBuffer, { failOnError: true })
  const metadata = await image.metadata()
  if (!metadata.width || !metadata.height) {
    throw new Error("CORRUPT_IMAGE")
  }

  if (sig.format === "jpeg") {
    return image.jpeg({ quality: 85, mozjpeg: true }).toBuffer()
  }
  if (sig.format === "png") {
    return image.png({ compressionLevel: 8 }).toBuffer()
  }
  if (sig.format === "webp") {
    return image.webp({ quality: 85 }).toBuffer()
  }
  if (sig.format === "avif") {
    return image.avif({ quality: 80 }).toBuffer()
  }
  return rawBuffer
}

export async function POST(request: Request) {
  try {
    // 1. Authentication check (supports both getServerSession and JWT getToken)
    const auth = await verifyAdminAuth(request)
    if (!auth.authenticated) {
      return NextResponse.json(
        { error: "Unauthorized access: Please log in to upload assets." },
        { status: 401 }
      )
    }

    // 2. Parse multipart form data
    const formData = await request.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "No image file provided" }, { status: 400 })
    }

    // 3. File size check
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File size exceeds the 3MB maximum allowed limit." },
        { status: 400 }
      )
    }

    // 4. Filename security checks
    const originalName = file.name || ""
    if (
      originalName.includes("\0") ||
      originalName.includes("%00") ||
      originalName.includes("..") ||
      originalName.includes("/") ||
      originalName.includes("\\")
    ) {
      return NextResponse.json(
        { error: "Invalid or malicious file name characters detected." },
        { status: 400 }
      )
    }

    if (DANGEROUS_EXT_REGEX.test(originalName)) {
      return NextResponse.json(
        {
          error:
            "Forbidden file extension pattern detected. Executable or script files are strictly blocked.",
        },
        { status: 400 }
      )
    }

    // 5. Read buffer into memory
    const bytes = await file.arrayBuffer()
    const rawBuffer = Buffer.from(bytes)

    if (rawBuffer.length === 0) {
      return NextResponse.json({ error: "The uploaded file is empty." }, { status: 400 })
    }

    if (rawBuffer.length > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File buffer exceeds the 3MB maximum allowed limit." },
        { status: 400 }
      )
    }

    // 6. Inspect buffer magic bytes
    const detectedSignature = verifyMagicBytes(rawBuffer)
    if (!detectedSignature) {
      return NextResponse.json(
        {
          error:
            "Invalid file type. Only genuine JPG, PNG, WebP, GIF, and AVIF image formats are allowed.",
        },
        { status: 400 }
      )
    }

    // 7. Check for polyglot script injection in the header
    const sampleAscii = rawBuffer.subarray(0, 4096).toString("binary").toLowerCase()
    for (const signature of SCRIPT_SIGNATURES) {
      if (sampleAscii.includes(signature)) {
        return NextResponse.json(
          { error: "Potentially malicious script payload detected in image content." },
          { status: 400 }
        )
      }
    }

    // 8. Re-encode and sanitize image
    let cleanBuffer: Buffer
    try {
      cleanBuffer = await sanitizeImageBuffer(rawBuffer, detectedSignature)
    } catch (sharpError: any) {
      console.error("Image processing error:", sharpError)
      if (sharpError?.message === "CORRUPT_IMAGE") {
        return NextResponse.json(
          { error: "Corrupted image dimensions." },
          { status: 400 }
        )
      }
      return NextResponse.json(
        { error: "Image file failed integrity verification." },
        { status: 400 }
      )
    }

    // 9. Generate guaranteed safe unique filename
    const uniqueId = `${Date.now()}-${crypto.randomBytes(8).toString("hex")}`
    const baseFileName = `${uniqueId}.${detectedSignature.ext}`
    const b2StorageName = `blog/${baseFileName}`

    // 10. Upload to Backblaze B2 when configured; fall back to DB-backed /media/[filename] if B2 env vars are absent on Vercel
    let publicUrl = ""
    let storage: "b2" | "database" = "b2"

    if (isB2Configured()) {
      try {
        const b2Result = await uploadImageToB2(
          cleanBuffer,
          b2StorageName,
          detectedSignature.mime
        )
        publicUrl = b2Result.url
      } catch (b2Error) {
        console.error("Backblaze B2 upload failed, falling back to database media storage:", b2Error)
      }
    }

    if (!publicUrl) {
      storage = "database"
      await (prisma as any).uploadedMedia.create({
        data: {
          fileName: baseFileName,
          contentType: detectedSignature.mime,
          size: cleanBuffer.length,
          data: cleanBuffer,
        },
      })
      publicUrl = `/media/${baseFileName}`
    }

    // 11. Respond with public URL and strict security headers
    const response = NextResponse.json({
      success: true,
      url: publicUrl,
      filename: publicUrl,
      size: cleanBuffer.length,
      contentType: detectedSignature.mime,
      storage,
    })

    response.headers.set("X-Content-Type-Options", "nosniff")
    response.headers.set("Cache-Control", "no-store, max-age=0")

    return response
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Internal server error during upload",
      },
      { status: 500 }
    )
  }
}
