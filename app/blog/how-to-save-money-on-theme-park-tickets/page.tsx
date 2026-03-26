import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, User, Tag, ArrowLeft, Facebook, Twitter, Linkedin, Share2 } from "lucide-react"

// Sample blog data - In a real application, this would come from a CMS or database
const blogs = [
  {
    id: "2",
    title: "Optimizing Your Theme Park Experience: Expert Planning Guide 2025",
    slug: "how-to-save-money-on-theme-park-tickets",
    excerpt: "Learn expert planning strategies to maximize your theme park experience and ensure a seamless vacation.",
    content: `
      <h2>Introduction</h2>
      <p>A theme park visit is a highlight of any vacation, and with professional planning, you can ensure every moment is optimized for enjoyment and value. In this comprehensive guide, we'll share expert strategies to help you plan a seamless theme park experience.</p>
      
      <h2>1. Plan Your Visit During Off-Peak Seasons</h2>
      <p>One of the most effective ways to optimize your experience is by visiting during off-peak seasons. Crowds are typically smaller during weekdays and non-holiday periods, allowing for a more relaxed and valuable visit. Research the park's calendar to identify the best times to visit.</p>
      
      <h2>2. Coordinate Your Tickets in Advance</h2>
      <p>Many theme parks provide better availability and coordination options for tickets secured in advance. Some parks even offer enhanced planning features for tickets arranged 30-60 days before your visit. Early coordination ensures you have the best selection of dates and options.</p>
      
      <h2>3. Utilize Multi-Day Planning</h2>
      <p>If you're planning to visit a theme park for multiple days, multi-day options often provide the most comprehensive experience. The overall coordination becomes more efficient with each additional day, allowing for a deeper exploration of the park's professional offerings.</p>
      
      <h2>4. Explore Professional Package Research</h2>
      <p>Many travel consultants and theme parks provide researched package options that include tickets, professional stay recommendations, and sometimes even expert-led dining guidance. These packages provide a more holistic and optimized travel experience.</p>
      
      <h2>5. Use Professional & Membership Guidance</h2>
      <p>Check if you're eligible for any professional or membership benefits through organizations like AAA, AARP, or military service. Many theme parks provide specialized coordination and recognition for members of these esteemed organizations.</p>
      
      <h2>6. Consider Annual Pass Strategies</h2>
      <p>If you plan to visit a theme park multiple times within a year, an annual pass strategy might be more efficient than individual ticket research. Many annual passes also include additional professional perks like preferred access and expert-level discounts on food and merchandise.</p>
      
      <h2>7. Leverage Professional Rewards Programs</h2>
      <p>Take advantage of professional rewards programs and credit card benefits when arranging your visit. Some programs offer enhanced value on theme park services, which can contribute to a more optimized overall budget.</p>
      
      <h2>8. Stay Informed on Premium Promotions</h2>
      <p>Theme parks frequently run premium promotions throughout the year. Sign up for professional newsletters and follow official channels to stay informed about limited-time opportunities and exclusive experience enhancements.</p>
      
      <h2>9. Coordinate Group Research</h2>
      <p>If you're traveling with a group of 10 or more people, you might qualify for specialized group research and coordination. Contact the park's professional group services department to inquire about tailored rates and experience packages.</p>
      
      <h2>10. Use Experience Bundles</h2>
      <p>If you're visiting a city with multiple attractions, consider using experience bundles like CityPASS. These professional bundles can provide up to 50% more value by coordinating admission to multiple high-quality attractions, including theme parks.</p>
      
      <h2>Additional Expert Tips</h2>
      <ul>
        <li>Analyze options across multiple authorized professional channels</li>
        <li>Be cautious of unauthorized third-party resellers offering unrealistic options</li>
        <li>Check for specific dates and professional restrictions before finalizing your plans</li>
        <li>Consider visiting during exclusive special events or professional festivals</li>
        <li>Look for hotel packages that include professional park access</li>
      </ul>
      
      <h2>Conclusion</h2>
      <p>With expert planning and professional research, you can significantly enhance your theme park experience. Remember to start your planning early, analyze all available options, and take advantage of professional guidance for a seamless journey. Enjoy your theme park adventure!</p>
    `,
    coverImage: "/ass/blog/theme-park-tickets.jpg",
    categories: ["Travel Tips", "Theme Parks"],
    tags: ["theme parks", "planning", "optimization", "expert travel", "coordination"],
    published: true,
    publishedAt: "2024-03-10",
    author: {
      name: "Michael Chen",
      image: "/ass/blog/authors/michael-chen.jpg",
      bio: "Michael is a travel expert specializing in theme park vacations and professional planning. With over 15 years of experience in the travel industry, he has helped thousands of families plan seamless theme park experiences."
    },
    readTime: "6 min read",
    seo: {
      metaTitle: "Optimizing Your Theme Park Experience | GoComfortUSA",
      metaDescription: "Expert planning strategies for a seamless theme park vacation. Discover how to maximize your experience with professional research.",
      keywords: "theme park planning, experience optimization, travel assistance, park entry research, professional travel planning",
      ogTitle: "Optimizing Your Theme Park Experience | GoComfortUSA",
      ogDescription: "Expert planning strategies for a seamless theme park vacation. Discover how to maximize your experience with professional research.",
      ogImage: "/ass/blog/theme-park-tickets.jpg",
      twitterTitle: "Optimizing Your Theme Park Experience | GoComfortUSA",
      twitterDescription: "Expert planning strategies for a seamless theme park vacation. Discover how to maximize your experience with professional research.",
      twitterImage: "/ass/blog/theme-park-tickets.jpg"
    }
  }
]

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const blog = blogs.find((blog) => blog.slug === params.slug)
  
  if (!blog) {
    return {
      title: "Blog Post Not Found | GoComfort USA",
      description: "The requested blog post could not be found.",
    }
  }

  return {
    title: blog.seo.metaTitle,
    description: blog.seo.metaDescription,
    keywords: blog.seo.keywords,
    openGraph: {
      title: blog.seo.ogTitle,
      description: blog.seo.ogDescription,
      images: [{ url: blog.seo.ogImage }],
      type: "article",
      publishedTime: blog.publishedAt,
      tags: blog.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: blog.seo.twitterTitle,
      description: blog.seo.twitterDescription,
      images: [blog.seo.twitterImage],
    },
  }
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const blog = blogs.find((blog) => blog.slug === params.slug)
  
  if (!blog) {
    notFound()
  }

  // Get related posts based on categories and tags
  const relatedPosts = blogs
    .filter(
      (post) =>
        post.id !== blog.id &&
        (post.categories.some((category) => blog.categories.includes(category)) ||
          post.tags.some((tag) => blog.tags.includes(tag))),
    )
    .slice(0, 3)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/blog" className="inline-flex items-center text-muted-foreground hover:text-primary">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Blog
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div>
            <div className="flex flex-wrap gap-2 mb-4">
              {blog.categories.map((category, index) => (
                <Link href={`/blog?category=${category}`} key={index}>
                  <Badge variant="secondary">{category}</Badge>
                </Link>
              ))}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{blog.title}</h1>
            <div className="flex flex-wrap items-center text-sm text-muted-foreground mb-6">
              <div className="flex items-center mr-4">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{new Date(blog.publishedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}</span>
              </div>
              <div className="flex items-center mr-4">
                <User className="h-4 w-4 mr-1" />
                <span>{blog.author.name}</span>
              </div>
              <div className="flex items-center">
                <span>{blog.readTime}</span>
              </div>
            </div>
          </div>

          <div className="relative h-[300px] md:h-[400px] rounded-xl overflow-hidden">
            <Image
              src={blog.coverImage}
              alt={blog.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          <div
            className="prose prose-lg dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          <div className="flex flex-wrap gap-2 pt-6 border-t">
            <span className="flex items-center mr-2">
              <Tag className="h-4 w-4 mr-1" />
              Tags:
            </span>
            {blog.tags.map((tag, index) => (
              <Link href={`/blog?search=${tag}`} key={index}>
                <Badge variant="outline" className="hover:bg-primary hover:text-primary-foreground transition-colors">
                  {tag}
                </Badge>
              </Link>
            ))}
          </div>

          <div className="pt-6 border-t">
            <h3 className="text-lg font-bold mb-4">Share this post</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" className="rounded-full">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full">
                <Linkedin className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="relative h-16 w-16 rounded-full overflow-hidden">
                  <Image
                    src={blog.author.image}
                    alt={blog.author.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-bold">{blog.author.name}</h3>
                  <p className="text-sm text-muted-foreground">{blog.author.bio}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Related Posts</h2>
              <div className="space-y-4">
                {relatedPosts.map((post) => (
                  <Link href={`/blog/${post.slug}`} key={post.id} className="flex items-start gap-3 group">
                    <div className="relative h-16 w-16 flex-shrink-0">
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <div className="flex items-center text-xs text-muted-foreground mt-1">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>{new Date(post.publishedAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Categories</h2>
              <div className="space-y-2">
                {Array.from(new Set(blogs.flatMap((blog) => blog.categories))).map((category, index) => (
                  <Link
                    href={`/blog?category=${category}`}
                    key={index}
                    className="flex items-center justify-between py-2 border-b last:border-0 hover:text-primary transition-colors"
                  >
                    <span>{category}</span>
                    <Badge variant="outline">{blogs.filter((blog) => blog.categories.includes(category)).length}</Badge>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Popular Tags</h2>
              <div className="flex flex-wrap gap-2">
                {Array.from(new Set(blogs.flatMap((blog) => blog.tags))).map((tag, index) => (
                  <Link href={`/blog?search=${tag}`} key={index}>
                    <Badge
                      variant="outline"
                      className="hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      {tag}
                    </Badge>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 