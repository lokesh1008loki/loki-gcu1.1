"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { X, Copy, Check } from "lucide-react"
import { toast } from "sonner"

interface Popup {
  id: string
  title: string
  content: string
  isActive: boolean
}

export function PopupNotification() {
  const [popup, setPopup] = useState<Popup | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const pathname = usePathname()

  // Function to find and replace promo codes with copy buttons
  const processContent = (content: string) => {
    // Regular expression to match 4-8 capital letters followed by numbers
    const promoCodeRegex = /([A-Z]{4,8}\d+)/g;
    
    // Replace each match with a copy button
    return content.replace(promoCodeRegex, (match) => {
      return `<span class="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">
        ${match}
        <button 
          onclick="copyPromoCode('${match}')"
          class="copy-btn inline-flex items-center justify-center h-6 w-6 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
          data-code="${match}"
        >
          <svg class="copy-icon h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M16 1H4C2.9 1 2 1.9 2 3V17H4V3H16V1ZM19 5H8C6.9 5 6 5.9 6 7V21C6 22.1 6.9 23 8 23H19C20.1 23 21 22.1 21 21V7C21 5.9 20.1 5 19 5ZM19 21H8V7H19V21Z"/>
          </svg>
          <svg class="check-icon h-4 w-4 hidden" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 6L9 17L4 12"/>
          </svg>
        </button>
      </span>`;
    });
  };

  // Function to copy promo code
  const copyPromoCode = (code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    });
  };

  useEffect(() => {
    // Add copyPromoCode to window object
    (window as any).copyPromoCode = copyPromoCode;

    // Add click event listeners to copy buttons
    const addCopyButtonListeners = () => {
      const copyButtons = document.querySelectorAll('.copy-btn');
      copyButtons.forEach(button => {
        button.addEventListener('click', (e) => {
          e.preventDefault();
          const code = button.getAttribute('data-code');
          if (code) {
            copyPromoCode(code);
            toast.success(`Copied ${code} to clipboard!`);
          }
        });
      });
    };

    // Add listeners after content is rendered
    if (popup) {
      setTimeout(addCopyButtonListeners, 0);
    }

    return () => {
      // Cleanup
      delete (window as any).copyPromoCode;
    };
  }, [popup]);

  useEffect(() => {
    console.log("PopupNotification component mounted")
    const fetchPopup = async () => {
      try {
        console.log("Fetching popup...")
        if (pathname?.startsWith('/admin')) {
          console.log("Skipping popup fetch on admin page")
          return
        }

        setIsLoading(true)
        setError(null)
        
        console.log("Making API request to /api/popup")
        const response = await fetch("/api/popup", {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Referer': window.location.href
          },
          cache: 'no-store',
          next: { revalidate: 0 }
        })
        
        console.log("Popup API response status:", response.status)
        
        if (!response.ok) {
          const errorText = await response.text()
          console.error("API error response:", errorText)
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        console.log("Popup API response data:", data)

        if (data.popup) {
          console.log("Setting popup data:", data.popup)
          // Ensure we have all required fields
          if (!data.popup.title || !data.popup.content) {
            console.error("Popup data missing required fields:", data.popup)
            throw new Error("Popup data missing required fields")
          }
          setPopup(data.popup)
          setIsVisible(true)
        } else {
          console.log("No popup data received")
          setPopup(null)
          setIsVisible(false)
        }
      } catch (error) {
        console.error("Error fetching popup:", error)
        setError(error instanceof Error ? error.message : "Failed to fetch popup")
        setPopup(null)
        setIsVisible(false)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPopup()
  }, [pathname])

  // Debug render
  console.log("PopupNotification render state:", {
    isLoading,
    error,
    popup,
    isVisible,
    pathname
  })

  if (isLoading) {
    console.log("Loading popup...")
    return null
  }

  if (error) {
    console.error("Popup error:", error)
    return null
  }

  if (!popup || !isVisible) {
    console.log("No popup to show:", { popup, isVisible })
    return null
  }

  console.log("Rendering popup:", popup)

  // Process content to add copy buttons
  const processedContent = processContent(popup.content);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm pointer-events-auto"
        onClick={() => setIsVisible(false)}
      />
      
      {/* Popup Box */}
      <div className="relative z-[10000] bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md mx-4 pointer-events-auto">
        <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4">
          <h3 className="text-xl font-bold text-white pr-8">{popup.title}</h3>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 text-white hover:bg-blue-700/50 hover:text-white rounded-full"
            onClick={() => setIsVisible(false)}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Dismiss</span>
          </Button>
        </div>
        <div className="p-6">
          <div 
            className="text-gray-700 dark:text-gray-300 text-base"
            dangerouslySetInnerHTML={{ __html: processedContent }}
          />
        </div>
      </div>
    </div>
  )
} 