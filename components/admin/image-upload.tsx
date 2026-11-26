"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Loader2, Image as ImageIcon } from "lucide-react"

interface ImageUploadProps {
  onImageUploadAction: (url: string) => void
  currentImage?: string
  altText?: string
}

export function ImageUpload({
  onImageUploadAction,
  currentImage,
  altText,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(currentImage || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setPreview(currentImage || null)
  }, [currentImage])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 3 * 1024 * 1024) {
      toast.error("Image must be less than 3MB")
      return
    }

    const previousPreview = preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    setIsUploading(true)
    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await fetch("/api/admin/upload", {
        method: "POST",
        credentials: "include",
        body: formData,
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(data.error || `Upload failed (HTTP ${response.status})`)
      }

      const rawUrl = data.url || data.filename
      if (!rawUrl || typeof rawUrl !== "string") {
        throw new Error("Upload succeeded but no image URL was returned")
      }

      const imageUrl =
        rawUrl.startsWith("http://") ||
        rawUrl.startsWith("https://") ||
        rawUrl.startsWith("/")
          ? rawUrl
          : `/${rawUrl}`

      setPreview(imageUrl)
      onImageUploadAction(imageUrl)
      toast.success("Image uploaded successfully")
    } catch (error) {
      console.error("Upload error:", error)
      setPreview(previousPreview)
      toast.error(
        error instanceof Error ? error.message : "Failed to upload image"
      )
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  return (
    <div className="space-y-4">
      {preview && (
        <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
          <img
            src={preview}
            alt={altText || "Featured image preview"}
            className="h-full w-full object-cover"
          />
        </div>
      )}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
        className="hidden"
      />
      <Button
        type="button"
        variant="outline"
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
      >
        {isUploading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            <ImageIcon className="mr-2 h-4 w-4" />
            {preview ? "Change Image" : "Upload Image"}
          </>
        )}
      </Button>
    </div>
  )
}
