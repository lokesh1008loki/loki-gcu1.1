"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"

const Toaster = dynamic(
  () => import("@/components/ui/sonner").then((mod) => mod.Toaster),
  { ssr: false }
)

const PopupNotification = dynamic(
  () => import("@/components/PopupNotification").then((mod) => mod.PopupNotification),
  { ssr: false }
)

export function ClientComponents() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <>
      <Toaster />
      <PopupNotification />
    </>
  )
}
