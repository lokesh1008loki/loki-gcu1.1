"use client"

import type React from "react"
import Link from "next/link"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Pencil, Trash2, FileSpreadsheet } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function FormsManagement() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingForm, setEditingForm] = useState<any>(null)
  const [formFields, setFormFields] = useState<{ name: string; type: string }[]>([{ name: "", type: "text" }])

  // Mock form data
  const forms = [
    {
      id: "1",
      name: "Contact Form",
      formType: "contact",
      sheetId: "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms",
      sheetName: "Responses",
      fields: [
        { name: "name", type: "text" },
        { name: "email", type: "email" },
        { name: "message", type: "textarea" },
      ],
    },
    {
      id: "2",
      name: "Booking Form",
      formType: "booking",
      sheetId: "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms",
      sheetName: "Bookings",
      fields: [
        { name: "name", type: "text" },
        { name: "email", type: "email" },
        { name: "date", type: "date" },
        { name: "guests", type: "number" },
      ],
    },
    {
      id: "3",
      name: "Newsletter Signup",
      formType: "newsletter",
      sheetId: "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms",
      sheetName: "Subscribers",
      fields: [
        { name: "name", type: "text" },
        { name: "email", type: "email" },
      ],
    },
  ]

  const handleEdit = (form: any) => {
    setEditingForm(form)
    setFormFields(form.fields)
    setDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    // In a real app, this would call an API to delete the form
    alert(`Deleting form: ${id}`)
  }

  const handleAddField = () => {
    setFormFields([...formFields, { name: "", type: "text" }])
  }

  const handleRemoveField = (index: number) => {
    const newFields = [...formFields]
    newFields.splice(index, 1)
    setFormFields(newFields)
  }

  const handleFieldChange = (index: number, field: string, value: string) => {
    const newFields = [...formFields]
    newFields[index] = { ...newFields[index], [field]: value }
    setFormFields(newFields)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would save the form configuration
    alert(editingForm ? "Form updated" : "Form created")
    setDialogOpen(false)
    setEditingForm(null)
    setFormFields([{ name: "", type: "text" }])
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Forms Management</h1>
        <div className="flex items-center space-x-2">
          <Link href="/admin/dashboard/forms/api-docs">
            <Button variant="outline">API Documentation</Button>
          </Link>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingForm(null)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Form
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingForm ? "Edit Form" : "Add New Form"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Form Name</Label>
                  <Input id="name" defaultValue={editingForm?.name || ""} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="formType">Form Type</Label>
                  <Input id="formType" defaultValue={editingForm?.formType || ""} required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sheetId">Google Sheet ID</Label>
                    <Input id="sheetId" defaultValue={editingForm?.sheetId || ""} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sheetName">Sheet Name</Label>
                    <Input id="sheetName" defaultValue={editingForm?.sheetName || "Sheet1"} />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Form Fields</Label>
                    <Button type="button" variant="outline" size="sm" onClick={handleAddField}>
                      <Plus className="h-4 w-4 mr-1" /> Add Field
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {formFields.map((field, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input
                          placeholder="Field name"
                          value={field.name}
                          onChange={(e) => handleFieldChange(index, "name", e.target.value)}
                          required
                        />
                        <select
                          className="flex h-10 w-40 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          value={field.type}
                          onChange={(e) => handleFieldChange(index, "type", e.target.value)}
                        >
                          <option value="text">Text</option>
                          <option value="email">Email</option>
                          <option value="number">Number</option>
                          <option value="date">Date</option>
                          <option value="textarea">Textarea</option>
                          <option value="select">Select</option>
                          <option value="checkbox">Checkbox</option>
                        </select>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveField(index)}
                          disabled={formFields.length === 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setDialogOpen(false)
                      setEditingForm(null)
                      setFormFields([{ name: "", type: "text" }])
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">{editingForm ? "Update" : "Create"}</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="forms">
        <TabsList>
          <TabsTrigger value="forms">Forms</TabsTrigger>
          <TabsTrigger value="responses">Responses</TabsTrigger>
          <TabsTrigger value="settings">Google Sheets Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="forms" className="space-y-4 mt-4">
          <Card>
            <CardContent className="p-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Google Sheet</TableHead>
                    <TableHead>Fields</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {forms.map((form) => (
                    <TableRow key={form.id}>
                      <TableCell className="font-medium">{form.name}</TableCell>
                      <TableCell>{form.formType}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <FileSpreadsheet className="h-4 w-4 mr-1 text-green-600" />
                          {form.sheetName}
                        </div>
                      </TableCell>
                      <TableCell>{form.fields.length} fields</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(form)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(form.id)}>
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

        <TabsContent value="responses" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Form Responses</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center py-8 text-muted-foreground">
                Form responses are stored in Google Sheets. Click on a form to view its responses.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                {forms.map((form) => (
                  <Card key={form.id} className="cursor-pointer hover:border-primary transition-colors">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold">{form.name}</h3>
                        <FileSpreadsheet className="h-5 w-5 text-green-600" />
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">Responses stored in {form.sheetName} sheet</p>
                      <Button variant="outline" className="w-full" size="sm">
                        View in Google Sheets
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Google Sheets Integration Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="service-account">Google Service Account Email</Label>
                <Input id="service-account" placeholder="your-service-account@project-id.iam.gserviceaccount.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="private-key">Google Service Account Private Key</Label>
                <Input id="private-key" type="password" placeholder="Private key from your service account" />
              </div>
              <div className="flex justify-end">
                <Button>Save Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
