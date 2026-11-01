"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ShoppingBag, Plus, FileSpreadsheet, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"

interface GroceryItem {
  id: string
  name: string
  provider: string
  discount: string
  status: string
  webhook: string
}

export default function FoodGroceryManagementPage() {
  const [items, setItems] = useState<GroceryItem[]>([
    { id: "1", name: "Instacart Grocery Orders", provider: "Instacart", discount: "Up to 30% Off", status: "Active", webhook: "Google Sheets Live Webhook" },
    { id: "2", name: "DoorDash Food Delivery", provider: "DoorDash", discount: "Up to 35% Off", status: "Active", webhook: "Google Sheets Live Webhook" },
    { id: "3", name: "UberEats Delivery", provider: "UberEats", discount: "Up to 30% Off", status: "Active", webhook: "Google Sheets Live Webhook" },
    { id: "4", name: "Local Supermarket Orders", provider: "Local Stores", discount: "Custom Quotes", status: "Active", webhook: "Google Sheets Live Webhook" },
  ])

  const [dialogOpen, setDialogOpen] = useState(false)
  const [formData, setFormData] = useState({ name: "", provider: "", discount: "", status: "Active" })

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name) return
    setItems(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        name: formData.name,
        provider: formData.provider || "Partner",
        discount: formData.discount || "Standard",
        status: formData.status,
        webhook: "Google Sheets Live Webhook"
      }
    ])
    toast.success("Food & Grocery service added successfully")
    setDialogOpen(false)
    setFormData({ name: "", provider: "", discount: "", status: "Active" })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <ShoppingBag className="h-7 w-7 text-primary" />
            Food & Grocery Management
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage food delivery partnerships, grocery discount services, and intake channels
          </p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Service
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Food / Grocery Service</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Service Name</Label>
                <Input
                  id="name"
                  placeholder="e.g. Walmart Grocery Delivery"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="provider">Provider / Platform</Label>
                <Input
                  id="provider"
                  placeholder="e.g. Walmart"
                  value={formData.provider}
                  onChange={e => setFormData({ ...formData, provider: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="discount">Discount Offer</Label>
                <Input
                  id="discount"
                  placeholder="e.g. Up to 25% Off"
                  value={formData.discount}
                  onChange={e => setFormData({ ...formData, discount: e.target.value })}
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button type="submit">Create Service</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Grocery Service Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Active</div>
            <p className="text-xs text-muted-foreground mt-1">Receiving customer cart & grocery requests</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Delivery Discounts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">Up to 35%</div>
            <p className="text-xs text-muted-foreground mt-1">Applied via concierge order processing</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Google Sheets Integration</CardTitle>
          </CardHeader>
          <CardContent>
            <a href="/admin/dashboard/forms/api-docs" className="text-sm text-primary hover:underline flex items-center gap-1 font-medium">
              <FileSpreadsheet className="h-4 w-4" />
              View Form Endpoints & Webhooks
            </a>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Food & Grocery Intake Services</CardTitle>
          <CardDescription>All customer submissions are processed directly through connected Google Sheets</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service Name</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Discount Rate</TableHead>
                <TableHead>Intake Webhook</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map(item => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.provider}</TableCell>
                  <TableCell className="text-emerald-600 font-semibold">{item.discount}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{item.webhook}</TableCell>
                  <TableCell>
                    <Badge className="bg-emerald-600 text-white flex items-center gap-1 w-fit">
                      <CheckCircle2 className="h-3 w-3" />
                      {item.status}
                    </Badge>
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
