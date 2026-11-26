import React from "react"

export const SITE_URL = "https://gocomfortusa.com"

export const ORGANIZATION_ID = `${SITE_URL}/#organization`

export const ORGANIZATION_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": ORGANIZATION_ID,
  name: "GoComfortUSA",
  url: SITE_URL,
  logo: `${SITE_URL}/ass/logo-round.png`,
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    email: "support@gocomfortusa.com",
    telephone: "+1-442-286-9606",
    areaServed: "US",
    availableLanguage: "English",
  },
  sameAs: ["https://www.instagram.com/gocomfort.usa/"],
}

export const ORGANIZATION_REF = {
  "@type": "Organization",
  "@id": ORGANIZATION_ID,
  name: "GoComfortUSA",
  url: SITE_URL,
  logo: {
    "@type": "ImageObject",
    url: `${SITE_URL}/ass/logo-round.png`,
  },
}

export function buildBreadcrumbJsonLd(
  items: Array<{ name: string; url: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

export function buildFaqPageJsonLd(
  faqs: Array<{ question: string; answer: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  }
}

export function buildServiceJsonLd(opts: {
  name: string
  description: string
  url: string
  serviceType: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: opts.name,
    serviceType: opts.serviceType,
    description: opts.description,
    url: opts.url,
    provider: {
      "@type": "Organization",
      "@id": ORGANIZATION_ID,
      name: "GoComfortUSA",
      url: SITE_URL,
    },
    areaServed: {
      "@type": "Country",
      name: "United States",
    },
  }
}

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  )
}
