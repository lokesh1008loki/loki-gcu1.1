import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Verify user exists in database
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: session.user.email || undefined },
          { id: session.user.id }
        ]
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    const blogs = await prisma.blog.findMany({
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

    return NextResponse.json(blogs)
  } catch (error) {
    console.error("Error fetching blogs:", error)
    return NextResponse.json(
      { 
        error: "Failed to fetch blogs",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Verify user exists in database
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: session.user.email || undefined },
          { id: session.user.id }
        ]
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    const body = await request.json()
    const { 
      title, 
      content, 
      excerpt, 
      image,
      metaTitle,
      metaDescription,
      keywords,
      seoContent,
      canonicalUrl,
      published
    } = body

    // Validate required fields
    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      )
    }

    // Generate initial slug from title
    let slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    // Check if slug exists and append a number if it does
    let counter = 1
    let originalSlug = slug
    while (true) {
      const existingBlog = await prisma.blog.findUnique({
        where: { slug }
      })
      
      if (!existingBlog) break
      
      slug = `${originalSlug}-${counter}`
      counter++
    }

    const blog = await prisma.blog.create({
      data: {
        title,
        slug,
        content,
        excerpt: excerpt || null,
        image: image || null,
        metaTitle: metaTitle || null,
        metaDescription: metaDescription || null,
        keywords: keywords || null,
        seoContent: seoContent || null,
        canonicalUrl: canonicalUrl || null,
        published: published || true,
        authorId: user.id
      }
    })

    return NextResponse.json(blog)
  } catch (error) {
    console.error("Error creating blog:", error)
    return NextResponse.json(
      { 
        error: "Failed to create blog",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
} 