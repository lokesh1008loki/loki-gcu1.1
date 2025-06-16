"use client"

import { useEffect, useState, useCallback, memo, useMemo } from "react"
import { usePathname } from "next/navigation"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { X, Copy, Check, Bell } from "lucide-react"
import { useSafeToast } from "@/lib/hooks/use-safe-toast"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface Popup {
  id: string
  title: string
  content: string
  isActive: boolean
  startDate: string
  endDate: string
  priority: number
  createdAt: string
  updatedAt: string
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
        {formatMessage(popup.content)}
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
  const [popup, setPopup] = useState<Popup | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dismissedPopups, setDismissedPopups] = useState<string[]>([])
  const [isVisible, setIsVisible] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const fetchPopups = useCallback(async () => {
    try {
      // Don't fetch popups on admin pages
      if (pathname?.startsWith('/admin')) {
        return
      }

      setIsLoading(true)
      setError(null)
      const response = await fetch("/api/popup")
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(errorData?.message || "Failed to fetch popup")
      }

      const data = await response.json()
      console.log("Popup API response:", data)

      if (data.popup) {
        setPopup(data.popup)
        setTimeout(() => setIsVisible(true), 500)
      } else {
        console.log("No popup data received")
        setPopup(null)
      }
    } catch (err) {
      console.error("Error fetching popup:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch popup")
      setPopup(null)
    } finally {
      setIsLoading(false)
    }
  }, [pathname])

  useEffect(() => {
    if (isMounted) {
      fetchPopups()
    }
  }, [fetchPopups, isMounted])

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedCode(text)
      toast.success("Code copied to clipboard!")
      setTimeout(() => setCopiedCode(null), 2000)
    } catch (err) {
      toast.error("Failed to copy code")
    }
  }

  if (!isMounted) {
    return null
  }

  if (isLoading) {
    return null
  }

  if (error) {
    console.error("Popup error:", error)
    return null
  }

  if (!popup) {
    return null
  }

  const isDismissed = dismissedPopups.includes(popup.id)

  if (isDismissed) {
    return null
  }

  const handleDismiss = () => {
    setIsVisible(false)
    setTimeout(() => {
      setDismissedPopups(prev => [...prev, popup.id])
    }, 300)
  }

  const formatContent = (content: string) => {
    if (!content) return "No content available"
    
    // First, handle HTML tags
    const contentWithHTML = content
      .replace(/<strong>(.*?)<\/strong>/g, '<span class="font-bold">$1</span>')
      .replace(/<br>/g, '<br/>')
      .replace(/<br\/>/g, '<br/>')
    
    // Function to detect and format promo codes
    const formatPromoCodes = (text: string) => {
      // Match 4-8 capital letters followed by numbers
      const promoCodeRegex = /([A-Z]{4,8}\d+)/g
      const parts = text.split(promoCodeRegex)
      
      return parts.map((part, index) => {
        if (part.match(promoCodeRegex)) {
          return (
            <span key={index} className="inline-flex items-center gap-1">
              <span className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100 px-2 py-1 rounded font-mono">
                {part}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                onClick={() => copyToClipboard(part)}
              >
                {copiedCode === part ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </span>
          )
        }
        return <span key={index} dangerouslySetInnerHTML={{ __html: part }} />
      })
    }
    
    // Split content into sections
    const sections = contentWithHTML.split('<br/><br/>')
    
    return sections.map((section, sectionIndex) => {
      // Handle the service list section
      if (section.includes('►')) {
        const items = section.split('<br/>').filter(item => item.trim())
        return (
          <div key={sectionIndex} className="mb-6">
            {items.map((item, itemIndex) => {
              if (item.includes('►')) {
                return (
                  <div key={itemIndex} className="flex items-center gap-3 mb-2">
                    <span className="text-blue-600 dark:text-blue-400">►</span>
                    <span className="flex-1">
                      {formatPromoCodes(item.replace('►', '').trim())}
                    </span>
                  </div>
                )
              }
              return null
            })}
          </div>
        )
      }

      // Handle regular text sections
      return (
        <div key={sectionIndex} className="mb-6">
          {section.split('<br/>').map((line, lineIndex) => {
            // Handle lines with emojis
            if (line.match(/[\u{1F300}-\u{1F9FF}]/u)) {
              return (
                <p key={lineIndex} className="mb-2 flex items-center gap-2">
                  {formatPromoCodes(line)}
                </p>
              )
            }

            // Handle lines with percentages
            if (line.includes('%')) {
              const parts = line.split(/(\d+%OFF|\d+%)/g)
              return (
                <p key={lineIndex} className="mb-2">
                  {parts.map((part, partIndex) => {
                    if (part.match(/\d+%OFF|\d+%/)) {
                      return (
                        <span
                          key={partIndex}
                          className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100 px-2 py-1 rounded font-bold"
                        >
                          {part}
                        </span>
                      )
                    }
                    return <span key={partIndex}>{formatPromoCodes(part)}</span>
                  })}
                </p>
              )
            }

            // Regular line
            return (
              <p key={lineIndex} className="mb-2">
                {formatPromoCodes(line)}
              </p>
            )
          })}
        </div>
      )
    })
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center"
            onClick={handleDismiss}
          />
          
          {/* Popup Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden w-full max-w-md">
              <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4">
                <h3 className="text-xl font-bold text-white pr-8">{popup.title}</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 text-white hover:bg-blue-700/50 hover:text-white rounded-full"
                  onClick={handleDismiss}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Dismiss</span>
                </Button>
              </div>
              <div className="p-6 max-h-[70vh] overflow-y-auto">
                <div className="text-gray-700 dark:text-gray-300 text-base">
                  {formatContent(popup.content)}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
} 