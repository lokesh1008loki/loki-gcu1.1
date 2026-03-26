"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2, ArrowUp, ArrowDown, Loader2, Check, X } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

interface NavbarLink {
  id: string
  name: string
  href: string
  order: number
  isActive: boolean
  parentId: string | null
  subLinks?: NavbarLink[]
}

export default function NavbarAdminPage() {
  const [links, setLinks] = useState<NavbarLink[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchLinks()
  }, [])

  const fetchLinks = async () => {
    try {
      const res = await fetch("/api/navbar-links?admin=true")
      const data = await res.json()
      setLinks(data)
    } catch (error) {
      toast({ title: "Error", description: "Failed to fetch links", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreate = async (parentId: string | null = null) => {
    const name = window.prompt("Enter link name:")
    const href = window.prompt("Enter link href (e.g. /tickets/disneyland):")
    if (!name || !href) return

    setIsSaving(true)
    try {
      const res = await fetch("/api/navbar-links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, href, parentId, order: links.length })
      })
      if (res.ok) fetchLinks()
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this link?")) return
    setIsSaving(true)
    try {
      const res = await fetch(`/api/navbar-links?id=${id}`, { method: "DELETE" })
      if (res.ok) fetchLinks()
    } finally {
      setIsSaving(false)
    }
  }

  const handleToggleActive = async (link: NavbarLink) => {
    const originalLinks = [...links]
    const newStatus = !link.isActive
    
    // Optimistic Update
    setLinks(prev => prev.map(l => {
      if (l.id === link.id) return { ...l, isActive: newStatus }
      if (l.subLinks) {
        return {
          ...l,
          subLinks: l.subLinks.map(s => s.id === link.id ? { ...s, isActive: newStatus } : s)
        }
      }
      return l
    }))

    try {
      const updateData = {
        id: link.id,
        name: link.name,
        href: link.href,
        order: link.order,
        parentId: link.parentId,
        isActive: newStatus
      }
      
      const res = await fetch("/api/navbar-links", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData)
      })
      
      if (!res.ok) {
        throw new Error("Failed to update status")
      }
      
      toast({ title: "Success", description: `${link.name} ${newStatus ? "activated" : "deactivated"}` })
    } catch (error) {
      setLinks(originalLinks) // Revert on failure
      toast({ 
        title: "Error", 
        description: "Failed to update status. Reverting changes.", 
        variant: "destructive" 
      })
    }
  }

  const handleMove = async (id: string, direction: "up" | "down") => {
    // Basic reordering logic for MVP
    toast({ title: "Note", description: "Reordering will be implemented in the next step." })
  }

  if (isLoading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin" /></div>

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Navbar Management</h1>
        <Button onClick={() => handleCreate()}>
          <Plus className="mr-2 h-4 w-4" /> Add Top Level Link
        </Button>
      </div>

      <div className="space-y-4">
        {links.map((link) => (
          <Card key={link.id} className="border-l-4 border-l-primary">
            <CardHeader className="py-4">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">{link.name} <span className="text-sm font-normal text-muted-foreground">({link.href})</span></CardTitle>
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2 bg-slate-50 dark:bg-slate-900 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-800">
                    <Switch 
                      checked={link.isActive} 
                      onCheckedChange={() => handleToggleActive(link)}
                    />
                    <span className={cn("text-xs font-bold uppercase tracking-wider", link.isActive ? "text-emerald-600" : "text-slate-400")}>
                      {link.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => handleCreate(link.id)} title="Add Sublink">
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(link.id)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            {link.subLinks && link.subLinks.length > 0 && (
              <CardContent className="pt-0 pb-4">
                <div className="pl-6 border-l space-y-2 mt-2">
                  {link.subLinks.map((sub) => (
                    <div key={sub.id} className="flex justify-between items-center p-2 bg-slate-50 dark:bg-slate-900 rounded">
                      <span>{sub.name} <span className="text-xs text-muted-foreground">({sub.href})</span></span>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2 bg-white dark:bg-slate-850 px-2 py-1 rounded-md border border-slate-100 dark:border-slate-800">
                          <Switch 
                            checked={sub.isActive} 
                            onCheckedChange={() => handleToggleActive(sub)}
                          />
                          <span className={cn("text-[10px] font-bold uppercase", sub.isActive ? "text-emerald-600" : "text-slate-400")}>
                            {sub.isActive ? "Active" : "Inactive"}
                          </span>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(sub.id)}>
                          <Trash2 className="h-3 w-3 text-red-400" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 rounded-lg">
        <p className="text-sm text-blue-800 dark:text-blue-300">
          <strong>Tip:</strong> Changes made here will reflect in the navbar automatically. Refresh the site to see updates.
        </p>
      </div>
    </div>
  )
}
