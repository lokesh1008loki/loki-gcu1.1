import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BlogSearch } from "@/components/blog-search"
import { prisma } from "@/lib/prisma"

export const metadata: Metadata = {
  title: "Travel Blog | GoComfort USA",
  description: "Explore our travel blog for expert tips, destination guides, and travel inspiration across the USA. Discover the best attractions, hidden gems, and travel hacks.",
  keywords: "travel blog, USA travel, travel tips, destination guides, travel inspiration, travel hacks, USA attractions",
  openGraph: {
    title: "Travel Blog | GoComfort USA",
    description: "Explore our travel blog for expert tips, destination guides, and travel inspiration across the USA.",
    type: "website",
  },
}

async function getPublishedBlogs() {
  const blogs = await prisma.blog.findMany({
    where: {
      published: true
    },
    include: {
      author: {
        select: {
          name: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
  return blogs
}

const categories = [
  "All",
  "Destinations",
  "Travel Tips",
  "Theme Parks",
  "Family Travel",
  "Adventure",
  "City Guides",
]

export default async function BlogPage() {
  const blogs = await getPublishedBlogs()

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8">Blog</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {blogs.map((blog) => (
          <Link key={blog.id} href={`/blog/${blog.slug}`}>
            <Card className="h-full hover:shadow-lg transition-shadow">
              {blog.image && (
                <div className="aspect-video relative overflow-hidden rounded-t-lg">
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="object-cover w-full h-full"
                  />
                </div>
              )}
              <CardHeader>
                <CardTitle>{blog.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground line-clamp-3">
                  {blog.excerpt || blog.content.substring(0, 150)}...
                </p>
                <div className="mt-4 text-sm text-muted-foreground">
                  {new Date(blog.createdAt).toLocaleDateString()}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
