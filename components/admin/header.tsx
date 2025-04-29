"use client"

import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { Bell, User, LayoutDashboard, BellRing, Settings, Search } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

const navigation = [
  {
    name: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Marquee",
    href: "/admin/dashboard/marquee",
    icon: Bell,
  },
  {
    name: "Popup",
    href: "/admin/dashboard/popups",
    icon: BellRing,
  },
  {
    name: "SEO",
    href: "/admin/dashboard/seo",
    icon: Search,
  },
  {
    name: "Settings",
    href: "/admin/site-settings",
    icon: Settings,
  },
]

export function AdminHeader() {
  const [pageTitle, setPageTitle] = useState("Dashboard")
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    // Set page title based on current path
    const currentNav = navigation.find(nav => pathname.startsWith(nav.href))
    if (currentNav) {
      setPageTitle(currentNav.name)
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
    <header className="bg-card border-b border-border sticky top-0 z-10">
      <div className="flex flex-col">
        <div className="flex items-center justify-between p-4">
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
      </div>
    </header>
  )
}
