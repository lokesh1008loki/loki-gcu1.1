import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, ArrowLeft, Facebook, Twitter, Linkedin, Share2, Clock, Sparkles, ChevronRight, ShieldCheck } from "lucide-react"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"
export const revalidate = 0

type Blog = {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string | null
  image: string | null
  metaTitle: string | null
  metaDescription: string | null
  keywords: string | null
  seoContent: string | null
  canonicalUrl: string | null
  published: boolean
  authorId: string
  createdAt: Date
  updatedAt: Date
}

type BlogWithAuthor = Blog & {
  author: {
    name: string
  }
}

// Fallback articles for resilience
const STATIC_SLUG_CONTENT: Record<string, Partial<BlogWithAuthor>> = {
  "how-to-book-cheap-christmas-flights-in-2026-and-actually-get-home-for-less": {
    title: "How to Book Cheap Christmas Flights in 2026 (and Actually Get Home for Less)",
    slug: "how-to-book-cheap-christmas-flights-in-2026-and-actually-get-home-for-less",
    image: "/ass/flight united.jpg",
    createdAt: new Date("2026-11-05"),
    author: { name: "GoComfort Flight Desk" },
    excerpt: "Flying home for Christmas? Discover the exact calendar window to book, which days cost less, and how our flight research secures domestic US fares before airline algorithms spike.",
    content: `
      <h2>The Reality of Holiday Airfare Pricing</h2>
      <p>Airlines know that December travel is non negotiable for most families. Yield management algorithms begin adjusting seat inventories as early as September, steadily removing cheaper fare buckets until only full-fare coach tickets remain.</p>
      
      <h2>1. The 54 Day Booking Rule</h2>
      <p>Historical booking data confirms that domestic US holiday airfare reaches its optimal price window roughly 54 to 45 days before departure. Waiting until December almost guarantees paying double the standard fare.</p>

      <h2>2. Fly on Off Peak Days</h2>
      <p>Avoiding travel on Friday, December 18 and Sunday, December 27 can cut your ticket price by 30 to 40 percent. Departing early morning on Christmas Eve or returning on New Year's Day morning frequently opens up wholesale partner seats that stay hidden on consumer booking portals.</p>

      <h2>3. Let Specialists Audit Route Options</h2>
      <p>Instead of manually refreshing travel sites, GoComfortUSA evaluates direct airline partner inventory, mixed-carrier connections, and authorized route waivers so you secure true cost bookings with zero hidden markups.</p>
    `,
  },
  "how-to-save-50-percent-on-domestic-flights": {
    title: "How to Save 50% on Domestic Flights: Insider Airline Booking Strategies",
    slug: "how-to-save-50-percent-on-domestic-flights",
    image: "/ass/slider_1.jpg",
    createdAt: new Date("2026-11-03"),
    author: { name: "Aviation Research Team" },
    excerpt: "Avoid hidden carrier fees, optimize multi-city routes, and learn how authorized partner channels unlock up to 30 to 50 percent lower airfares on major carriers.",
    content: `
      <h2>The Flaws in Standard Flight Search Engines</h2>
      <p>Most flight comparison websites prioritize airlines that pay affiliate commissions. They frequently bundle restrictive fare classes with hidden baggage fees and separate seat selection charges.</p>
      
      <h2>Key Strategies for Maximum Savings:</h2>
      <ul>
        <li><strong>Split-Ticket Routing:</strong> Booking outbound and return journeys on separate partner carriers often saves hundreds compared to a traditional round-trip ticket.</li>
        <li><strong>Nearby Regional Hubs:</strong> Evaluating secondary airports (such as Oakland instead of San Francisco, or Fort Lauderdale instead of Miami) unlocks lower municipal airport fees.</li>
        <li><strong>Direct Wholesale Desk Reconciliations:</strong> Working with our concierge desk allows travelers to access negotiated corporate rates without subscription fees.</li>
      </ul>
    `,
  },
  "how-to-save-money-on-theme-park-tickets": {
    title: "How to Save Money on Theme Park Tickets: Disneyland, Universal & Water Parks",
    slug: "how-to-save-money-on-theme-park-tickets",
    image: "/ass/disneyland-01.jpg",
    createdAt: new Date("2026-10-28"),
    author: { name: "Park Concierge" },
    excerpt: "Everything you need to know about skipping long box office queues and getting legitimate promotional tickets for Disneyland Resort, Universal Studios, and water parks.",
    content: `
      <h2>Navigating Theme Park Ticket Tiers</h2>
      <p>Theme park ticket prices fluctuate based on attendance calendar tiers, seasonal promotions, and multi-day ticket packages. Buying tickets at the gate is universally the most expensive method.</p>
      
      <h2>Authorized Partner Access:</h2>
      <p>GoComfortUSA coordinates directly with authorized admission wholesalers. You receive official park barcodes and confirmation numbers that link directly into your official Disneyland or Universal mobile application, skipping box office queues completely.</p>
    `,
  },
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string } | Promise<{ slug: string }>
}): Promise<Metadata> {
  const resolvedParams = await Promise.resolve(params)
  const slug = resolvedParams?.slug

  if (!slug) {
    return {
      title: "Blog Post Not Found | GoComfort USA",
      description: "The requested blog post could not be found.",
    }
  }

  let blog: any = null
  try {
    blog = await (prisma as any).blog.findUnique({
      where: { slug },
      include: { author: true },
    })
  } catch (error) {
    console.warn("Notice: Database momentarily unavailable for metadata lookup:", error)
  }

  if (!blog && STATIC_SLUG_CONTENT[slug]) {
    blog = STATIC_SLUG_CONTENT[slug]
  }

  if (!blog) {
    return {
      title: "Blog Post Not Found | GoComfort USA",
      description: "The requested blog post could not be found.",
    }
  }

  return {
    title: `${blog.metaTitle || blog.title} | GoComfort USA`,
    description: blog.metaDescription || blog.excerpt || undefined,
    openGraph: {
      title: blog.metaTitle || blog.title,
      description: blog.metaDescription || blog.excerpt || undefined,
      images: blog.image ? [{ url: blog.image }] : undefined,
      type: "article",
    },
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string } | Promise<{ slug: string }>
}) {
  const resolvedParams = await Promise.resolve(params)
  const slug = resolvedParams?.slug

  if (!slug) {
    notFound()
  }

  let blog: any = null
  let relatedPosts: any[] = []

  try {
    blog = await (prisma as any).blog.findUnique({
      where: { slug },
      include: { author: true },
    })

    if (blog) {
      relatedPosts = await (prisma as any).blog.findMany({
        where: {
          id: { not: blog.id },
          published: true,
        },
        take: 3,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          author: {
            select: { name: true },
          },
        },
      })
    }
  } catch (error) {
    console.warn("Notice: Database momentarily unavailable for blog post lookup, serving fallback:", error)
  }

  if (!blog && STATIC_SLUG_CONTENT[slug]) {
    blog = STATIC_SLUG_CONTENT[slug]
  }

  if (!blog) {
    notFound()
  }

  const formattedDate = new Date(blog.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="min-h-screen bg-[#F4F7FB] dark:bg-[#181818] text-slate-900 dark:text-neutral-100 antialiased py-10 sm:py-16">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-neutral-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to all guides</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Main Article Body */}
          <article className="lg:col-span-8 bg-white dark:bg-[#1F1F1F] rounded-3xl p-6 sm:p-10 border border-slate-200/80 dark:border-neutral-800 shadow-xs space-y-8">
            
            {/* Title & Metadata */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-neutral-400">
                <span className="font-semibold text-blue-600 dark:text-blue-400">
                  Concierge Blueprint
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 font-mono">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{formattedDate}</span>
                </span>
                <span>•</span>
                <span>By {blog.author?.name || "GoComfort Specialist"}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight leading-tight text-slate-900 dark:text-white [text-wrap:balance]">
                {blog.title}
              </h1>

              {blog.excerpt && (
                <p className="text-base sm:text-lg text-slate-600 dark:text-neutral-300 leading-relaxed [text-wrap:pretty]">
                  {blog.excerpt}
                </p>
              )}
            </div>

            {/* Featured Image */}
            {blog.image && (
              <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-slate-100 dark:bg-neutral-800 border border-slate-200/80 dark:border-neutral-800">
                <Image
                  src={blog.image}
                  alt={blog.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            {/* Content HTML */}
            <div
              className="prose prose-slate dark:prose-invert max-w-none text-slate-700 dark:text-neutral-300 leading-relaxed space-y-4 font-normal"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />

            {/* Share Footer */}
            <div className="pt-6 border-t border-slate-100 dark:border-neutral-800 flex flex-wrap items-center justify-between gap-4">
              <span className="text-xs font-semibold text-slate-600 dark:text-neutral-400">
                Share this guide
              </span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="rounded-xl h-9 text-xs">
                  <Facebook className="h-3.5 w-3.5 mr-1.5" />
                  Facebook
                </Button>
                <Button variant="outline" size="sm" className="rounded-xl h-9 text-xs">
                  <Twitter className="h-3.5 w-3.5 mr-1.5" />
                  Twitter
                </Button>
                <Button variant="outline" size="sm" className="rounded-xl h-9 text-xs">
                  <Linkedin className="h-3.5 w-3.5 mr-1.5" />
                  LinkedIn
                </Button>
              </div>
            </div>

          </article>

          {/* Right Sidebar: Concierge Booking Desk */}
          <aside className="lg:col-span-4 space-y-6 sticky top-24">
            
            {/* Concierge Action Box */}
            <div className="rounded-2xl border border-blue-500/40 bg-blue-600 text-white p-6 shadow-sm space-y-4">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/15 text-xs font-semibold uppercase tracking-wider text-blue-100">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Concierge Audit</span>
              </div>
              <h3 className="text-lg font-semibold tracking-tight text-white [text-wrap:balance]">
                Need this itinerary or ticket booked for you?
              </h3>
              <p className="text-xs text-blue-100 leading-relaxed [text-wrap:pretty]">
                Skip the hours of research. Our specialists audit routes, wholesale ticket inventory, and partner waivers for your exact dates.
              </p>
              <Link
                href="/contact"
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white text-blue-600 hover:bg-blue-50 font-semibold text-xs shadow-xs active:scale-[0.98] transition-all"
              >
                <span>Request itinerary audit</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Satisfaction Guarantee Badge */}
            <div className="rounded-2xl border border-slate-200/80 dark:border-neutral-800 bg-white dark:bg-[#1F1F1F] p-5 shadow-xs flex items-start gap-3 text-xs">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-semibold text-slate-900 dark:text-white block">
                  Verified True Cost Guarantee
                </span>
                <span className="text-slate-500 dark:text-neutral-400 block leading-relaxed">
                  Every booking recommendation is issued under direct carrier reservations with zero middleman markups.
                </span>
              </div>
            </div>

            {/* Related Guides */}
            {relatedPosts.length > 0 && (
              <div className="rounded-2xl border border-slate-200/80 dark:border-neutral-800 bg-white dark:bg-[#1F1F1F] p-6 shadow-xs space-y-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white">
                  Related research guides
                </h4>
                <div className="space-y-3">
                  {relatedPosts.map((post: any) => (
                    <Link
                      key={post.id}
                      href={`/blog/${post.slug}`}
                      className="block p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-[#272727] transition-colors group"
                    >
                      <h5 className="text-xs font-semibold text-slate-800 dark:text-neutral-200 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {post.title}
                      </h5>
                      <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                        {new Date(post.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

          </aside>

        </div>

      </div>
    </div>
  )
}