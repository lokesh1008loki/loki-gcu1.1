"use client"

import { useEffect, useState, useCallback, memo, useMemo } from "react"
import { usePathname } from "next/navigation"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { X, Copy, Check, Bell } from "lucide-react"
import { useSafeToast } from "@/lib/hooks/use-safe-toast"
import { motion, AnimatePresence } from "framer-motion"

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
      <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded font-mono text-sm">{code}</code>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleCopy}
        className="h-6 w-6 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
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
  <motion.div
    initial={{ opacity: 0, y: 50, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: 50, scale: 0.95 }}
    transition={{ type: "spring", damping: 20, stiffness: 300 }}
  >
    <Alert
      variant={alertVariant}
      className="relative w-[92vw] sm:w-[400px] shadow-xl mx-4 sm:mx-0 border-2 bg-white dark:bg-gray-900 backdrop-blur-sm"
    >
      <div className="absolute -top-3 -left-3 bg-primary text-white p-2 rounded-full shadow-lg">
        <Bell className="h-4 w-4" />
      </div>
      <button
        onClick={() => onDismiss(popup.id)}
        className="absolute right-2 top-2 p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
      <AlertTitle className="text-lg font-bold mb-2 mt-1">{popup.title}</AlertTitle>
      <AlertDescription className="space-y-2 text-gray-700 dark:text-gray-300">
        {formatMessage(popup.message)}
      </AlertDescription>
    </Alert>
  </motion.div>
))

PopupAlert.displayName = 'PopAlert'

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
  const [showPopups, setShowPopups] = useState(false)
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

  // Add delay effect
  useEffect(() => {
    const randomDelay = Math.floor(Math.random() * (10000 - 5000 + 1)) + 5000; // Random delay between 5-10 seconds
    const timer = setTimeout(() => {
      setShowPopups(true)
    }, randomDelay)

    return () => clearTimeout(timer)
  }, [])

  const handleDismiss = useCallback((popupId: string) => {
    setDismissedPopups(prev => [...prev, popupId])
  }, [])

  const isPopupVisible = useCallback((popup: Popup) => {
    if (!popup.isActive) return false
    if (dismissedPopups.includes(popup.id)) return false
    if (!showPopups) return false // Don't show if delay hasn't passed

    const now = new Date()
    if (popup.startDate && new Date(popup.startDate) > now) return false
    if (popup.endDate && new Date(popup.endDate) < now) return false

    return popup.showOnPages.some(page => {
      if (page === "/") return pathname === "/"
      return pathname.startsWith(page)
    })
  }, [dismissedPopups, pathname, showPopups])

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
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      <div className="space-y-4 pointer-events-auto">
        <AnimatePresence>
          {visiblePopups.map(popup => (
            <PopupAlert
              key={popup.id}
              popup={popup}
              onDismiss={handleDismiss}
              alertVariant={getAlertVariant(popup.type)}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
} 