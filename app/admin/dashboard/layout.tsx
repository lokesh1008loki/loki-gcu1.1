"use client"

import { signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import type { ReactNode } from "react"
import { Toaster } from "@/components/ui/toaster"
import { Button } from "@/components/ui/button"
import { USATimeZones } from "@/components/USATimeZones"
import '@/app/globals.css'
import { AdminNavbar } from "@/components/AdminNavbar"

export default function DashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false })
      router.push("/admin/login")
      router.refresh()
      toast.success("Logged out successfully")
    } catch (error) {
      toast.error("Failed to log out")
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <AdminNavbar />
      <main className="flex-1">
        <div className="min-h-screen bg-gray-100">
          <div className="mb-6">
            <USATimeZones />
          </div>
          {children}
        </div>
      </main>
    </div>
  )
}
