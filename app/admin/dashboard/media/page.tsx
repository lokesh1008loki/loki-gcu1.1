"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, Trash2, Search, ImageIcon } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export default function MediaLibrary() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedImages, setSelectedImages] = useState<string[]>([])
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)

  // Mock image data
  const images = [
    {
      id: "1",
      name: "water-park.jpg",
      url: "/placeholder.svg?height=200&width=300",
      type: "image/jpeg",
      size: "1.2 MB",
      date: "2023-12-10",
    },
    {
      id: "2",
      name: "adventure-park.jpg",
      url: "/placeholder.svg?height=200&width=300",
      type: "image/jpeg",
      size: "0.8 MB",
      date: "2023-12-05",
    },
    {
      id: "3",
      name: "hotel-banner.jpg",
      url: "/placeholder.svg?height=200&width=300",
      type: "image/jpeg",
      size: "1.5 MB",
      date: "2023-11-28",
    },
    {
      id: "4",
      name: "flight-promo.jpg",
      url: "/placeholder.svg?height=200&width=300",
      type: "image/jpeg",
      size: "0.9 MB",
      date: "2023-11-20",
    },
    {
      id: "5",
      name: "utility-bill.jpg",
      url: "/placeholder.svg?height=200&width=300",
      type: "image/jpeg",
      size: "0.7 MB",
      date: "2023-11-15",
    },
    {
      id: "6",
      name: "food-delivery.jpg",
      url: "/placeholder.svg?height=200&width=300",
      type: "image/jpeg",
      size: "1.1 MB",
      date: "2023-11-10",
    },
    {
      id: "7",
      name: "apartment-rental.jpg",
      url: "/placeholder.svg?height=200&width=300",
      type: "image/jpeg",
      size: "1.3 MB",
      date: "2023-11-05",
    },
    {
      id: "8",
      name: "electricity-bill.jpg",
      url: "/placeholder.svg?height=200&width=300",
      type: "image/jpeg",
      size: "0.6 MB",
      date: "2023-10-30",
    },
  ]

  const filteredImages = images.filter((image) => image.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const toggleImageSelection = (id: string) => {
    if (selectedImages.includes(id)) {
      setSelectedImages(selectedImages.filter((imageId) => imageId !== id))
    } else {
      setSelectedImages([...selectedImages, id])
    }
  }

  const handleDeleteSelected = () => {
    // In a real app, this would call an API to delete the images
    alert(`Deleting images: ${selectedImages.join(", ")}`)
    setSelectedImages([])
  }

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would upload the file to a server
    alert("File upload functionality would be implemented here")
    setUploadDialogOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold">Media Library</h1>
        <div className="flex items-center gap-2">
          <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload Media</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleUpload} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="file">Select File</Label>
                  <Input id="file" type="file" />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setUploadDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Upload</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
          {selectedImages.length > 0 && (
            <Button variant="destructive" onClick={handleDeleteSelected}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Selected
            </Button>
          )}
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search media..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Tabs defaultValue="grid">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="grid">Grid</TabsTrigger>
            <TabsTrigger value="list">List</TabsTrigger>
          </TabsList>
          <p className="text-sm text-muted-foreground">{filteredImages.length} items</p>
        </div>

        <TabsContent value="grid" className="mt-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredImages.map((image) => (
              <Card
                key={image.id}
                className={`overflow-hidden cursor-pointer transition-all ${
                  selectedImages.includes(image.id) ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => toggleImageSelection(image.id)}
              >
                <CardContent className="p-0">
                  <div className="relative aspect-square">
                    <img
                      src={image.url || "/placeholder.svg"}
                      alt={image.name}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="p-2">
                    <p className="text-sm font-medium truncate">{image.name}</p>
                    <p className="text-xs text-muted-foreground">{image.size}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="list" className="mt-4">
          <div className="border rounded-md divide-y">
            {filteredImages.map((image) => (
              <div
                key={image.id}
                className={`flex items-center p-3 hover:bg-muted/50 cursor-pointer ${
                  selectedImages.includes(image.id) ? "bg-primary/10" : ""
                }`}
                onClick={() => toggleImageSelection(image.id)}
              >
                <div className="h-12 w-12 mr-4 rounded overflow-hidden">
                  <img src={image.url || "/placeholder.svg"} alt={image.name} className="object-cover w-full h-full" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{image.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {image.type} • {image.size}
                  </p>
                </div>
                <div className="text-sm text-muted-foreground">{image.date}</div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {filteredImages.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12">
          <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No images found</h3>
          <p className="text-muted-foreground">
            {searchQuery ? "Try a different search term" : "Upload some images to get started"}
          </p>
        </div>
      )}
    </div>
  )
}
