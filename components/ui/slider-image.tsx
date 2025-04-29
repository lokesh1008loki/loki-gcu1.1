"use client"

import Image from "next/image"

interface SliderImageProps {
  src: string
  alt: string
  width: number
  height: number
  priority?: boolean
  loading?: "eager" | "lazy"
  quality?: number
  sizes?: string
  onLoadingComplete?: () => void
}

export default function SliderImage({
  src,
  alt,
  width,
  height,
  priority = false,
  loading = "lazy",
  quality = 75,
  sizes,
  onLoadingComplete
}: SliderImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className="object-cover w-full h-full"
      priority={priority}
      loading={loading}
      quality={quality}
      sizes={sizes}
      onLoadingComplete={onLoadingComplete}
    />
  )
} 