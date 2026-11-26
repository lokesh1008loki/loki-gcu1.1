import type { Metadata } from "next"

export const SITE_URL = "https://gocomfortusa.com"

interface PageMetadataOptions {
  title: string
  description: string
  path: string
  keywords?: string
  type?: "website" | "article"
  ogImage?: string
  ogImageAlt?: string
}

export function buildPageMetadata({
  title,
  description,
  path,
  keywords,
  type = "website",
  ogImage = "/ass/logo-round.png",
  ogImageAlt = "GoComfortUSA",
}: PageMetadataOptions): Metadata {
  const normalizedPath =
    path === "/" || path === "" ? "" : `/${path.replace(/^\/+|\/+$/g, "")}`
  const canonicalUrl = normalizedPath ? `${SITE_URL}${normalizedPath}` : SITE_URL

  return {
    title,
    description,
    ...(keywords ? { keywords } : {}),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "GoComfortUSA",
      type,
      images: [
        {
          url: ogImage,
          alt: ogImageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  }
}
