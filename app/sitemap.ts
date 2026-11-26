import { MetadataRoute } from "next"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"
export const revalidate = 0

const SITE_URL = "https://gocomfortusa.com"

const STATIC_PUBLIC_ROUTES: Array<{
  path: string
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]
  priority: number
}> = [
  { path: "", changeFrequency: "weekly", priority: 1.0 },
  { path: "/travel/flight", changeFrequency: "weekly", priority: 0.9 },
  { path: "/travel/hotel", changeFrequency: "weekly", priority: 0.9 },
  { path: "/others/ikea", changeFrequency: "weekly", priority: 0.9 },
  { path: "/tickets/disneyland", changeFrequency: "weekly", priority: 0.9 },
  { path: "/travel/train", changeFrequency: "monthly", priority: 0.8 },
  { path: "/travel/bus", changeFrequency: "monthly", priority: 0.8 },
  { path: "/travel/car-rental", changeFrequency: "monthly", priority: 0.8 },
  { path: "/travel/cruise", changeFrequency: "monthly", priority: 0.8 },
  { path: "/tickets/universal-studios", changeFrequency: "monthly", priority: 0.8 },
  { path: "/tickets/sea-world", changeFrequency: "monthly", priority: 0.8 },
  { path: "/tickets/water-park", changeFrequency: "monthly", priority: 0.8 },
  { path: "/tickets/adventure-park", changeFrequency: "monthly", priority: 0.8 },
  { path: "/tickets/city-pass", changeFrequency: "monthly", priority: 0.8 },
  { path: "/tickets/other-parks", changeFrequency: "monthly", priority: 0.8 },
  { path: "/others/food-grocery", changeFrequency: "monthly", priority: 0.8 },
  { path: "/bills/apartment-rental", changeFrequency: "monthly", priority: 0.8 },
  { path: "/bills/utility", changeFrequency: "monthly", priority: 0.8 },
  { path: "/blog", changeFrequency: "daily", priority: 0.9 },
  { path: "/about", changeFrequency: "monthly", priority: 0.8 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.8 },
  { path: "/faq", changeFrequency: "monthly", priority: 0.8 },
  { path: "/privacy-policy", changeFrequency: "yearly", priority: 0.4 },
  { path: "/terms-of-service", changeFrequency: "yearly", priority: 0.4 },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticLastMod = new Date("2026-11-26T00:00:00.000Z")

  let publishedBlogs: Array<{ slug: string; updatedAt: Date; createdAt: Date }> = []
  try {
    publishedBlogs = await prisma.blog.findMany({
      where: { published: true },
      select: {
        slug: true,
        updatedAt: true,
        createdAt: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    })
  } catch (error) {
    console.error("Failed to fetch published blogs for sitemap:", error)
  }

  const latestBlogDate =
    publishedBlogs.length > 0
      ? publishedBlogs[0].updatedAt || publishedBlogs[0].createdAt
      : staticLastMod

  const staticEntries: MetadataRoute.Sitemap = STATIC_PUBLIC_ROUTES.map((route) => ({
    url: route.path ? `${SITE_URL}${route.path}` : SITE_URL,
    lastModified: route.path === "/blog" ? latestBlogDate : staticLastMod,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }))

  const blogEntries: MetadataRoute.Sitemap = publishedBlogs.map((blog) => ({
    url: `${SITE_URL}/blog/${blog.slug}`,
    lastModified: blog.updatedAt || blog.createdAt,
    changeFrequency: "weekly",
    priority: 0.7,
  }))

  return [...staticEntries, ...blogEntries]
}
