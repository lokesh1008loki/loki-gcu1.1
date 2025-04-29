"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Pencil, Trash2, Eye, EyeOff, Search } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { ImageUpload } from "@/components/admin/image-upload"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import TestSession from "./test-session"

interface Blog {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  image: string | null
  published: boolean
  createdAt: string
  metaTitle: string | null
  metaDescription: string | null
  keywords: string | null
  seoContent: string | null
  canonicalUrl: string | null
  author: {
    name: string
  }
}

export default function BlogManagement() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null)
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    image: "",
    published: false
  })

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login")
    } else if (status === "authenticated") {
      fetchBlogs()
    }
  }, [status, router])

  const fetchBlogs = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/blogs", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      })

      if (!response.ok) {
        const errorData = await response.json()
        if (response.status === 401) {
          router.push("/admin/login")
          return
        }
        throw new Error(errorData.error || "Failed to fetch blogs")
      }

      const data = await response.json()
      setBlogs(data)
    } catch (error) {
      console.error("Error fetching blogs:", error)
      toast.error(error instanceof Error ? error.message : "Failed to fetch blogs")
    } finally {
      setLoading(false)
    }
  }

  const filteredBlogs = blogs.filter((blog) => 
    blog.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleEdit = (blog: Blog) => {
    setEditingBlog(blog)
    setDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return

    try {
      const response = await fetch(`/api/admin/blogs/${id}`, {
        method: "DELETE",
        credentials: "include"
      })
      if (!response.ok) throw new Error("Failed to delete blog")
      toast.success("Blog post deleted successfully")
      fetchBlogs()
    } catch (error) {
      console.error("Error deleting blog:", error)
      toast.error("Failed to delete blog post")
    }
  }

  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/blogs/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
          published: !currentStatus
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update blog status")
      }

      const updatedBlog = await response.json()
      toast.success(`Blog post ${updatedBlog.published ? "published" : "unpublished"} successfully`)
      fetchBlogs()
    } catch (error) {
      console.error("Error updating blog status:", error)
      toast.error(error instanceof Error ? error.message : "Failed to update blog status")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Current session in handleSubmit:', session)
    
    const form = e.target as HTMLFormElement
    const formData = new FormData(form)
    
    const data = {
      title: formData.get("title") as string,
      content: formData.get("content") as string,
      excerpt: formData.get("excerpt") as string,
      image: formData.get("image") as string,
      published: formData.get("published") === "on",
      metaTitle: formData.get("metaTitle") as string,
      metaDescription: formData.get("metaDescription") as string,
      keywords: formData.get("keywords") as string,
      seoContent: formData.get("seoContent") as string,
      canonicalUrl: formData.get("canonicalUrl") as string
    }

    console.log('Submitting blog data:', data)

    try {
      if (editingBlog) {
        const response = await fetch(`/api/admin/blogs/${editingBlog.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include",
          body: JSON.stringify(data)
        })
        const result = await response.json()
        if (!response.ok) {
          throw new Error(result.details || result.error || "Failed to update blog")
        }
        toast.success("Blog post updated successfully")
      } else {
        const response = await fetch("/api/admin/blogs", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include",
          body: JSON.stringify(data)
        })
        const result = await response.json()
        if (!response.ok) {
          console.log('Error response:', result)
          throw new Error(result.details || result.error || "Failed to create blog")
        }
        toast.success("Blog post created successfully")
      }
      setDialogOpen(false)
      setEditingBlog(null)
      fetchBlogs()
    } catch (error) {
      console.error("Error saving blog:", error)
      toast.error(error instanceof Error ? error.message : "Failed to save blog post")
    }
  }

  const handleImageUpload = (url: string) => {
    setFormData(prev => ({ ...prev, image: url }))
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <TestSession />
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Blog Management</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingBlog(null)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Blog Post
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader className="sticky top-0 bg-background z-10">
              <DialogTitle>{editingBlog ? "Edit Blog Post" : "Add New Blog Post"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" defaultValue={editingBlog?.title || ""} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Input id="excerpt" name="excerpt" defaultValue={editingBlog?.excerpt || ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <textarea
                  id="content"
                  name="content"
                  className="flex min-h-[300px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Write your blog content here..."
                  defaultValue={editingBlog?.content || ""}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Featured Image</Label>
                <ImageUpload
                  onImageUploadAction={handleImageUpload}
                  currentImage={formData.image}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="metaTitle">Meta Title</Label>
                <Input 
                  id="metaTitle" 
                  name="metaTitle" 
                  defaultValue={editingBlog?.metaTitle || ""}
                  placeholder="Enter meta title for SEO (max 60 characters)"
                  maxLength={60}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="metaDescription">Meta Description</Label>
                <textarea
                  id="metaDescription"
                  name="metaDescription"
                  className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Enter meta description for SEO (max 160 characters)"
                  defaultValue={editingBlog?.metaDescription || ""}
                  maxLength={160}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="keywords">Keywords</Label>
                <Input 
                  id="keywords" 
                  name="keywords" 
                  defaultValue={editingBlog?.keywords || ""}
                  placeholder="Enter keywords separated by commas"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="seoContent">SEO Content</Label>
                <textarea
                  id="seoContent"
                  name="seoContent"
                  className="flex min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Enter additional SEO content"
                  defaultValue={editingBlog?.seoContent || ""}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="canonicalUrl">Canonical URL</Label>
                <Input 
                  id="canonicalUrl" 
                  name="canonicalUrl" 
                  defaultValue={editingBlog?.canonicalUrl || ""}
                  placeholder="Enter canonical URL if this content exists elsewhere"
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="published"
                  name="published"
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  defaultChecked={editingBlog?.published || false}
                />
                <Label htmlFor="published">Published</Label>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setDialogOpen(false)
                    setEditingBlog(null)
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">{editingBlog ? "Update" : "Create"}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search blogs..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Posts</TabsTrigger>
          <TabsTrigger value="published">Published</TabsTrigger>
          <TabsTrigger value="drafts">Drafts</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4 mt-4">
          <Card>
            <CardContent className="p-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBlogs.map((blog) => (
                    <TableRow key={blog.id}>
                      <TableCell className="font-medium">
                        <div>
                          <div>{blog.title}</div>
                          <div className="text-sm text-muted-foreground">{blog.slug}</div>
                        </div>
                      </TableCell>
                      <TableCell>{blog.author.name}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            blog.published
                              ? "bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400"
                              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-800/20 dark:text-yellow-400"
                          }`}
                        >
                          {blog.published ? "Published" : "Draft"}
                        </span>
                      </TableCell>
                      <TableCell>{new Date(blog.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleTogglePublish(blog.id, blog.published)}
                            title={blog.published ? "Unpublish" : "Publish"}
                          >
                            {blog.published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(blog)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(blog.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="published" className="mt-4">
          <Card>
            <CardContent className="p-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBlogs
                    .filter((blog) => blog.published)
                    .map((blog) => (
                      <TableRow key={blog.id}>
                        <TableCell className="font-medium">
                          <div>
                            <div>{blog.title}</div>
                            <div className="text-sm text-muted-foreground">{blog.slug}</div>
                          </div>
                        </TableCell>
                        <TableCell>{blog.author.name}</TableCell>
                        <TableCell>{new Date(blog.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleTogglePublish(blog.id, blog.published)}
                              title="Unpublish"
                            >
                              <EyeOff className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleEdit(blog)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDelete(blog.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="drafts" className="mt-4">
          <Card>
            <CardContent className="p-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBlogs
                    .filter((blog) => !blog.published)
                    .map((blog) => (
                      <TableRow key={blog.id}>
                        <TableCell className="font-medium">
                          <div>
                            <div>{blog.title}</div>
                            <div className="text-sm text-muted-foreground">{blog.slug}</div>
                          </div>
                        </TableCell>
                        <TableCell>{blog.author.name}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleTogglePublish(blog.id, blog.published)}
                              title="Publish"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleEdit(blog)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDelete(blog.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
