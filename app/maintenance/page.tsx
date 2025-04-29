"use client"

import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"

export default function MaintenancePage() {
  const [isLoading, setIsLoading] = useState(true)
  const [maintenanceInfo, setMaintenanceInfo] = useState<{
    isActive: boolean
    message?: string
    estimatedTime?: string
  } | null>(null)

  useEffect(() => {
    const checkMaintenance = async () => {
      try {
        const response = await fetch("/api/maintenance")
        const data = await response.json()
        setMaintenanceInfo(data)
      } catch (error) {
        console.error("Error checking maintenance status:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkMaintenance()
    const interval = setInterval(checkMaintenance, 30000) // Check every 30 seconds
    return () => clearInterval(interval)
  }, [])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!maintenanceInfo?.isActive) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-md rounded-lg border bg-card p-6 text-card-foreground shadow-lg">
        <h2 className="text-2xl font-bold text-destructive">Maintenance Mode</h2>
        <p className="mt-4 text-muted-foreground">
          {maintenanceInfo.message || "The site is currently under maintenance. Please check back later."}
        </p>
        {maintenanceInfo.estimatedTime && (
          <p className="mt-2 text-sm text-muted-foreground">
            Estimated completion time: {maintenanceInfo.estimatedTime}
          </p>
        )}
      </div>
    </div>
  )
} 