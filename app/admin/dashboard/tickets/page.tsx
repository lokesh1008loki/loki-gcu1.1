"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Pencil, Trash2 } from "lucide-react"

export default function TicketsManagement() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingTicket, setEditingTicket] = useState<any>(null)

  // Mock ticket data
  const tickets = [
    { id: "1", name: "Water Park - Adult", price: "$49.99", category: "Water Park", stock: 100, status: "Active" },
    { id: "2", name: "Water Park - Child", price: "$29.99", category: "Water Park", stock: 150, status: "Active" },
    {
      id: "3",
      name: "Adventure Park - Adult",
      price: "$59.99",
      category: "Adventure Park",
      stock: 80,
      status: "Active",
    },
    {
      id: "4",
      name: "Adventure Park - Child",
      price: "$39.99",
      category: "Adventure Park",
      stock: 120,
      status: "Active",
    },
    {
      id: "5",
      name: "Amusement Park - Adult",
      price: "$54.99",
      category: "Amusement Park",
      stock: 90,
      status: "Active",
    },
    {
      id: "6",
      name: "Amusement Park - Child",
      price: "$34.99",
      category: "Amusement Park",
      stock: 130,
      status: "Active",
    },
  ]

  const handleEdit = (ticket: any) => {
    setEditingTicket(ticket)
    setDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    // In a real app, this would call an API to delete the ticket
    alert(`Deleting ticket: ${id}`)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would save the ticket data
    alert(editingTicket ? "Ticket updated" : "Ticket created")
    setDialogOpen(false)
    setEditingTicket(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Tickets & Parks Management</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingTicket(null)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Ticket
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingTicket ? "Edit Ticket" : "Add New Ticket"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Ticket Name</Label>
                <Input id="name" defaultValue={editingTicket?.name || ""} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price</Label>
                  <Input id="price" defaultValue={editingTicket?.price || ""} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input id="category" defaultValue={editingTicket?.category || ""} required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="stock">Stock</Label>
                  <Input id="stock" type="number" defaultValue={editingTicket?.stock || ""} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Input id="status" defaultValue={editingTicket?.status || "Active"} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" rows={3} defaultValue={editingTicket?.description || ""} />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setDialogOpen(false)
                    setEditingTicket(null)
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">{editingTicket ? "Update" : "Create"}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Tickets</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tickets.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell className="font-medium">{ticket.name}</TableCell>
                  <TableCell>{ticket.price}</TableCell>
                  <TableCell>{ticket.category}</TableCell>
                  <TableCell>{ticket.stock}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400">
                      {ticket.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(ticket)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(ticket.id)}>
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Water Parks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2 Tickets</div>
            <p className="text-sm text-muted-foreground">Manage water park tickets</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Adventure Parks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2 Tickets</div>
            <p className="text-sm text-muted-foreground">Manage adventure park tickets</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Amusement Parks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2 Tickets</div>
            <p className="text-sm text-muted-foreground">Manage amusement park tickets</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
