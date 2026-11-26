import { Metadata } from "next"
import { Suspense } from "react"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"

type Props = {
  params: { id: string } | Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await Promise.resolve(params)
  const blog = await (prisma as any).blog.findUnique({
    where: { id },
  })

  if (!blog) {
    return {
      title: "Blog Not Found",
    }
  }

  return {
    title: blog.metaTitle || blog.title,
    description: blog.metaDescription || blog.excerpt || undefined,
    robots: { index: false, follow: false },
  }
}

async function getBlog(id: string) {
  const blog = await (prisma as any).blog.findUnique({
    where: { id },
    include: { author: true },
  })

  if (!blog) notFound()
  return blog
}

export default async function BlogViewPage({ params }: Props) {
  const { id } = await Promise.resolve(params)
  const blog = await getBlog(id)

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="container mx-auto py-8 max-w-4xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">{blog.title}</h1>
          <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-medium">
            {blog.published ? "Published" : "Draft"}
          </span>
        </div>
        {blog.image && (
          <div className="relative aspect-[16/9] rounded-xl overflow-hidden border bg-slate-100">
            <img
              src={blog.image}
              alt={blog.imageAlt || blog.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
        <p className="mt-4 text-sm text-muted-foreground">
          By {blog.author?.name || "GoComfort Editorial Desk"}
        </p>
      </div>
    </Suspense>
  )
}
