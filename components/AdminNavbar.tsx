"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function AdminNavbar() {
  const pathname = usePathname()

  const navItems = [
    { href: "/admin/dashboard", label: "Dashboard" },
    { href: "/admin/dashboard/marquee", label: "Marquee" },
    { href: "/admin/dashboard/popups", label: "Popup" },
    { href: "/admin/dashboard/seo", label: "SEO" },
    { href: "/admin/dashboard/blog", label: "Blog" },
    { href: "/admin/dashboard/settings", label: "Settings" },
  ]

  return (
    <nav className="border-b">
      <div className="flex h-16 items-center px-4">
        <div className="flex items-center space-x-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === item.href
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
} 