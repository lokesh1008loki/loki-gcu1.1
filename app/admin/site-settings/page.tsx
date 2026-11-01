"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

interface SiteSettings {
  id?: string
  whatsappLink: string
  facebookLink: string
  instagramLink: string
  twitterLink: string
  phoneNumber: string
  email: string
  address: string
  consultationPrice: string
  consultationLink: string
}

export default function SiteSettingsPage() {
  const router = useRouter()
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/admin/site-settings", {
        cache: "no-store",
        credentials: "include",
      })
      if (!response.ok) {
        // Fallback to public route
        const fallbackRes = await fetch("/api/site-settings", {
          cache: "no-store",
        })
        if (!fallbackRes.ok) {
          throw new Error("Failed to fetch site settings")
        }
        const fallbackData = await fallbackRes.json()
        setSettings(fallbackData)
        return
      }
      const data = await response.json()
      setSettings(data)
    } catch (error) {
      console.error("Error fetching site settings:", error)
      toast.error("Failed to fetch site settings")
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setSettings((prev) => (prev ? { ...prev, [name]: value } : null))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!settings) return

    try {
      setIsSaving(true)
      let response = await fetch("/api/admin/site-settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        cache: "no-store",
        body: JSON.stringify(settings),
      })

      if (!response.ok) {
        response = await fetch("/api/site-settings", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          cache: "no-store",
          body: JSON.stringify(settings),
        })
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.details || errorData.error || "Failed to update site settings")
      }

      const updatedData = await response.json()
      setSettings(updatedData)
      toast.success("Site settings updated successfully")
      router.refresh()
    } catch (error: any) {
      console.error("Error updating site settings:", error)
      toast.error(error?.message || "Failed to update site settings")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!settings) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-red-500 font-medium">Failed to load site settings</p>
        <Button onClick={fetchSettings} variant="outline">Retry</Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Site Settings</CardTitle>
          <CardDescription>
            Update your site's contact information and social media links
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                value={settings.phoneNumber || ""}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={settings.email || ""}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                value={settings.address || ""}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
              <div className="space-y-2">
                <Label htmlFor="consultationPrice">Consultation Fee ($)</Label>
                <Input
                  id="consultationPrice"
                  name="consultationPrice"
                  value={settings.consultationPrice || ""}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="consultationLink">Consultation Link</Label>
                <Input
                  id="consultationLink"
                  name="consultationLink"
                  value={settings.consultationLink || ""}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="whatsappLink">WhatsApp Link</Label>
              <Input
                id="whatsappLink"
                name="whatsappLink"
                value={settings.whatsappLink || ""}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="facebookLink">Facebook Link</Label>
              <Input
                id="facebookLink"
                name="facebookLink"
                value={settings.facebookLink || ""}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="instagramLink">Instagram Link</Label>
              <Input
                id="instagramLink"
                name="instagramLink"
                value={settings.instagramLink || ""}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="twitterLink">Twitter Link</Label>
              <Input
                id="twitterLink"
                name="twitterLink"
                value={settings.twitterLink || ""}
                onChange={handleChange}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
