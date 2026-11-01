import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET(
  request: Request,
  { params }: { params: { id: string } | Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await Promise.resolve(params)
    const id = resolvedParams?.id

    if (!id) {
      return NextResponse.json({ error: "Blog ID is required" }, { status: 400 })
    }

    const blog = await prisma.blog.findUnique({
      where: { id },
      include: { author: true }
    })

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 })
    }

    return NextResponse.json(blog)
  } catch (error: any) {
    console.error("Error fetching blog:", error)
    return NextResponse.json({ error: error?.message || "Internal Server Error" }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } | Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const resolvedParams = await Promise.resolve(params)
    const id = resolvedParams?.id

    if (!id) {
      return NextResponse.json({ error: "Blog ID is required" }, { status: 400 })
    }

    const body = await request.json()
    const { 
      title, 
      content, 
      excerpt, 
      image, 
      published,
      metaTitle,
      metaDescription,
      keywords,
      seoContent,
      canonicalUrl
    } = body

    // Get existing blog
    const existingBlog = await prisma.blog.findUnique({
      where: { id }
    })

    if (!existingBlog) {
      return NextResponse.json(
        { error: "Blog not found" },
        { status: 404 }
      )
    }

    // Prepare update data
    const updateData: Record<string, any> = {}

    // Only update fields that are provided
    if (title !== undefined && title !== null && title !== existingBlog.title) {
      updateData.title = title
      // Generate new unique slug if title changed
      const baseSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
      
      let slug = baseSlug
      let count = 1
      while (await prisma.blog.findFirst({ where: { slug, NOT: { id } } })) {
        slug = `${baseSlug}-${count++}`
      }
      updateData.slug = slug
    } else if (title !== undefined && title !== null) {
      updateData.title = title
    }

    if (content !== undefined) updateData.content = content
    if (excerpt !== undefined) updateData.excerpt = excerpt
    if (image !== undefined) updateData.image = image
    if (published !== undefined) updateData.published = published
    if (metaTitle !== undefined) updateData.metaTitle = metaTitle
    if (metaDescription !== undefined) updateData.metaDescription = metaDescription
    if (keywords !== undefined) updateData.keywords = keywords
    if (seoContent !== undefined) updateData.seoContent = seoContent
    if (canonicalUrl !== undefined) updateData.canonicalUrl = canonicalUrl

    const updatedBlog = await prisma.blog.update({
      where: { id },
      data: updateData
    })

    try {
      revalidatePath("/blog")
      revalidatePath("/blog/[slug]", "page")
      if (existingBlog.slug) {
        revalidatePath(`/blog/${existingBlog.slug}`)
      }
      if (updatedBlog.slug && updatedBlog.slug !== existingBlog.slug) {
        revalidatePath(`/blog/${updatedBlog.slug}`)
      }
      revalidatePath("/admin/blogs")
      revalidatePath("/admin/dashboard/blog")
    } catch (e) {
      console.error("Revalidation error:", e)
    }

    return NextResponse.json(updatedBlog)
  } catch (error: any) {
    console.error("Error updating blog:", error)
    return NextResponse.json(
      { 
        error: "Failed to update blog",
        details: error?.message || String(error)
      },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } | Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const resolvedParams = await Promise.resolve(params)
    const id = resolvedParams?.id

    if (!id) {
      return NextResponse.json({ error: "Blog ID is required" }, { status: 400 })
    }

    // Delete the blog post
    await prisma.blog.delete({
      where: { id }
    })

    try {
      revalidatePath("/blog")
      revalidatePath("/blog/[slug]", "page")
      revalidatePath("/admin/blogs")
      revalidatePath("/admin/dashboard/blog")
    } catch (e) {
      console.error("Revalidation error:", e)
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Error deleting blog:", error)
    return NextResponse.json(
      { 
        error: "Failed to delete blog",
        details: error?.message || String(error)
      },
      { status: 500 }
    )
  }
}
