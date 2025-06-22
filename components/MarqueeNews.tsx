"use client"

import { useEffect, useState, useMemo, useCallback, memo, Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"

interface MarqueeMessage {
  id: string
  message: string
  isActive: boolean
  backgroundColor: string
  textColor: string
  createdAt: Date
  updatedAt: Date
}

// Fallback component for error boundary
function MarqueeErrorFallback() {
  return null; // Silently fail without breaking the UI
}

// Memoized message item component
const MarqueeMessageItem = memo(({ message, textColor }: { message: string, textColor: string }) => (
  <span className={`mx-4 whitespace-nowrap ${textColor}`}>
    {message}
  </span>
));

MarqueeMessageItem.displayName = 'MarqueeMessageItem';

// Memoized skeleton loader
const MarqueeSkeleton = memo(() => (
  <div className="w-full bg-gray-200 animate-pulse py-2">
    <div className="flex items-center">
      <span className="font-bold mr-4 w-24 h-4 bg-gray-300 rounded"></span>
      <div className="flex-1 h-4 bg-gray-300 rounded"></div>
    </div>
  </div>
));

MarqueeSkeleton.displayName = 'MarqueeSkeleton';

// Memoized error component
const MarqueeError = memo(({ error }: { error: string }) => (
  <div className="w-full bg-red-100 text-red-800 py-2 px-4">
    <p>Error loading news: {error}</p>
  </div>
));

MarqueeError.displayName = 'MarqueeError';

function MarqueeNewsComponent() {
  const [messages, setMessages] = useState<MarqueeMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastFetch, setLastFetch] = useState<number>(0)

  // Memoize the fetch function to prevent unnecessary re-renders
  const fetchMessages = useCallback(async () => {
    // Check if we should fetch (avoid too frequent requests)
    const now = Date.now()
    if (now - lastFetch < 300000) { // 5 minutes
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      
      const response = await fetch("/api/marquee", {
        headers: {
          'Cache-Control': 'max-age=300', // Cache for 5 minutes
        },
        next: { revalidate: 300 }
      })
      
      if (!response.ok) {
        throw new Error(`Failed to fetch marquee messages: ${response.status}`)
      }
      
      const data = await response.json()
      setMessages(data.filter((msg: MarqueeMessage) => msg.isActive))
      setLastFetch(now)
    } catch (error) {
      console.error("Error fetching marquee messages:", error)
      setError(error instanceof Error ? error.message : "Unknown error occurred")
    } finally {
      setIsLoading(false)
    }
  }, [lastFetch])

  useEffect(() => {
    // Fetch immediately on mount
    fetchMessages()
    
    // Set up polling for updates every 10 minutes (reduced frequency)
    const intervalId = setInterval(fetchMessages, 10 * 60 * 1000)
    
    return () => clearInterval(intervalId)
  }, [fetchMessages])

  // Memoize the background color class function
  const getBackgroundColorClass = useCallback((color: string) => {
    switch (color) {
      case "primary":
        return "bg-primary"
      case "secondary":
        return "bg-secondary"
      case "accent":
        return "bg-accent"
      case "destructive":
        return "bg-destructive"
      case "muted":
        return "bg-muted"
      default:
        return "bg-primary"
    }
  }, [])

  // Memoize the text color class function
  const getTextColorClass = useCallback((color: string) => {
    switch (color) {
      case "white":
        return "text-white"
      case "black":
        return "text-black"
      case "primary":
        return "text-primary"
      case "secondary":
        return "text-secondary"
      case "accent":
        return "text-accent"
      case "destructive":
        return "text-destructive"
      case "muted":
        return "text-muted"
      default:
        return "text-white"
    }
  }, [])

  // Memoize the filtered messages to prevent unnecessary re-renders
  const activeMessages = useMemo(() => {
    return messages.filter(msg => msg.isActive)
  }, [messages])

  // Memoize the background and text color classes
  const backgroundColorClass = useMemo(() => 
    activeMessages.length > 0 
      ? getBackgroundColorClass(activeMessages[0].backgroundColor)
      : "bg-primary", 
    [activeMessages, getBackgroundColorClass]
  )
  
  const textColorClass = useMemo(() => 
    activeMessages.length > 0
      ? getTextColorClass(activeMessages[0].textColor)
      : "", // Return empty string instead of defaulting to white
    [activeMessages, getTextColorClass]
  )

  // Show messages immediately if we have them, even while loading
  if (messages.length > 0) {
    return (
      <div className={`w-full overflow-hidden ${backgroundColorClass} py-2`}>
        <div className="flex items-center">
          <span className="font-bold mr-4 whitespace-nowrap text-black">Latest News:</span>
          <div className="relative overflow-hidden flex-1">
            <div className="animate-marquee">
              {messages.map((message) => (
                <MarqueeMessageItem 
                  key={message.id} 
                  message={message.message} 
                  textColor={getTextColorClass(message.textColor)}
                />
              ))}
              {messages.map((message) => (
                <MarqueeMessageItem 
                  key={`${message.id}-dup`} 
                  message={message.message} 
                  textColor={getTextColorClass(message.textColor)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Only show loading state if we have no messages
  if (isLoading) {
    return <MarqueeSkeleton />
  }

  // Show error only if we have no messages
  if (error) {
    return <MarqueeError error={error} />
  }

  return null
}

// Wrap the component with ErrorBoundary and memo
export const MarqueeNews = memo(function MarqueeNews() {
  return (
    <ErrorBoundary FallbackComponent={MarqueeErrorFallback}>
      <Suspense fallback={<MarqueeSkeleton />}>
        <MarqueeNewsComponent />
      </Suspense>
    </ErrorBoundary>
  )
}) 