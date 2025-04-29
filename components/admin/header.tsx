"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { Bell, User } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function AdminHeader() {
  const [pageTitle, setPageTitle] = useState("Dashboard")
  const pathname = usePathname()

  useEffect(() => {
    // Set page title based on current path
    if (pathname === "/admin/dashboard") {
      setPageTitle("Dashboard")
    } else if (pathname === "/admin/users") {
      setPageTitle("Users")
    } else if (pathname === "/admin/users/add") {
      setPageTitle("Add User")
    } else if (pathname === "/admin/settings") {
      setPageTitle("Settings")
    }
  }, [pathname])

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", {
        method: "POST",
      })
      window.location.href = "/admin/login"
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  return (
    <header className="bg-card border-b border-border p-4 sticky top-0 z-10">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">{pageTitle}</h1>
        <div className="flex items-center space-x-2">
          <ModeToggle />
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Admin Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
