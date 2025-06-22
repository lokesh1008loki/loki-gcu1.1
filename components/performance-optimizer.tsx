"use client"

import { Suspense, lazy, useEffect, useState } from 'react'

// Lazy load heavy components
const LazyMarqueeNews = lazy(() => import('./MarqueeNews').then(module => ({ default: module.MarqueeNews })))
const LazyPopupNotification = lazy(() => import('./PopupNotification').then(module => ({ default: module.PopupNotification })))

// Loading fallbacks
const MarqueeSkeleton = () => (
  <div className="w-full bg-gray-200 animate-pulse py-2">
    <div className="flex items-center">
      <span className="font-bold mr-4 w-24 h-4 bg-gray-300 rounded"></span>
      <div className="flex-1 h-4 bg-gray-300 rounded"></div>
    </div>
  </div>
)

const PopupSkeleton = () => null

interface PerformanceOptimizerProps {
  children: React.ReactNode
  showMarquee?: boolean
  showPopup?: boolean
}

export function PerformanceOptimizer({ 
  children, 
  showMarquee = true, 
  showPopup = true 
}: PerformanceOptimizerProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Don't render lazy components during SSR
  if (!isClient) {
    return (
      <>
        {showMarquee && <MarqueeSkeleton />}
        {children}
        {showPopup && <PopupSkeleton />}
      </>
    )
  }

  return (
    <>
      {showMarquee && (
        <Suspense fallback={<MarqueeSkeleton />}>
          <LazyMarqueeNews />
        </Suspense>
      )}
      {children}
      {showPopup && (
        <Suspense fallback={<PopupSkeleton />}>
          <LazyPopupNotification />
        </Suspense>
      )}
    </>
  )
}

// Preload critical components
export function preloadComponents() {
  // Preload components after initial render
  setTimeout(() => {
    import('./MarqueeNews')
    import('./PopupNotification')
  }, 1000)
} 