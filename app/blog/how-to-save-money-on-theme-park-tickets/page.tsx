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
    title: "How to Save Money on Theme Park Tickets",
    slug: "how-to-save-money-on-theme-park-tickets",
    excerpt: "Learn expert tips and tricks to get the best deals on theme park tickets and maximize your vacation budget.",
    content: `
      <h2>Introduction</h2>
      <p>Theme park tickets can be a significant expense in your vacation budget, but with the right strategies, you can save a substantial amount of money. In this comprehensive guide, we'll share expert tips and tricks to help you get the best deals on theme park tickets.</p>
      
      <h2>1. Plan Your Visit During Off-Peak Seasons</h2>
      <p>One of the most effective ways to save money is by visiting during off-peak seasons. Ticket prices are typically lower during weekdays, non-holiday periods, and outside of summer vacation. Research the park's calendar to identify the best times to visit.</p>
      
      <h2>2. Purchase Tickets in Advance</h2>
      <p>Many theme parks offer discounts for tickets purchased in advance. Some parks even provide significant savings for tickets bought 30-60 days before your visit. Early bird discounts can range from 10% to 30% off regular prices.</p>
      
      <h2>3. Consider Multi-Day Tickets</h2>
      <p>If you're planning to visit a theme park for multiple days, multi-day tickets often provide the best value. The per-day cost decreases significantly with each additional day. For example, a 3-day ticket might cost only slightly more than a 2-day ticket.</p>
      
      <h2>4. Look for Package Deals</h2>
      <p>Many travel agencies and theme parks offer package deals that include tickets, hotel accommodations, and sometimes even meals. These packages can provide substantial savings compared to booking everything separately.</p>
      
      <h2>5. Use Membership Discounts</h2>
      <p>Check if you're eligible for any membership discounts through organizations like AAA, AARP, or military service. Many theme parks offer special rates for members of these organizations.</p>
      
      <h2>6. Consider Annual Passes</h2>
      <p>If you plan to visit a theme park multiple times within a year, an annual pass might be more cost-effective than buying individual tickets. Many annual passes also include additional perks like free parking and discounts on food and merchandise.</p>
      
      <h2>7. Use Cashback and Rewards Programs</h2>
      <p>Take advantage of cashback websites and credit card rewards programs when purchasing tickets. Some programs offer 2-5% cashback on theme park purchases, which can add up to significant savings.</p>
      
      <h2>8. Check for Special Promotions</h2>
      <p>Theme parks frequently run special promotions throughout the year. Sign up for their newsletters and follow them on social media to stay informed about limited-time offers and flash sales.</p>
      
      <h2>9. Consider Group Discounts</h2>
      <p>If you're traveling with a group of 10 or more people, you might qualify for group discounts. Contact the park's group sales department to inquire about special rates and packages.</p>
      
      <h2>10. Use CityPASS or Similar Programs</h2>
      <p>If you're visiting a city with multiple attractions, consider using CityPASS or similar programs. These bundled tickets can save you up to 50% on admission to multiple attractions, including theme parks.</p>
      
      <h2>Additional Tips</h2>
      <ul>
        <li>Compare prices across multiple authorized ticket sellers</li>
        <li>Be cautious of third-party resellers offering prices that seem too good to be true</li>
        <li>Check for blackout dates and restrictions before purchasing discounted tickets</li>
        <li>Consider visiting during special events or festivals for added value</li>
        <li>Look for hotel packages that include free or discounted park tickets</li>
      </ul>
      
      <h2>Conclusion</h2>
      <p>With careful planning and research, you can significantly reduce the cost of theme park tickets. Remember to start your search early, compare prices across multiple sources, and take advantage of all available discounts and promotions. Happy savings and enjoy your theme park adventure!</p>
    `,
    coverImage: "/ass/blog/theme-park-tickets.jpg",
    categories: ["Travel Tips", "Theme Parks"],
    tags: ["theme parks", "tickets", "savings", "budget travel", "discounts"],
    published: true,
    publishedAt: "2024-03-10",
    author: {
      name: "Michael Chen",
      image: "/ass/blog/authors/michael-chen.jpg",
      bio: "Michael is a travel expert specializing in theme park vacations and budget travel. With over 15 years of experience in the travel industry, he has helped thousands of families plan affordable theme park vacations."
    },
    readTime: "6 min read",
    seo: {
      metaTitle: "How to Save Money on Theme Park Tickets | GocomfortUSA",
      metaDescription: "Learn expert tips and tricks to get the best deals on theme park tickets. Discover how to maximize your vacation budget with our comprehensive guide.",
      keywords: "theme park tickets, save money on theme parks, theme park discounts, budget travel, theme park deals",
      ogTitle: "How to Save Money on Theme Park Tickets | GocomfortUSA",
      ogDescription: "Learn expert tips and tricks to get the best deals on theme park tickets. Discover how to maximize your vacation budget with our comprehensive guide.",
      ogImage: "/ass/blog/theme-park-tickets.jpg",
      twitterTitle: "How to Save Money on Theme Park Tickets | GocomfortUSA",
      twitterDescription: "Learn expert tips and tricks to get the best deals on theme park tickets. Discover how to maximize your vacation budget with our comprehensive guide.",
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