import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, User, ArrowLeft, Facebook, Twitter, Linkedin, Share2 } from "lucide-react"
import { prisma } from "@/lib/prisma"

type Blog = {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  image: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  keywords: string | null;
  seoContent: string | null;
  canonicalUrl: string | null;
  published: boolean;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
};

type BlogWithAuthor = Blog & {
  author: {
    name: string;
  };
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string;
  canonicalUrl?: string;
};

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { slug } = params
  const blog = await (prisma as any).blog.findUnique({
    where: { slug },
    include: { author: true }
  }) as BlogWithAuthor

  if (!blog) {
    return {
      title: "Blog Post Not Found | GoComfort USA",
      description: "The requested blog post could not be found.",
    }
  }

  return {
    title: blog.metaTitle || blog.title,
    description: blog.metaDescription || blog.excerpt || undefined,
    keywords: blog.keywords?.split(',').map((k: string) => k.trim()) || undefined,
    openGraph: {
      title: blog.metaTitle || blog.title,
      description: blog.metaDescription || blog.excerpt || undefined,
      images: blog.image ? [{ url: blog.image }] : undefined,
      type: "article",
      publishedTime: blog.createdAt.toISOString(),
    },
    alternates: blog.canonicalUrl ? {
      canonical: blog.canonicalUrl
    } : undefined,
  }
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const { slug } = params
  
  const blog = await (prisma as any).blog.findUnique({
    where: { slug },
    include: { author: true }
  })
  
  if (!blog) {
    notFound()
  }

  // Get related posts
  const relatedPosts = await (prisma as any).blog.findMany({
    where: {
      id: { not: blog.id },
      published: true
    },
    take: 3,
    orderBy: {
      createdAt: 'desc'
    },
    include: {
      author: {
        select: {
          name: true
        }
      }
    }
  })

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
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{blog.title}</h1>
            <div className="flex flex-wrap items-center text-sm text-muted-foreground mb-6">
              <div className="flex items-center mr-4">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{new Date(blog.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}</span>
              </div>
            </div>
          </div>

          {blog.image && (
            <div className="relative h-[300px] md:h-[400px] rounded-xl overflow-hidden">
              <Image
                src={blog.image.startsWith('http') ? blog.image : `${process.env.NEXT_PUBLIC_BASE_URL || ''}${blog.image}`}
                alt={blog.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority
              />
            </div>
          )}

          <div
            className="prose prose-lg dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

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
          {relatedPosts.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Related Posts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {relatedPosts.map((post: Blog & { author: { name: string } }) => (
                    <Link
                      key={post.id}
                      href={`/blog/${post.slug}`}
                      className="block hover:bg-muted p-2 rounded-lg transition-colors"
                    >
                      <h4 className="font-medium">{post.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </p>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
