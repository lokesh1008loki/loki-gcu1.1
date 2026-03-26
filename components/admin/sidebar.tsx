"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  Ticket,
  CreditCard,
  Plane,
  ShoppingBag,
  ImageIcon,
  Settings,
  LogOut,
  FileText,
  FileSpreadsheet,
  Users,
  PlusCircle,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Menu,
  Bell,
  LayoutGrid,
  Search,
} from "lucide-react"
import { useState } from "react"

const navigation = [
  {
    name: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Blog",
    href: "/admin/blogs",
    icon: FileText,
  },
  {
    name: "Marquee",
    href: "/admin/dashboard/marquee",
    icon: Bell,
  },
  {
    name: "Tickets & Parks",
    href: "/admin/dashboard/tickets",
    icon: Ticket,
  },
  {
    name: "Bills & Payments",
    href: "/admin/dashboard/bills",
    icon: CreditCard,
  },
  {
    name: "Popups",
    href: "/admin/dashboard/popups",
    icon: Bell,
  },
  {
    name: "Travel",
    href: "/admin/dashboard/travel",
    icon: Plane,
  },
  {
    name: "Food & Grocery",
    href: "/admin/dashboard/food",
    icon: ShoppingBag,
  },
  {
    name: "Media Library",
    href: "/admin/dashboard/media",
    icon: ImageIcon,
  },
  {
    name: "Forms",
    href: "/admin/dashboard/forms",
    icon: FileSpreadsheet,
  },
  {
    name: "Users",
    href: "/admin/users",
    icon: Users,
    subItems: [
      {
        name: "Add User",
        href: "/admin/users/add",
        icon: PlusCircle,
      }
    ]
  },
  {
    name: "Site Settings",
    href: "/admin/site-settings",
    icon: Settings,
  },
  {
    name: "SEO",
    href: "/admin/dashboard/seo",
    icon: Search,
  },
  {
    name: "Navbar",
    href: "/admin/navbar",
    icon: Menu,
  },
]

interface AdminSidebarProps {
  isOpen: boolean
  setIsOpenAction: (isOpen: boolean) => void
  isCollapsed: boolean
  setIsCollapsedAction: (isCollapsed: boolean) => void
}

export function AdminSidebar({ isOpen, setIsOpenAction, isCollapsed, setIsCollapsedAction }: AdminSidebarProps) {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({})

  const toggleItem = (name: string, event: React.MouseEvent) => {
    event.stopPropagation()
    setExpandedItems(prev => ({
      ...prev,
      [name]: !prev[name]
    }))
  }

  const toggleSidebar = () => {
    setIsCollapsedAction(!isCollapsed)
    setIsOpenAction(true)
  }

  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 z-50 bg-white border-r border-gray-200 transform transition-all duration-200 ease-in-out overflow-y-auto",
        isCollapsed ? "w-16" : "w-64",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          {!isCollapsed && <h1 className="text-xl font-semibold text-gray-900">Admin Panel</h1>}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="ml-auto"
          >
            {isCollapsed ? <Menu className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </Button>
        </div>
        <nav className="flex-1 px-2 py-4 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href || (item.subItems && item.subItems.some(subItem => pathname === subItem.href))
            const hasSubItems = item.subItems && item.subItems.length > 0
            const isExpanded = expandedItems[item.name]

            return (
              <div key={item.href} className="space-y-1">
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center px-4 py-2 text-sm font-medium rounded-md group",
                    isActive
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {!isCollapsed && (
                    <>
                      <span className="ml-3 flex-1">{item.name}</span>
                      {hasSubItems && (
                        <button
                          onClick={(e) => toggleItem(item.name, e)}
                          className="p-1 hover:bg-gray-200 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        </button>
                      )}
                    </>
                  )}
                </Link>
                {!isCollapsed && hasSubItems && isExpanded && (
                  <div className="ml-8 space-y-1">
                    {item.subItems.map((subItem) => {
                      const isSubActive = pathname === subItem.href
                      return (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                          className={cn(
                            "flex items-center px-4 py-2 text-sm font-medium rounded-md",
                            isSubActive
                              ? "bg-gray-100 text-gray-900"
                              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                          )}
                        >
                          <subItem.icon className="w-5 h-5 mr-3" />
                          {subItem.name}
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </nav>
        <div className="p-4 border-t border-gray-200">
          <Button
            variant="ghost"
            className={cn("w-full justify-start", isCollapsed && "justify-center")}
            onClick={() => {
              // Handle logout
            }}
          >
            <LogOut className="w-5 h-5" />
            {!isCollapsed && <span className="ml-3">Logout</span>}
          </Button>
        </div>
      </div>
    </div>
  )
}
