"use client"

import { useEffect, useState, useCallback, memo, useMemo } from "react"
import { usePathname } from "next/navigation"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { X, Copy, Check } from "lucide-react"
import { useSafeToast } from "@/lib/hooks/use-safe-toast"

interface Popup {
  id: string
  title: string
  message: string
  type: string
  isActive: boolean
  startDate: string | null
  endDate: string | null
  showOnPages: string[]
}

// Separate component for promo code with copy button
const PromoCode = memo(({ code }: { code: string }) => {
  const [copied, setCopied] = useState(false)
  const { showToast } = useSafeToast()

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    showToast("Code copied to clipboard!")
    setTimeout(() => setCopied(false), 2000)
  }, [code, showToast])

  return (
    <span className="inline-flex items-center gap-1">
      <code className="bg-gray-100 px-2 py-1 rounded">{code}</code>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleCopy}
        className="h-6 w-6 p-0"
      >
        {copied ? (
          <Check className="h-3 w-3 text-green-500" />
        ) : (
          <Copy className="h-3 w-3" />
        )}
      </Button>
    </span>
  )
})

PromoCode.displayName = 'PromoCode'

// Memoized alert component
const PopupAlert = memo(({ 
  popup, 
  onDismiss, 
  alertVariant 
}: { 
  popup: Popup, 
  onDismiss: (id: string) => void, 
  alertVariant: "default" | "destructive" | null | undefined 
}) => (
  <Alert
    variant={alertVariant}
    className="relative w-[92vw] sm:w-[400px] shadow-lg mx-4 sm:mx-0"
  >
    <button
      onClick={() => onDismiss(popup.id)}
      className="absolute right-2 top-2 p-1 hover:bg-gray-100 rounded-full"
    >
      <X className="h-4 w-4" />
    </button>
    <AlertTitle className="text-lg font-bold mb-2">{popup.title}</AlertTitle>
    <AlertDescription className="space-y-2">
      {formatMessage(popup.message)}
    </AlertDescription>
  </Alert>
))

PopupAlert.displayName = 'PopupAlert'

// Helper function to format message with promo codes
const formatMessage = (message: string) => {
  // Split the message by <br/> tags
  const parts = message.split(/<br\/?>/)
  
  return parts.map((part, index) => {
    // If the part starts with ►, style it as a highlighted bullet point
    if (part.trim().startsWith("►")) {
      return (
        <p key={index} className="text-primary font-medium">
          {part}
        </p>
      )
    }

    // Find all promo codes in the text (words in all caps)
    const words = part.split(/\s+/)
    const formattedWords = words.map((word, wordIndex) => {
      // Check if the word is a promo code (all caps and at least 4 characters)
      if (word.match(/^[A-Z0-9]{4,}$/)) {
        return <PromoCode key={wordIndex} code={word} />
      }
      return word + " "
    })

    return <p key={index}>{formattedWords}</p>
  })
}

export function PopupNotification() {
  const [popups, setPopups] = useState<Popup[]>([])
  const [dismissedPopups, setDismissedPopups] = useState<string[]>([])
  const pathname = usePathname()
  const { showToast } = useSafeToast()

  // Memoize the fetch function
  const fetchPopups = useCallback(async () => {
    try {
      const response = await fetch("/api/popups", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        next: { revalidate: 300 } // Revalidate every 5 minutes
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(errorData?.error || "Failed to fetch popups")
      }

      const data = await response.json()
      setPopups(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error fetching popups:", error)
      setPopups([])
      showToast("Failed to fetch popups", "error")
    }
  }, [showToast])

  useEffect(() => {
    fetchPopups()
    
    // Set up polling for updates every 5 minutes
    const intervalId = setInterval(fetchPopups, 5 * 60 * 1000)
    
    // Clean up interval on component unmount
    return () => clearInterval(intervalId)
  }, [fetchPopups])

  const handleDismiss = useCallback((popupId: string) => {
    setDismissedPopups(prev => [...prev, popupId])
  }, [])

  const isPopupVisible = useCallback((popup: Popup) => {
    if (!popup.isActive) return false
    if (dismissedPopups.includes(popup.id)) return false

    const now = new Date()
    if (popup.startDate && new Date(popup.startDate) > now) return false
    if (popup.endDate && new Date(popup.endDate) < now) return false

    return popup.showOnPages.some(page => {
      if (page === "/") return pathname === "/"
      return pathname.startsWith(page)
    })
  }, [dismissedPopups, pathname])

  const getAlertVariant = useCallback((type: string) => {
    switch (type) {
      case "success":
        return "default"
      case "warning":
        return "default"
      case "error":
        return "destructive"
      default:
        return "default"
    }
  }, [])

  // Memoize visible popups
  const visiblePopups = useMemo(() => {
    return popups.filter(popup => isPopupVisible(popup))
  }, [popups, isPopupVisible])

  if (visiblePopups.length === 0) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-0 sm:right-4 z-50 space-y-4">
      {visiblePopups.map(popup => (
        <PopupAlert
          key={popup.id}
          popup={popup}
          onDismiss={handleDismiss}
          alertVariant={getAlertVariant(popup.type)}
        />
      ))}
    </div>
  )
} 