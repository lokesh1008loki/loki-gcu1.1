"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import { AdminSidebar } from "@/components/admin/sidebar"
import { AdminHeader } from "@/components/admin/header"
import { cn } from "@/lib/utils"

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { data: session, status } = useSession()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  useEffect(() => {
    if (pathname === "/admin/login" || pathname === "/admin/create-admin") {
      return
    }

    if (status === "unauthenticated") {
      router.replace("/admin/login")
    }
  }, [status, router, pathname])

  if (pathname === "/admin/login" || pathname === "/admin/create-admin") {
    return <>{children}</>
  }

  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar 
        isOpen={isSidebarOpen} 
        setIsOpenAction={setIsSidebarOpen}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsedAction={setIsSidebarCollapsed}
      />
      <div className={cn(
        "flex-1 flex flex-col overflow-hidden",
        isSidebarOpen ? "ml-64" : "ml-0",
        isSidebarCollapsed ? "ml-20" : "ml-64"
      )}>
        <AdminHeader />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <div className="max-w-full mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
} 