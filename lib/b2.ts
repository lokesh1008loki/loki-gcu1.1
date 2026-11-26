import crypto from "crypto"

interface B2AuthData {
  apiUrl: string
  downloadUrl: string
  authorizationToken: string
  accountId: string
  bucketId: string
  bucketName: string
  expiresAt: number
}

// In-memory token cache (valid for 20 hours, B2 tokens typically expire in 24 hours)
let cachedAuth: B2AuthData | null = null

export function isB2Configured(): boolean {
  return Boolean(process.env.B2_KEY_ID && process.env.B2_APPLICATION_KEY)
}

function getB2Credentials() {
  const keyId = process.env.B2_KEY_ID
  const applicationKey = process.env.B2_APPLICATION_KEY
  const bucketName = process.env.B2_BUCKET_NAME
  const bucketId = process.env.B2_BUCKET_ID

  if (!keyId || !applicationKey) {
    throw new Error(
      "Missing Backblaze B2 environment variables: B2_KEY_ID and B2_APPLICATION_KEY must be configured."
    )
  }

  return {
    keyId,
    applicationKey,
    bucketName: bucketName || "",
    bucketId: bucketId || "",
  }
}

/**
 * Authenticates with the Backblaze B2 native API.
 * Uses cached credentials if still valid.
 */
export async function getB2Auth(): Promise<B2AuthData> {
  const now = Date.now()
  if (cachedAuth && cachedAuth.expiresAt > now) {
    return cachedAuth
  }

  const { keyId, applicationKey, bucketId, bucketName } = getB2Credentials()
  const basicAuth = Buffer.from(`${keyId}:${applicationKey}`).toString("base64")
  const response = await fetch("https://api.backblazeb2.com/b2api/v2/b2_authorize_account", {
    method: "GET",
    headers: {
      Authorization: `Basic ${basicAuth}`,
    },
    // Don't cache the HTTP fetch itself
    cache: "no-store",
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Failed to authorize Backblaze B2 account (${response.status}): ${errorText}`)
  }

  const data = await response.json()

  cachedAuth = {
    apiUrl: data.apiUrl,
    downloadUrl: data.downloadUrl,
    authorizationToken: data.authorizationToken,
    accountId: data.accountId,
    bucketId: data.allowed?.bucketId || bucketId,
    bucketName: data.allowed?.bucketName || bucketName,
    // Expire cache 4 hours before the 24-hour limit
    expiresAt: now + 20 * 60 * 60 * 1000,
  }

  return cachedAuth
}

export interface B2UploadResult {
  success: boolean
  url: string
  fileId: string
  fileName: string
  size: number
  contentType: string
}

/**
 * Uploads an image buffer directly to Backblaze B2 with verified headers.
 */
export async function uploadImageToB2(
  buffer: Buffer,
  fileName: string,
  contentType: string
): Promise<B2UploadResult> {
  const sha1 = crypto.createHash("sha1").update(buffer).digest("hex")
  const encodedFileName = fileName
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/")

  let lastError: Error | null = null

  // Backblaze B2 recommends requesting a fresh upload URL and retrying on transient 5xx/503 pod busy responses
  for (let attempt = 1; attempt <= 3; attempt++) {
    const auth = await getB2Auth()

    // 1. Obtain single-use upload URL for the target bucket
    const getUrlResponse = await fetch(`${auth.apiUrl}/b2api/v2/b2_get_upload_url`, {
      method: "POST",
      headers: {
        Authorization: auth.authorizationToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ bucketId: auth.bucketId }),
      cache: "no-store",
    })

    if (!getUrlResponse.ok) {
      const errorText = await getUrlResponse.text()
      cachedAuth = null
      lastError = new Error(`B2 get_upload_url error (${getUrlResponse.status}): ${errorText}`)
      continue
    }

    const { uploadUrl, authorizationToken: uploadToken } = await getUrlResponse.json()

    // 2. Upload binary file (preserve "/" directory separators for B2)
    const uploadResponse = await fetch(uploadUrl, {
      method: "POST",
      headers: {
        Authorization: uploadToken,
        "X-Bz-File-Name": encodedFileName,
        "Content-Type": contentType,
        "Content-Length": String(buffer.length),
        "X-Bz-Content-Sha1": sha1,
      },
      body: buffer,
      cache: "no-store",
    })

    if (uploadResponse.ok) {
      const uploadResult = await uploadResponse.json()
      const publicUrl = `${auth.downloadUrl}/file/${auth.bucketName}/${fileName}`

      return {
        success: true,
        url: publicUrl,
        fileId: uploadResult.fileId,
        fileName: uploadResult.fileName,
        size: buffer.length,
        contentType,
      }
    }

    const errorText = await uploadResponse.text()
    lastError = new Error(`B2 upload failed (${uploadResponse.status}): ${errorText}`)
    if (uploadResponse.status === 401) {
      cachedAuth = null
    }
    if (![401, 408, 429, 500, 502, 503, 504].includes(uploadResponse.status)) {
      break
    }
  }

  throw lastError || new Error("B2 upload failed after retries")
}

