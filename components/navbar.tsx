"use client"

import { useState, useEffect, useCallback, memo, useMemo } from "react"
import dynamic from "next/dynamic"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { ChevronDown } from "lucide-react"

// Dynamically import ModeToggle to avoid SSR hydration mismatch
const ModeToggle = dynamic(() => import("@/components/mode-toggle").then((mod) => mod.ModeToggle), {
  ssr: false,
  loading: () => <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-[#272727]" />,
})

export interface NavLinkItem {
  name: string
  href: string
  submenu?: Array<{ name: string; href: string }>
}

const DEFAULT_LINKS: NavLinkItem[] = [
  { name: "Home", href: "/" },
  {
    name: "Tickets & Parks",
    href: "#",
    submenu: [
      { name: "Disneyland", href: "/tickets/disneyland" },
      { name: "Water Park", href: "/tickets/water-park" },
      { name: "Adventure Park", href: "/tickets/adventure-park" },
      { name: "City Pass", href: "/tickets/city-pass" },
      { name: "Universal Studios", href: "/tickets/universal-studios" },
      { name: "Sea World", href: "/tickets/sea-world" },
      { name: "Other Parks", href: "/tickets/other-parks" },
    ],
  },
  {
    name: "Bills & Payments",
    href: "#",
    submenu: [
      { name: "Utility Bills", href: "/bills/utility" },
      { name: "Apartment Rental", href: "/bills/apartment-rental" },
    ],
  },
  {
    name: "Travel",
    href: "#",
    submenu: [
      { name: "Flight", href: "/travel/flight" },
      { name: "Car Rental", href: "/travel/car-rental" },
      { name: "Hotel", href: "/travel/hotel" },
      { name: "Train", href: "/travel/train" },
      { name: "Bus", href: "/travel/bus" },
      { name: "Cruise", href: "/travel/cruise" },
    ],
  },
  { name: "IKEA", href: "/others/ikea" },
  {
    name: "Others",
    href: "#",
    submenu: [
      { name: "Food & Grocery", href: "/others/food-grocery" },
      { name: "FAQ", href: "/faq" },
    ],
  },
  {
    name: "Blog",
    href: "/blog",
  },
]

// Desktop Nav Item
const DesktopNavItem = memo(
  ({
    link,
    pathname,
  }: {
    link: NavLinkItem
    pathname: string
  }) => {
    const isParentActive = Boolean(link.submenu?.some((sub) => pathname === sub.href))
    const isDirectActive = pathname === link.href
    const isActive = isDirectActive || isParentActive

    if (link.submenu && link.submenu.length > 0) {
      return (
        <div className="relative group">
          <button
            type="button"
            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-sm font-medium transition-colors duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
              isActive
                ? "bg-slate-100 dark:bg-[#272727] text-slate-900 dark:text-white"
                : "text-slate-600 dark:text-neutral-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-[#1F1F1F]"
            }`}
          >
            <span>{link.name}</span>
            <ChevronDown className="w-3.5 h-3.5 opacity-60 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:rotate-180" />
          </button>

          {/* Dropdown Menu Card */}
          <div className="absolute left-0 top-full pt-2 w-56 opacity-0 translate-y-1 invisible pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:visible group-hover:pointer-events-auto transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] z-50">
            <div className="bg-white dark:bg-[#1F1F1F] rounded-xl border border-slate-200/80 dark:border-neutral-800 p-1.5 shadow-lg">
              {link.submenu.map((sublink) => {
                const isSubActive = pathname === sublink.href
                return (
                  <Link
                    key={sublink.name}
                    href={sublink.href}
                    className={`block px-3 py-2 text-sm rounded-lg transition-colors duration-150 active:scale-[0.98] ${
                      isSubActive
                        ? "bg-slate-100 dark:bg-[#272727] text-primary font-medium"
                        : "text-slate-700 dark:text-neutral-300 hover:bg-slate-50 dark:hover:bg-[#272727] hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    {sublink.name}
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      )
    }

    return (
      <Link
        href={link.href}
        className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-colors duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
          isActive
            ? "bg-slate-100 dark:bg-[#272727] text-slate-900 dark:text-white"
            : "text-slate-600 dark:text-neutral-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-[#1F1F1F]"
        }`}
      >
        {link.name}
      </Link>
    )
  }
)
DesktopNavItem.displayName = "DesktopNavItem"

// Mobile Nav Item
const MobileNavItem = memo(
  ({
    link,
    pathname,
    openSubmenu,
    toggleSubmenu,
    onNavigate,
    delayMs,
  }: {
    link: NavLinkItem
    pathname: string
    openSubmenu: string | null
    toggleSubmenu: (name: string) => void
    onNavigate: () => void
    delayMs: number
  }) => {
    const isSubmenuOpen = openSubmenu === link.name
    const isParentActive = Boolean(link.submenu?.some((sub) => pathname === sub.href))
    const isDirectActive = pathname === link.href
    const isActive = isDirectActive || isParentActive

    return (
      <div
        style={{
          animation: `slideUpFadeIn 350ms cubic-bezier(0.22, 1, 0.36, 1) ${delayMs}ms both`,
        }}
        className="w-full"
      >
        {link.submenu && link.submenu.length > 0 ? (
          <div className="rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSubmenu(link.name)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-base font-medium transition-colors ${
                isActive
                  ? "bg-slate-100 dark:bg-[#272727] text-slate-900 dark:text-white"
                  : "text-slate-700 dark:text-neutral-200 hover:bg-slate-100 dark:hover:bg-[#272727]"
              }`}
            >
              <span>{link.name}</span>
              <ChevronDown
                className={`w-4 h-4 opacity-60 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  isSubmenuOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {isSubmenuOpen && (
              <div className="mt-1 ml-3 pl-3 border-l border-slate-200 dark:border-neutral-800 space-y-1">
                {link.submenu.map((sublink) => {
                  const isSubActive = pathname === sublink.href
                  return (
                    <Link
                      key={sublink.name}
                      href={sublink.href}
                      onClick={onNavigate}
                      className={`block px-3 py-2 text-sm rounded-lg transition-colors ${
                        isSubActive
                          ? "bg-slate-100 dark:bg-[#272727] text-primary font-medium"
                          : "text-slate-600 dark:text-neutral-300 hover:bg-slate-100 dark:hover:bg-[#272727] hover:text-slate-900 dark:hover:text-white"
                      }`}
                    >
                      {sublink.name}
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        ) : (
          <Link
            href={link.href}
            onClick={onNavigate}
            className={`block px-3.5 py-2.5 rounded-xl text-base font-medium transition-colors ${
              isActive
                ? "bg-slate-100 dark:bg-[#272727] text-slate-900 dark:text-white"
                : "text-slate-700 dark:text-neutral-200 hover:bg-slate-100 dark:hover:bg-[#272727]"
            }`}
          >
            {link.name}
          </Link>
        )}
      </div>
    )
  }
)
MobileNavItem.displayName = "MobileNavItem"

function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const [navLinks, setNavLinks] = useState<NavLinkItem[]>(DEFAULT_LINKS)
  const pathname = usePathname()

  // Dynamic navbar links from database
  useEffect(() => {
    let isMounted = true
    const fetchLinks = async () => {
      try {
        const response = await fetch("/api/navbar-links")
        if (response.ok) {
          const data = await response.json()
          if (isMounted && Array.isArray(data) && data.length > 0) {
            const mappedLinks = data.map((item: any) => {
              const submenu =
                item.subLinks?.map((sub: any) => ({
                  name: sub.name,
                  href: sub.href,
                })) || []

              return {
                name: item.name,
                href: item.href,
                submenu: submenu.length > 0 ? submenu : undefined,
              }
            })
            setNavLinks(mappedLinks)
          }
        }
      } catch (error) {
        console.error("Failed to fetch dynamic navbar links:", error)
      }
    }
    fetchLinks()
    return () => {
      isMounted = false
    }
  }, [])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  // Scroll detection for slight elevation
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 12)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleSubmenu = useCallback((name: string) => {
    setOpenSubmenu((prev) => (prev === name ? null : name))
  }, [])

  const closeMobileMenu = useCallback(() => {
    setIsOpen(false)
    setOpenSubmenu(null)
  }, [])

  return (
    <>
      {/* Resting Floating Navbar (Skill.md B7: Floating off top edge, compact, translucent blur) */}
      <header className="sticky top-3 sm:top-4 z-40 w-full px-3 sm:px-6 pointer-events-none">
        <div
          className={`max-w-6xl mx-auto flex items-center justify-between h-14 md:h-16 px-3.5 sm:px-5 rounded-2xl border transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] pointer-events-auto ${
            scrolled
              ? "bg-white/90 dark:bg-[#181818]/90 backdrop-blur-md border-slate-200/90 dark:border-neutral-800 shadow-sm"
              : "bg-white/80 dark:bg-[#181818]/80 backdrop-blur-md border-slate-200/80 dark:border-neutral-800/80 shadow-xs"
          }`}
        >
          {/* Brand Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl"
            aria-label="GoComfortUSA home"
          >
            <Image
              src="/ass/logo-round.png"
              alt="GoComfortUSA"
              width={30}
              height={30}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover shrink-0"
              priority
            />
            <div className="flex flex-col">
              <span className="text-base font-semibold tracking-tight text-slate-900 dark:text-white leading-tight">
                GoComfortUSA
              </span>
              <span className="text-[11px] text-slate-500 dark:text-neutral-400 leading-none hidden sm:inline">
                Concierge & Booking
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center space-x-1" aria-label="Main Navigation">
            {navLinks.map((link) => (
              <DesktopNavItem key={link.name} link={link} pathname={pathname} />
            ))}
          </nav>

          {/* Desktop Right Actions */}
          <div className="hidden xl:flex items-center space-x-2.5">
            <ModeToggle />
            <Link
              href="/contact"
              className="h-9 px-3.5 rounded-xl border border-slate-200 dark:border-neutral-700 text-slate-700 dark:text-neutral-200 hover:bg-slate-100 dark:hover:bg-[#272727] text-sm font-semibold inline-flex items-center justify-center transition-colors active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              Contact support
            </Link>
            <Link
              href="/admin/login"
              className="h-9 px-4 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-100 text-sm font-semibold inline-flex items-center justify-center shadow-xs transition-colors active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              Login
            </Link>
          </div>

          {/* Tablet & Mobile Right Controls */}
          <div className="flex xl:hidden items-center space-x-1.5 sm:space-x-2">
            <ModeToggle />
            <Link
              href="/admin/login"
              className="hidden sm:inline-flex h-8 px-3 rounded-lg border border-slate-200 dark:border-neutral-700 text-slate-700 dark:text-neutral-200 text-xs font-semibold items-center justify-center hover:bg-slate-100 dark:hover:bg-[#272727] active:scale-[0.98]"
            >
              Login
            </Link>

            {/* Animated Menu Toggle (Skill.md B7: Transforms between open and close icon) */}
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? "Close menu" : "Open main menu"}
              aria-expanded={isOpen}
              className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl text-slate-700 dark:text-neutral-200 hover:bg-slate-100 dark:hover:bg-[#272727] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors"
            >
              <div className="w-5 h-3.5 relative flex flex-col justify-between">
                <span
                  className={`block h-0.5 w-5 bg-current rounded-full transform transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] origin-center ${
                    isOpen ? "translate-y-[6px] rotate-45" : ""
                  }`}
                />
                <span
                  className={`block h-0.5 w-5 bg-current rounded-full transform transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    isOpen ? "opacity-0 scale-x-0" : "opacity-100"
                  }`}
                />
                <span
                  className={`block h-0.5 w-5 bg-current rounded-full transform transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] origin-center ${
                    isOpen ? "-translate-y-[6px] -rotate-45" : ""
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Full-Height Mobile Panel (Skill.md B7: High opacity base surface, strong blur, staggered link entrance) */}
      {isOpen && (
        <div
          className="fixed inset-0 top-0 left-0 right-0 h-dvh z-50 bg-white/95 dark:bg-[#181818]/95 backdrop-blur-xl flex flex-col pointer-events-auto"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          {/* Mobile Top Bar */}
          <div className="flex items-center justify-between h-16 px-5 sm:px-6 border-b border-slate-200/80 dark:border-neutral-800">
            <Link
              href="/"
              onClick={closeMobileMenu}
              className="flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl"
            >
              <Image
                src="/ass/logo-round.png"
                alt="GoComfortUSA"
                width={30}
                height={30}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover shrink-0"
              />
              <span className="text-base font-semibold text-slate-900 dark:text-white">
                GoComfortUSA
              </span>
            </Link>

            <button
              type="button"
              onClick={closeMobileMenu}
              aria-label="Close menu"
              className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl text-slate-700 dark:text-neutral-200 hover:bg-slate-100 dark:hover:bg-[#272727] active:scale-[0.98]"
            >
              <div className="w-5 h-3.5 relative flex flex-col justify-between">
                <span className="block h-0.5 w-5 bg-current rounded-full transform translate-y-[6px] rotate-45" />
                <span className="block h-0.5 w-5 bg-current rounded-full opacity-0 scale-x-0" />
                <span className="block h-0.5 w-5 bg-current rounded-full transform -translate-y-[6px] -rotate-45" />
              </div>
            </button>
          </div>

          {/* Staggered Links List (Skill.md B7: 24px Spacing-300 rise, 60ms step, capped at 400ms) */}
          <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-6 space-y-1">
            {navLinks.map((link, idx) => (
              <MobileNavItem
                key={link.name}
                link={link}
                pathname={pathname}
                openSubmenu={openSubmenu}
                toggleSubmenu={toggleSubmenu}
                onNavigate={closeMobileMenu}
                delayMs={Math.min(idx * 60, 400)}
              />
            ))}
          </div>

          {/* Bottom Actions Bar */}
          <div className="p-5 sm:p-6 border-t border-slate-200/80 dark:border-neutral-800 space-y-2.5 bg-slate-50/50 dark:bg-[#1F1F1F]/50">
            <Link
              href="/contact"
              onClick={closeMobileMenu}
              className="w-full h-11 rounded-xl border border-slate-200 dark:border-neutral-700 text-slate-800 dark:text-neutral-100 hover:bg-slate-100 dark:hover:bg-[#272727] font-semibold text-sm flex items-center justify-center active:scale-[0.98] transition-colors"
            >
              Contact support
            </Link>
            <Link
              href="/admin/login"
              onClick={closeMobileMenu}
              className="w-full h-11 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-100 font-semibold text-sm flex items-center justify-center shadow-xs active:scale-[0.98] transition-colors"
            >
              Login
            </Link>
          </div>
        </div>
      )}
    </>
  )
}

export default memo(Navbar)