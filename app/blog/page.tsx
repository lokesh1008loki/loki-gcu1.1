import { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { BlogExplorer, BlogPostItem } from "@/components/blog-explorer"
import { Sparkles } from "lucide-react"

export const dynamic = "force-dynamic"
export const revalidate = 0

export const metadata: Metadata = {
  title: "Travel and Living Blog | GoComfort USA Research Desk",
  description:
    "Expert travel research, airline booking strategies, theme park ticket discounts, and domestic living guides from GoComfortUSA specialists.",
  keywords:
    "travel blog, cheap flights, theme park tickets, disneyland discounts, utility bill relief, ikea delivery deals, GoComfortUSA",
  alternates: {
    canonical: "https://gocomfortusa.com/blog",
  },
  openGraph: {
    title: "Travel and Living Blog | GoComfort USA",
    description:
      "Actionable travel hacks, airline booking strategies, and domestic living guides.",
    type: "website",
    url: "https://gocomfortusa.com/blog",
  },
}

// Fallback high-quality blueprints if database connection has temporary latency
const STATIC_FALLBACK_POSTS: BlogPostItem[] = [
  {
    id: "post-1",
    title: "How to Book Cheap Christmas Flights in 2026 (and Actually Get Home for Less)",
    slug: "how-to-book-cheap-christmas-flights-in-2026-and-actually-get-home-for-less",
    excerpt:
      "Flying home for Christmas? Discover the exact calendar window to book, which days cost less, and how our flight research secures domestic US fares before airline algorithms spike.",
    image: "/ass/flight united.jpg",
    category: "flights",
    categoryLabel: "Flight Strategy",
    readingTime: "5 min read",
    createdAt: "Nov 5, 2026",
    authorName: "GoComfort Flight Desk",
    featured: true,
  },
  {
    id: "post-2",
    title: "How to Save 50% on Domestic Flights: Insider Airline Booking Strategies",
    slug: "how-to-save-50-percent-on-domestic-flights",
    excerpt:
      "Avoid hidden carrier fees, optimize multi-city routes, and learn how authorized partner channels unlock up to 30 to 50 percent lower airfares on major carriers.",
    image: "/ass/slider_1.jpg",
    category: "flights",
    categoryLabel: "Flight Strategy",
    readingTime: "7 min read",
    createdAt: "Nov 3, 2026",
    authorName: "Aviation Research Team",
  },
  {
    id: "post-3",
    title: "How to Save Money on Theme Park Tickets: Disneyland, Universal & Water Parks",
    slug: "how-to-save-money-on-theme-park-tickets",
    excerpt:
      "Everything you need to know about skipping long box office queues and getting legitimate promotional tickets for Disneyland Resort, Universal Studios, and water parks.",
    image: "/ass/disneyland-01.jpg",
    category: "parks",
    categoryLabel: "Theme Parks",
    readingTime: "6 min read",
    createdAt: "Oct 28, 2026",
    authorName: "Park Concierge",
  },
  {
    id: "post-4",
    title: "IKEA Click and Collect: How It Works, and How Someone Else Can Pick Up Your Order",
    slug: "ikea-click-and-collect-how-it-works-and-how-someone-else-can-pick-up-your-order",
    excerpt:
      "Skip the warehouse maze and collect your order with zero headache. Learn how long IKEA holds orders and how to authorize a third party delivery courier.",
    image: "/ass/ikea.jpg",
    category: "living",
    categoryLabel: "Home Living",
    readingTime: "4 min read",
    createdAt: "Oct 22, 2026",
    authorName: "Living & Order Desk",
  },
  {
    id: "post-5",
    title: "How to Get the Cheapest IKEA Deals with Delivery – GoComfortUSA",
    slug: "how-to-get-the-cheapest-ikea-deals-with-delivery-gocomfortusa",
    excerpt:
      "Order IKEA products at the lowest rates in the market with pickup and delivery included. Learn how our concierge team coordinates furniture orders directly to your door.",
    image: "/ass/slider_4.jpg",
    category: "living",
    categoryLabel: "Home Living",
    readingTime: "5 min read",
    createdAt: "Oct 15, 2026",
    authorName: "Living & Order Desk",
  },
  {
    id: "post-6",
    title: "Why Your Hotel Costs More at Checkout: Resort Fees, Taxes and the Total-Price Check",
    slug: "why-your-hotel-costs-more-at-checkout-resort-fees-taxes-and-the-total-price-check",
    excerpt:
      "The nightly rate is not the price. Resort fees, destination fees and taxes are why the total jumps at checkout — what changed under the FTC's 2025 total-price rule, and the five-minute check that stops the surprise.",
    image: "/ass/slider_2.jpg",
    category: "flights",
    categoryLabel: "Hotel & Stays",
    readingTime: "6 min read",
    createdAt: "Nov 10, 2026",
    authorName: "GoComfort Editorial Desk",
  },
]

function formatAuthor(rawName?: string | null, categoryLabel?: string): string {
  if (!rawName || rawName.toLowerCase().includes("muse") || rawName.toLowerCase().includes("admin")) {
    if (categoryLabel?.includes("Flight")) return "GoComfort Flight Desk"
    if (categoryLabel?.includes("Park")) return "GoComfort Park Concierge"
    return "GoComfort Editorial Desk"
  }
  return rawName
}

function categorizeBlog(title: string, slug: string): { category: BlogPostItem["category"]; label: string; fallbackImage: string } {
  const text = `${title} ${slug}`.toLowerCase()
  if (text.includes("flight") || text.includes("air") || text.includes("travel") || text.includes("plane")) {
    return { category: "flights", label: "Flight Strategy", fallbackImage: "/ass/flight united.jpg" }
  }
  if (text.includes("disney") || text.includes("park") || text.includes("universal") || text.includes("ticket")) {
    return { category: "parks", label: "Theme Parks", fallbackImage: "/ass/disneyland-01.jpg" }
  }
  return { category: "living", label: "Home Living", fallbackImage: "/ass/ikea.jpg" }
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

    if (dbBlogs && dbBlogs.length > 0) {
      // Map DB blogs and merge with static knowledge
      const mapped: BlogPostItem[] = dbBlogs.map((b, idx) => {
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
          excerpt: b.excerpt || b.content?.replace(/<[^>]*>/g, "").substring(0, 160) + "...",
          image: b.image || catInfo.fallbackImage,
          category: catInfo.category,
          categoryLabel: catInfo.label,
          readingTime: `${Math.max(3, Math.ceil((b.content?.length || 500) / 750))} min read`,
          createdAt: formattedDate,
          authorName: formatAuthor(b.author?.name, catInfo.label),
          featured: idx === 0,
        }
      })

      // Add static guides if not already in DB
      for (const staticPost of STATIC_FALLBACK_POSTS) {
        if (!mapped.some((m) => m.slug === staticPost.slug)) {
          mapped.push(staticPost)
        }
      }

      return mapped
    }
  } catch (error) {
    console.warn("Notice: Database momentarily unavailable for blogs, serving static fallback articles:", error)
  }

  return STATIC_FALLBACK_POSTS
}

export default async function BlogPage() {
  const posts = await getPublishedBlogs()

  return (
    <div className="min-h-screen bg-[#F4F7FB] dark:bg-[#181818] text-slate-900 dark:text-neutral-100 antialiased">
      
      {/* Blog Hero Header (Skill.md B5: Max width 680px, left-to-right text gradient, no hyphens) */}
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
              Curated playbooks from our booking specialists to help American families navigate flight schedules, theme park admissions, and everyday household expenses.
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
  )
}