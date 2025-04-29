"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { ImageUpload } from "@/components/admin/image-upload"
import { toast } from "sonner"

interface Blog {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  image: string
  published: boolean
}

export default function EditBlogPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [blog, setBlog] = useState<Blog | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchBlog() {
      try {
        const response = await fetch(`/api/admin/blogs/${params.id}`)
        if (!response.ok) {
          throw new Error("Blog not found")
        }
        const data = await response.json()
        setBlog(data)
      } catch (error) {
        console.error("Error fetching blog:", error)
        toast.error("Failed to fetch blog")
      } finally {
        setLoading(false)
      }
    }

    fetchBlog()
  }, [params.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!blog) return

    try {
      const response = await fetch(`/api/admin/blogs/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(blog),
      })

      if (!response.ok) {
        throw new Error("Failed to update blog")
      }

      toast.success("Blog updated successfully")
      router.push("/admin/blogs")
    } catch (error) {
      console.error("Error updating blog:", error)
      toast.error("Failed to update blog")
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (!blog) {
    return <div>Blog not found</div>
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Edit Blog Post</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={blog.title}
            onChange={(e) => setBlog({ ...blog, title: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="excerpt">Excerpt</Label>
          <Textarea
            id="excerpt"
            value={blog.excerpt}
            onChange={(e) => setBlog({ ...blog, excerpt: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Content</Label>
          <Textarea
            id="content"
            value={blog.content}
            onChange={(e) => setBlog({ ...blog, content: e.target.value })}
            required
            className="min-h-[300px]"
          />
        </div>

        <div className="space-y-2">
          <Label>Featured Image</Label>
          <ImageUpload
            onImageUploadAction={(url) => setBlog({ ...blog, image: url })}
            currentImage={blog.image}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="published"
            checked={blog.published}
            onCheckedChange={(checked) => setBlog({ ...blog, published: checked })}
          />
          <Label htmlFor="published">Published</Label>
        </div>

        <div className="flex space-x-4">
          <Button type="submit">Save Changes</Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/blogs")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
} 