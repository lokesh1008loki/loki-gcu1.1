"use client"

import { SessionProvider } from "next-auth/react"
import { ToastProvider } from "./toast-provider"

export function AdminClientWrapper({ 
  children,
  session
}: { 
  children: React.ReactNode
  session: any
}) {
  return (
    <SessionProvider session={session}>
      <ToastProvider />
      {children}
    </SessionProvider>
  )
} 