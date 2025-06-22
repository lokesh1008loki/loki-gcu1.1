"use client"

import { ToastProvider } from "./toast-provider"

export function AdminClientWrapper({ 
  children,
  session
}: { 
  children: React.ReactNode
  session: any
}) {
  return (
    <>
      <ToastProvider />
      {children}
    </>
  )
} 