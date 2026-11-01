"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { CreditCard, Plus, ExternalLink, FileSpreadsheet, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"

interface BillService {
  id: string
  name: string
  category: string
  discount: string
  status: string
  sheetTarget: string
}

export default function BillsManagementPage() {
  const [services, setServices] = useState<BillService[]>([
    { id: "1", name: "House & Apartment Rent", category: "Rent Assistance", discount: "Up to 35% Off", status: "Active", sheetTarget: "Google Sheets Webhook" },
    { id: "2", name: "Electric & Energy Bills", category: "Utility Payment", discount: "Up to 30% Off", status: "Active", sheetTarget: "Google Sheets Webhook" },
    { id: "3", name: "Gas & Heating Utility", category: "Utility Payment", discount: "Up to 30% Off", status: "Active", sheetTarget: "Google Sheets Webhook" },
    { id: "4", name: "Water & Municipal Bills", category: "Utility Payment", discount: "Up to 25% Off", status: "Active", sheetTarget: "Google Sheets Webhook" },
  ])

  const [dialogOpen, setDialogOpen] = useState(false)
  const [formData, setFormData] = useState({ name: "", category: "Utility Payment", discount: "", status: "Active" })

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name) return
    setServices(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        name: formData.name,
        category: formData.category,
        discount: formData.discount || "Standard",
        status: formData.status,
        sheetTarget: "Google Sheets Webhook"
      }
    ])
    toast.success("Bill service added successfully")
    setDialogOpen(false)
    setFormData({ name: "", category: "Utility Payment", discount: "", status: "Active" })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <CreditCard className="h-7 w-7 text-primary" />
            Bills & Payments Management
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage bill payment service categories, discounts, and Google Sheets submission targets
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
              <DialogTitle>Add Bill Payment Category</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Service Name</Label>
                <Input
                  id="name"
                  placeholder="e.g. Broadband / Internet"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
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
            <CardTitle className="text-sm font-medium">Rent Inquiries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Active</div>
            <p className="text-xs text-muted-foreground mt-1">Connected to Google Sheets live webhook</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Utility Inquiries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Active</div>
            <p className="text-xs text-muted-foreground mt-1">Syncs customer bills with discount verification</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Forms API Documentation</CardTitle>
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
          <CardTitle>Active Bill Payment Services</CardTitle>
          <CardDescription>Customer submissions automatically route to your assigned Google Sheets</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Promo Discount</TableHead>
                <TableHead>Target Channel</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.map(s => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium">{s.name}</TableCell>
                  <TableCell>{s.category}</TableCell>
                  <TableCell className="text-emerald-600 font-semibold">{s.discount}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{s.sheetTarget}</TableCell>
                  <TableCell>
                    <Badge className="bg-emerald-600 text-white flex items-center gap-1 w-fit">
                      <CheckCircle2 className="h-3 w-3" />
                      {s.status}
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
