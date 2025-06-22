"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface SeoUpdaterProps {
  seoSettings?: {
    siteTitle: string
    siteDescription: string
    keywords: string
    ogTitle: string
    ogDescription: string
    ogImage: string
    twitterTitle: string
    twitterDescription: string
    twitterImage: string
    canonicalUrl: string
  }
}

export function SeoUpdater({ seoSettings }: SeoUpdaterProps) {
  const router = useRouter()

  useEffect(() => {
    if (!seoSettings) return

    // Update document title
    document.title = seoSettings.siteTitle

    // Update meta tags
    const updateMetaTag = (name: string, content: string) => {
      let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement
      if (!meta) {
        meta = document.createElement('meta')
        meta.name = name
        document.head.appendChild(meta)
      }
      meta.content = content
    }

    const updatePropertyTag = (property: string, content: string) => {
      let meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement
      if (!meta) {
        meta = document.createElement('meta')
        meta.setAttribute('property', property)
        document.head.appendChild(meta)
      }
      meta.content = content
    }

    // Update basic meta tags
    updateMetaTag('description', seoSettings.siteDescription)
    updateMetaTag('keywords', seoSettings.keywords)

    // Update Open Graph tags
    updatePropertyTag('og:title', seoSettings.ogTitle)
    updatePropertyTag('og:description', seoSettings.ogDescription)
    updatePropertyTag('og:image', seoSettings.ogImage)
    updatePropertyTag('og:url', seoSettings.canonicalUrl)

    // Update Twitter tags
    updatePropertyTag('twitter:title', seoSettings.twitterTitle)
    updatePropertyTag('twitter:description', seoSettings.twitterDescription)
    updatePropertyTag('twitter:image', seoSettings.twitterImage)

    // Update canonical URL
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.href = seoSettings.canonicalUrl

  }, [seoSettings])

  return null // This component doesn't render anything
}

// Hook to fetch and update SEO settings
export function useSeoUpdate() {
  const updateSeoSettings = async () => {
    try {
      const response = await fetch('/api/seo', {
        cache: 'no-store'
      })
      
      if (response.ok) {
        const seoSettings = await response.json()
        return seoSettings
      }
    } catch (error) {
      console.error('Error fetching SEO settings:', error)
    }
    return null
  }

  return { updateSeoSettings }
} 