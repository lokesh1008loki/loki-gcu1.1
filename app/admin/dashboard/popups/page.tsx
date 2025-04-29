"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"

interface Popup {
  id: string
  title: string
  message: string
  type: string
  isActive: boolean
  startDate: string | null
  endDate: string | null
  showOnPages: string[]
  createdAt: string
  updatedAt: string
}

export default function PopupManagement() {
  const router = useRouter()
  const [popups, setPopups] = useState<Popup[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingPopup, setEditingPopup] = useState<Popup | null>(null)

  // Helper function to get current date in PST
  const getCurrentDateTime = () => {
    const now = new Date()
    const pstTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }))
    pstTime.setSeconds(0, 0)
    return pstTime.toISOString().slice(0, 16)
  }

  const [formData, setFormData] = useState({
    title: "",
    message: "",
    type: "info",
    isActive: true,
    startDate: getCurrentDateTime(),
    endDate: "",
    showOnPages: ""
  })

  useEffect(() => {
    fetchPopups()
  }, [])

  const fetchPopups = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/admin/popups")
      if (!response.ok) {
        throw new Error("Failed to fetch popups")
      }
      const data = await response.json()
      setPopups(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error fetching popups:", error)
      toast.error("Failed to fetch popups")
      setPopups([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validate dates in PST
      const now = new Date()
      const pstNow = new Date(now.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }))
      pstNow.setSeconds(0, 0)
      
      const startDate = formData.startDate ? new Date(formData.startDate) : null
      const endDate = formData.endDate ? new Date(formData.endDate) : null

      if (startDate && endDate && startDate > endDate) {
        toast.error("Start date cannot be after end date")
        return
      }

      if (startDate && startDate < pstNow) {
        toast.error("Start date cannot be in the past")
        return
      }

      if (endDate && endDate < pstNow) {
        toast.error("End date cannot be in the past")
        return
      }

      const url = editingPopup 
        ? `/api/admin/popups/${editingPopup.id}`
        : "/api/admin/popups"
      
      const method = editingPopup ? "PUT" : "POST"
      
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          showOnPages: formData.showOnPages.split(",").map(page => page.trim()),
          startDate: startDate?.toISOString() || null,
          endDate: endDate?.toISOString() || null,
        }),
      })

      let errorMessage = "Failed to save popup"
      
      if (!response.ok) {
        try {
          const errorData = await response.json()
          errorMessage = errorData.error || errorMessage
        } catch (e) {
          // If response is not JSON, use the status text
          errorMessage = response.statusText || errorMessage
        }
        throw new Error(errorMessage)
      }

      toast.success(editingPopup ? "Popup updated successfully" : "Popup created successfully")
      setIsDialogOpen(false)
      fetchPopups()
    } catch (error) {
      console.error("Error saving popup:", error)
      toast.error(error instanceof Error ? error.message : "Failed to save popup")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (popup: Popup) => {
    setEditingPopup(popup)
    setFormData({
      title: popup.title,
      message: popup.message,
      type: popup.type,
      isActive: popup.isActive,
      startDate: popup.startDate || "",
      endDate: popup.endDate || "",
      showOnPages: popup.showOnPages.join(", ")
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this popup?")) return

    try {
      const response = await fetch(`/api/admin/popups/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })

      let errorMessage = "Failed to delete popup"
      
      if (!response.ok) {
        try {
          const errorData = await response.json()
          errorMessage = errorData.error || errorMessage
        } catch (e) {
          // If response is not JSON, use the status text
          errorMessage = response.statusText || errorMessage
        }
        throw new Error(errorMessage)
      }

      toast.success("Popup deleted successfully")
      fetchPopups()
    } catch (error) {
      console.error("Error deleting popup:", error)
      toast.error(error instanceof Error ? error.message : "Failed to delete popup")
    }
  }

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/popups/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isActive: !isActive }),
      })

      let errorMessage = "Failed to update popup"
      
      if (!response.ok) {
        try {
          const errorData = await response.json()
          errorMessage = errorData.error || errorMessage
        } catch (e) {
          // If response is not JSON, use the status text
          errorMessage = response.statusText || errorMessage
        }
        throw new Error(errorMessage)
      }

      toast.success(`Popup ${isActive ? "deactivated" : "activated"} successfully`)
      fetchPopups()
    } catch (error) {
      console.error("Error updating popup:", error)
      toast.error(error instanceof Error ? error.message : "Failed to update popup")
    }
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Popup Notifications</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingPopup(null)
              setFormData({
                title: "",
                message: "",
                type: "info",
                isActive: true,
                startDate: getCurrentDateTime(),
                endDate: "",
                showOnPages: ""
              })
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Popup
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingPopup ? "Edit Popup" : "Add Popup"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="success">Success</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="showOnPages">Show on Pages (comma-separated paths)</Label>
                <Input
                  id="showOnPages"
                  value={formData.showOnPages}
                  onChange={(e) => setFormData({ ...formData, showOnPages: e.target.value })}
                  placeholder="e.g., /, /blog, /about"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date (optional)</Label>
                <Input
                  id="startDate"
                  type="datetime-local"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  min={new Date().toISOString().slice(0, 16)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">End Date (optional)</Label>
                <Input
                  id="endDate"
                  type="datetime-local"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  min={formData.startDate || new Date().toISOString().slice(0, 16)}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                />
                <Label htmlFor="isActive">Active</Label>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Saving..." : editingPopup ? "Update Popup" : "Create Popup"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Pages</TableHead>
                <TableHead>Date Range</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {popups.map((popup) => (
                <TableRow key={popup.id}>
                  <TableCell className="font-medium">{popup.title}</TableCell>
                  <TableCell>
                    <span className={`capitalize px-2 py-1 rounded-full text-xs ${
                      popup.type === "info" ? "bg-blue-100 text-blue-800" :
                      popup.type === "success" ? "bg-green-100 text-green-800" :
                      popup.type === "warning" ? "bg-yellow-100 text-yellow-800" :
                      "bg-red-100 text-red-800"
                    }`}>
                      {popup.type}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={popup.isActive}
                      onCheckedChange={() => handleToggleActive(popup.id, popup.isActive)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs truncate">
                      {popup.showOnPages.join(", ")}
                    </div>
                  </TableCell>
                  <TableCell>
                    {popup.startDate && popup.endDate ? (
                      <div className="text-sm">
                        {format(new Date(popup.startDate), "MMM d, yyyy")} - {format(new Date(popup.endDate), "MMM d, yyyy")}
                      </div>
                    ) : (
                      "Always"
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(popup)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(popup.id)}
                      >
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