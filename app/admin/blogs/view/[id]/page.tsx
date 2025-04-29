import { Metadata } from "next"
import { Suspense } from "react"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"

type Props = {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const blog = await prisma.blog.findUnique({
    where: { id: params.id }
  })

  if (!blog) {
    return {
      title: "Blog Not Found"
    }
  }

  return {
    title: blog.title,
    description: blog.excerpt
  }
}

async function getBlog(id: string) {
  const blog = await prisma.blog.findUnique({
    where: { id },
    include: { author: true }
  })

  if (!blog) notFound()
  return blog
}

export default async function BlogPage({ params }: Props) {
  const blog = await getBlog(params.id)

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-4">{blog.title}</h1>
        <div className="prose max-w-none">
          {blog.content}
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          By {blog.author.name}
        </p>
      </div>
    </Suspense>
  )
} 