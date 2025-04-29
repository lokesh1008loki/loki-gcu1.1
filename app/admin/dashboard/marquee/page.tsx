"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react"
import { toast } from "sonner"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface MarqueeMessage {
  id: string
  message: string
  isActive: boolean
  backgroundColor: string
  textColor: string
  createdAt: string
  updatedAt: string
}

const colorOptions = [
  { value: "primary", label: "Primary" },
  { value: "secondary", label: "Secondary" },
  { value: "accent", label: "Accent" },
  { value: "destructive", label: "Destructive" },
  { value: "muted", label: "Muted" },
]

const textColorOptions = [
  { value: "white", label: "White" },
  { value: "black", label: "Black" },
  { value: "primary", label: "Primary" },
  { value: "secondary", label: "Secondary" },
  { value: "accent", label: "Accent" },
  { value: "destructive", label: "Destructive" },
  { value: "muted", label: "Muted" },
]

export default function MarqueeManagement() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [messages, setMessages] = useState<MarqueeMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingMessage, setEditingMessage] = useState<MarqueeMessage | null>(null)
  const [formData, setFormData] = useState({
    message: "",
    isActive: true,
    backgroundColor: "primary",
    textColor: "white"
  })

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login")
    } else if (status === "authenticated") {
      fetchMessages()
    }
  }, [status, router])

  const fetchMessages = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/marquee", {
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
        throw new Error(errorData.error || "Failed to fetch messages")
      }

      const data = await response.json()
      setMessages(data)
    } catch (error) {
      console.error("Error fetching messages:", error)
      toast.error(error instanceof Error ? error.message : "Failed to fetch messages")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (editingMessage) {
        const response = await fetch(`/api/admin/marquee/${editingMessage.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(formData),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to update message")
        }

        toast.success("Message updated successfully")
      } else {
        const response = await fetch("/api/admin/marquee", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(formData),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to create message")
        }

        toast.success("Message created successfully")
      }

      setDialogOpen(false)
      setEditingMessage(null)
      fetchMessages()
    } catch (error) {
      console.error("Error saving message:", error)
      toast.error(error instanceof Error ? error.message : "Failed to save message")
    }
  }

  const handleEdit = (message: MarqueeMessage) => {
    setEditingMessage(message)
    setFormData({
      message: message.message,
      isActive: message.isActive,
      backgroundColor: message.backgroundColor || "primary",
      textColor: message.textColor || "white"
    })
    setDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return

    try {
      const response = await fetch(`/api/admin/marquee/${id}`, {
        method: "DELETE",
        credentials: "include"
      })

      if (!response.ok) {
        throw new Error("Failed to delete message")
      }

      toast.success("Message deleted successfully")
      fetchMessages()
    } catch (error) {
      console.error("Error deleting message:", error)
      toast.error("Failed to delete message")
    }
  }

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/marquee/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
          isActive: !currentStatus
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update message status")
      }

      toast.success(`Message ${currentStatus ? "deactivated" : "activated"} successfully`)
      fetchMessages()
    } catch (error) {
      console.error("Error updating message status:", error)
      toast.error(error instanceof Error ? error.message : "Failed to update message status")
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Marquee Messages</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingMessage(null)
              setFormData({
                message: "",
                isActive: true,
                backgroundColor: "primary",
                textColor: "white"
              })
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Message
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingMessage ? "Edit Message" : "Add New Message"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Input
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Enter your message"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Background Color</Label>
                <Select
                  value={formData.backgroundColor}
                  onValueChange={(value) => setFormData({ ...formData, backgroundColor: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select background color" />
                  </SelectTrigger>
                  <SelectContent>
                    {colorOptions.map((color) => (
                      <SelectItem key={color.value} value={color.value}>
                        {color.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Text Color</Label>
                <Select
                  value={formData.textColor}
                  onValueChange={(value) => setFormData({ ...formData, textColor: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select text color" />
                  </SelectTrigger>
                  <SelectContent>
                    {textColorOptions.map((color) => (
                      <SelectItem key={color.value} value={color.value}>
                        {color.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="isActive">Active</Label>
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingMessage ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Message</TableHead>
                <TableHead>Background Color</TableHead>
                <TableHead>Text Color</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {messages.map((message) => (
                <TableRow key={message.id}>
                  <TableCell className="font-medium">{message.message}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${message.backgroundColor || 'primary'}-100 text-${message.backgroundColor || 'primary'}-800`}>
                      {colorOptions.find(c => c.value === message.backgroundColor)?.label || 'Primary'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${message.textColor || 'white'}-100 text-${message.textColor || 'white'}-800`}>
                      {textColorOptions.find(c => c.value === message.textColor)?.label || 'White'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        message.isActive
                          ? "bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-800/20 dark:text-yellow-400"
                      }`}
                    >
                      {message.isActive ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                  <TableCell>{new Date(message.updatedAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleToggleActive(message.id, message.isActive)}
                        title={message.isActive ? "Deactivate" : "Activate"}
                      >
                        {message.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(message)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(message.id)}>
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
    </div>
  )
} 