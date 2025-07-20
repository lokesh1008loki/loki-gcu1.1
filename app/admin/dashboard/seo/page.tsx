"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { ImageUpload } from "@/components/admin/image-upload"

interface SeoSettings {
  id: string
  siteTitle: string
  siteDescription: string
  keywords: string
  ogTitle: string
  ogDescription: string
  ogImage: string
  twitterTitle: string
  twitterDescription: string
  twitterImage: string
  canonicalUrl: string
  active?: boolean // <-- add this
}

export default function SeoSettingsPage() {
  const router = useRouter()
  const [settings, setSettings] = useState<SeoSettings | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/seo")
      if (!response.ok) {
        throw new Error("Failed to fetch SEO settings")
      }
      const data = await response.json()
      setSettings({ ...data, active: data.active ?? false })
    } catch (error) {
      console.error("Error fetching SEO settings:", error)
      toast.error("Failed to fetch SEO settings")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!settings) return

    try {
      setIsSaving(true)
      const response = await fetch("/api/seo", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      })

      if (!response.ok) {
        throw new Error("Failed to update SEO settings")
      }

      toast.success("Your SEO settings have been saved successfully!", {
        duration: 3000,
      })
      
      // Refresh the page to apply new SEO settings
      router.refresh()
    } catch (error) {
      console.error("Error updating SEO settings:", error)
      toast.error("Failed to update SEO settings. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleImageUpload = (url: string, type: 'og' | 'twitter') => {
    if (type === 'og') {
      setSettings(prev => prev ? { ...prev, ogImage: url } : null)
    } else {
      setSettings(prev => prev ? { ...prev, twitterImage: url } : null)
    }
  }

  // Add this function to handle toggle and auto-save
  const handleToggleActive = async () => {
    if (!settings) return;
    const newActive = !settings.active;
    setSettings({ ...settings, active: newActive });
    try {
      setIsSaving(true);
      const response = await fetch("/api/seo", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...settings, active: newActive }),
      });
      if (!response.ok) {
        throw new Error("Failed to update SEO status");
      }
      toast.success(`SEO is now ${newActive ? "Active" : "Inactive"}`);
      router.refresh();
    } catch (error) {
      console.error("Error updating SEO status:", error);
      toast.error("Failed to update SEO status. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!settings) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">Failed to load SEO settings</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>SEO Settings</CardTitle>
          <CardDescription>
            Manage your site's SEO settings and metadata. Changes will be applied immediately.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {/* SEO Active Toggle */}
            <div className="flex items-center space-x-4 mb-4">
              <Label htmlFor="seo-active">SEO Status:</Label>
              <Button
                type="button"
                variant={settings.active ? "default" : "outline"}
                className={settings.active ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700 text-white"}
                onClick={handleToggleActive}
              >
                {settings.active ? "Active (Site uses dashboard SEO)" : "Inactive (Site uses static SEO)"}
              </Button>
            </div>
            <div className="space-y-2">
              <Label htmlFor="siteTitle">Site Title</Label>
              <Input
                id="siteTitle"
                value={settings.siteTitle}
                onChange={(e) => setSettings({ ...settings, siteTitle: e.target.value })}
                placeholder="Your site's main title"
                maxLength={60}
              />
              <p className="text-sm text-muted-foreground">
                This appears in browser tabs and search results (max 60 characters)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="siteDescription">Site Description</Label>
              <Textarea
                id="siteDescription"
                value={settings.siteDescription}
                onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                placeholder="Your site's main description"
                maxLength={160}
              />
              <p className="text-sm text-muted-foreground">
                This appears in search results (max 160 characters)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="keywords">Keywords</Label>
              <Input
                id="keywords"
                value={settings.keywords}
                onChange={(e) => setSettings({ ...settings, keywords: e.target.value })}
                placeholder="Comma-separated keywords"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="canonicalUrl">Canonical URL</Label>
              <Input
                id="canonicalUrl"
                value={settings.canonicalUrl}
                onChange={(e) => setSettings({ ...settings, canonicalUrl: e.target.value })}
                placeholder="https://yourdomain.com"
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Open Graph Settings</h3>
              <div className="space-y-2">
                <Label htmlFor="ogTitle">OG Title</Label>
                <Input
                  id="ogTitle"
                  value={settings.ogTitle}
                  onChange={(e) => setSettings({ ...settings, ogTitle: e.target.value })}
                  placeholder="Title for social media sharing"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ogDescription">OG Description</Label>
                <Textarea
                  id="ogDescription"
                  value={settings.ogDescription}
                  onChange={(e) => setSettings({ ...settings, ogDescription: e.target.value })}
                  placeholder="Description for social media sharing"
                />
              </div>

              <div className="space-y-2">
                <Label>OG Image</Label>
                <ImageUpload
                  onImageUploadAction={(url) => handleImageUpload(url, 'og')}
                  currentImage={settings.ogImage}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Twitter Card Settings</h3>
              <div className="space-y-2">
                <Label htmlFor="twitterTitle">Twitter Title</Label>
                <Input
                  id="twitterTitle"
                  value={settings.twitterTitle}
                  onChange={(e) => setSettings({ ...settings, twitterTitle: e.target.value })}
                  placeholder="Title for Twitter sharing"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="twitterDescription">Twitter Description</Label>
                <Textarea
                  id="twitterDescription"
                  value={settings.twitterDescription}
                  onChange={(e) => setSettings({ ...settings, twitterDescription: e.target.value })}
                  placeholder="Description for Twitter sharing"
                />
              </div>

              <div className="space-y-2">
                <Label>Twitter Image</Label>
                <ImageUpload
                  onImageUploadAction={(url) => handleImageUpload(url, 'twitter')}
                  currentImage={settings.twitterImage}
                />
              </div>
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
                "Save SEO Settings"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
} 