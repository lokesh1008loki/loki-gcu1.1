"use client"

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
  return (
    <>
      <Toaster />
      <PopupNotification />
    </>
  )
}