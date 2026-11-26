import { prisma } from "@/lib/prisma"
import { BlogExplorer, BlogPostItem } from "@/components/blog-explorer"
import { Sparkles } from "lucide-react"
import { buildPageMetadata } from "@/lib/seo-metadata"
import { JsonLd, SITE_URL, buildBreadcrumbJsonLd } from "@/components/json-ld"

export const dynamic = "force-dynamic"
export const revalidate = 0

export const metadata = buildPageMetadata({
  title: "Travel, Hotel & IKEA Guides Blog | GoComfortUSA",
  description:
    "Practical US guides on domestic flight booking, hotel resort fees and total-price checks, IKEA Click and Collect, and personal shopping from GoComfortUSA.",
  path: "/blog",
  keywords:
    "travel blog, US flights guide, hotel resort fees, IKEA Click and Collect, IKEA personal shopper, GoComfortUSA",
})

function formatAuthor(rawName?: string | null, categoryLabel?: string): string {
  if (
    !rawName ||
    rawName.toLowerCase().includes("muse") ||
    rawName.toLowerCase().includes("admin")
  ) {
    if (categoryLabel?.includes("Flight")) return "GoComfort Flight Desk"
    if (categoryLabel?.includes("Park")) return "GoComfort Park Concierge"
    return "GoComfort Editorial Desk"
  }
  return rawName
}

function categorizeBlog(
  title: string,
  slug: string
): { category: BlogPostItem["category"]; label: string; fallbackImage: string } {
  const text = `${title} ${slug}`.toLowerCase()
  if (
    text.includes("flight") ||
    text.includes("air") ||
    text.includes("hotel") ||
    text.includes("travel") ||
    text.includes("plane")
  ) {
    return {
      category: "flights",
      label: text.includes("hotel") ? "Hotel & Stays" : "Flight Strategy",
      fallbackImage: text.includes("hotel") ? "/ass/slider_2.jpg" : "/ass/flight united.jpg",
    }
  }
  if (
    text.includes("disney") ||
    text.includes("park") ||
    text.includes("universal") ||
    text.includes("ticket")
  ) {
    return {
      category: "parks",
      label: "Theme Parks",
      fallbackImage: "/ass/disneyland-01.jpg",
    }
  }
  return {
    category: "living",
    label: "Home Living",
    fallbackImage: "/ass/ikea.jpg",
  }
}

async function getPublishedBlogs(): Promise<BlogPostItem[]> {
  try {
    const dbBlogs = await prisma.blog.findMany({
      where: {
        published: true,
      },
      include: {
        author: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return dbBlogs.map((b, idx) => {
      const catInfo = categorizeBlog(b.title, b.slug)
      const dateObj = new Date(b.createdAt)
      const formattedDate = dateObj.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })

      return {
        id: b.id,
        title: b.title,
        slug: b.slug,
        excerpt:
          b.excerpt ||
          b.content?.replace(/<[^>]*>/g, "").substring(0, 160) + "...",
        image: b.image || catInfo.fallbackImage,
        imageAlt: (b as any).imageAlt || b.title,
        category: catInfo.category,
        categoryLabel: catInfo.label,
        readingTime: `${Math.max(3, Math.ceil((b.content?.length || 500) / 750))} min read`,
        createdAt: formattedDate,
        authorName: formatAuthor(b.author?.name, catInfo.label),
        featured: idx === 0,
      }
    })
  } catch (error) {
    console.error("Error fetching published blogs from database:", error)
    return []
  }
}

export default async function BlogPage() {
  const posts = await getPublishedBlogs()
  const breadcrumbSchema = buildBreadcrumbJsonLd([
    { name: "Home", url: SITE_URL },
    { name: "Blog", url: `${SITE_URL}/blog` },
  ])

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <div className="min-h-screen bg-[#F4F7FB] dark:bg-[#181818] text-slate-900 dark:text-neutral-100 antialiased">
        {/* Blog Hero Header */}
        <section className="py-14 sm:py-20 bg-[#EEF4FB] dark:bg-[#181818] border-b border-blue-100/80 dark:border-neutral-800">
          <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
            <div className="max-w-[680px] mx-auto text-center space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold bg-blue-600/10 dark:bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900/50">
                <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>Concierge Research Desk</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight leading-tight [text-wrap:balance] bg-gradient-to-r from-slate-950 via-slate-900 to-slate-600 dark:from-white dark:to-neutral-400 bg-clip-text text-transparent">
                Travel insights, booking strategies, and living guides
              </h1>

              <p className="text-base sm:text-lg text-slate-600 dark:text-neutral-400 [text-wrap:pretty] leading-relaxed">
                Curated playbooks from our booking specialists to help American families navigate domestic flights, hotel total-price checks, and IKEA ordering.
              </p>
            </div>
          </div>
        </section>

        {/* Main Blog Catalog & Interactive Explorer */}
        <section className="py-12 sm:py-16">
          <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
            <BlogExplorer initialPosts={posts} />
          </div>
        </section>
      </div>
    </>
  )
}
