export type UserRole = "superadmin" | "editor" | "moderator"

export interface User {
  id: string
  email: string
  name: string
  role: string
  createdAt: string
  updatedAt: string
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  featuredImage: string
  status: "published" | "draft"
  author: User
  metaTitle?: string
  metaDescription?: string
  metaKeywords?: string[]
  createdAt: string
  updatedAt: string
}

export interface PopupMessage {
  id: string
  content: string
  startDate: string
  endDate: string
  priority: "high" | "medium" | "low"
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface SocialLink {
  id: string
  platform: string
  icon: string
  url: string
  createdAt: string
  updatedAt: string
}

export interface ContentSection {
  id: string
  page: string
  section: string
  content: string
  images: string[]
  createdAt: string
  updatedAt: string
}

export interface BookingSubmission {
  id: string
  section: string
  data: Record<string, any>
  createdAt: string
} 