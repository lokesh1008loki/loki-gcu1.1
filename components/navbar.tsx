"use client"

import { useState, useEffect, useCallback, memo, useMemo } from "react"
import dynamic from 'next/dynamic'
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"

// Dynamically import ModeToggle to reduce initial bundle size
const ModeToggle = dynamic(() => import('@/components/mode-toggle').then(mod => mod.ModeToggle), {
  ssr: false,
  loading: () => <div className="w-8 h-8" />
})

interface NavLink {
  name: string;
  href: string;
  submenu?: Array<{ name: string; href: string }>;
}

const NavLink = memo(({ link, pathname, openSubmenu, toggleSubmenu }: {
  link: NavLink,
  pathname: string,
  openSubmenu: string | null,
  toggleSubmenu: (name: string) => void
}) => (
  <div className="relative group">
    {link.submenu ? (
      <button
        onClick={() => toggleSubmenu(link.name)}
        className="flex items-center text-sm font-medium transition-colors hover:text-primary"
      >
        {link.name}
        <ChevronDown className="ml-1 h-4 w-4" />
      </button>
    ) : (
      <Link
        href={link.href}
        className={`text-sm font-medium transition-colors hover:text-primary ${
          pathname === link.href ? "text-primary" : ""
        }`}
      >
        {link.name}
      </Link>
    )}

    {link.submenu && (
      <div className="absolute left-0 mt-2 w-48 origin-top-left rounded-md bg-card shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
        <div className="py-1">
          {link.submenu.map((sublink) => (
            <Link key={sublink.name} href={sublink.href} className="block px-4 py-2 text-sm hover:bg-muted">
              {sublink.name}
            </Link>
          ))}
        </div>
      </div>
    )}
  </div>
))

NavLink.displayName = 'NavLink'

// Memoize the navigation links to prevent unnecessary re-renders
const navLinks = [
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
      { name: "House/Apartment Rental", href: "/bills/apartment-rental" },
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
    ],
  },
  {
    name: "Blog",
    href: "/blog",
  },
]

// Memoized mobile menu item component
const MobileMenuItem = memo(({ 
  link, 
  pathname, 
  openSubmenu, 
  toggleSubmenu, 
  setIsOpen 
}: { 
  link: NavLink, 
  pathname: string, 
  openSubmenu: string | null, 
  toggleSubmenu: (name: string) => void,
  setIsOpen: (isOpen: boolean) => void
}) => (
  <div>
    {link.submenu ? (
      <>
        <button
          onClick={() => toggleSubmenu(link.name)}
          className="w-full flex items-center justify-between px-3 py-2 rounded-md text-base font-medium hover:bg-muted"
        >
          {link.name}
          <ChevronDown
            className={`h-4 w-4 transition-transform ${
              openSubmenu === link.name ? "rotate-180" : ""
            }`}
          />
        </button>
        {openSubmenu === link.name && (
          <div className="pl-4 space-y-1 mt-1">
            {link.submenu.map((sublink) => (
              <Link
                key={sublink.name}
                href={sublink.href}
                className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-muted"
                onClick={() => setIsOpen(false)}
              >
                {sublink.name}
              </Link>
            ))}
          </div>
        )}
      </>
    ) : (
      <Link
        href={link.href}
        className={`block px-3 py-2 rounded-md text-base font-medium hover:bg-muted ${
          pathname === link.href ? "bg-primary/10 text-primary" : ""
        }`}
        onClick={() => setIsOpen(false)}
      >
        {link.name}
      </Link>
    )}
  </div>
))

MobileMenuItem.displayName = 'MobileMenuItem'

function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 10)
  }, [])

  useEffect(() => {
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [handleScroll])

  const toggleSubmenu = useCallback((name: string) => {
    setOpenSubmenu(prev => prev === name ? null : name)
  }, [])

  // Memoize the header class to prevent unnecessary re-renders
  const headerClass = useMemo(() => 
    `sticky top-0 z-50 w-full transition-all duration-300 ${
      scrolled ? "bg-background/95 backdrop-blur-sm shadow-sm" : "bg-background"
    }`,
    [scrolled]
  )

  return (
    <header className={headerClass}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex flex-col items-start">
              <span className="text-2xl font-bold text-primary">GocomfortUSA</span>
              <span className="text-xs text-muted-foreground mx-auto leading-tight">Your Comfort, Our Priority</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center space-x-6">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                link={link}
                pathname={pathname}
                openSubmenu={openSubmenu}
                toggleSubmenu={toggleSubmenu}
              />
            ))}
          </nav>

          <div className="hidden xl:flex items-center space-x-4">
            <ModeToggle />
            <Link href="/contact">
              <Button variant="outline" size="sm">
                Contact Support
              </Button>
            </Link>
            <Link href="/admin/login">
              <Button variant="outline" size="sm">
                Login
              </Button>
            </Link>
          </div>

          {/* Tablet Navigation */}
          <div className="hidden md:flex xl:hidden items-center space-x-4">
            <ModeToggle />
            <Link href="/contact">
              <Button variant="outline" size="sm">
                Contact
              </Button>
            </Link>
            <Link href="/admin/login">
              <Button variant="outline" size="sm">
                Login
              </Button>
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>

          {/* Mobile Navigation Toggle */}
          <div className="flex md:hidden items-center space-x-2">
            <ModeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile and Tablet Navigation Menu */}
      {isOpen && (
        <div className="md:absolute md:top-16 md:left-0 md:right-0 md:bg-background md:border-t md:border-b md:shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <MobileMenuItem
                key={link.name}
                link={link}
                pathname={pathname}
                openSubmenu={openSubmenu}
                toggleSubmenu={toggleSubmenu}
                setIsOpen={setIsOpen}
              />
            ))}
            <div className="pt-4 pb-3 border-t border-muted md:hidden">
              <Link href="/contact" onClick={() => setIsOpen(false)}>
                <Button variant="outline" className="w-full mb-2">
                  Contact Support
                </Button>
              </Link>
              <Link href="/admin/login" onClick={() => setIsOpen(false)}>
                <Button variant="outline" className="w-full">
                  Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default memo(Navbar)
