"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Facebook, Instagram, Twitter, Phone, Mail } from "lucide-react"
import { memo } from "react"

// Memoized social media link component
const SocialLink = memo(({ href, icon: Icon, label }: { 
  href: string, 
  icon: React.ElementType, 
  label: string 
}) => (
  <Link
    href={href}
    className="p-2 rounded-full bg-background hover:bg-primary hover:text-white transition-colors"
  >
    <span className="sr-only">{label}</span>
    <Icon className="h-5 w-5" />
  </Link>
))

SocialLink.displayName = 'SocialLink'

// Memoized contact info component
const ContactInfo = memo(({ icon: Icon, text }: { 
  icon: React.ElementType, 
  text: string 
}) => (
  <div className="flex items-center space-x-2 text-sm">
    <Icon className="h-4 w-4" />
    <span>{text}</span>
  </div>
))

ContactInfo.displayName = 'ContactInfo'

// Memoized footer link component
const FooterLink = memo(({ href, text }: { 
  href: string, 
  text: string 
}) => (
  <li>
    <Link href={href} className="text-sm hover:text-primary transition-colors">
      {text}
    </Link>
  </li>
))

FooterLink.displayName = 'FooterLink'

// Memoized footer section component
const FooterSection = memo(({ title, children }: { 
  title: string, 
  children: React.ReactNode 
}) => (
  <div className="space-y-4">
    <h3 className="text-lg font-bold">{title}</h3>
    {children}
  </div>
))

FooterSection.displayName = 'FooterSection'

interface SiteSettings {
  whatsappLink: string
  facebookLink: string
  instagramLink: string
  twitterLink: string
  phoneNumber: string
  email: string
  address: string
}

interface NavLink {
  id?: string
  name: string
  href: string
  isActive: boolean
  subLinks?: NavLink[]
}

function Footer() {
  const [settings, setSettings] = useState<SiteSettings>({
    whatsappLink: "https://whatsapp.com",
    facebookLink: "https://facebook.com",
    instagramLink: "https://instagram.com",
    twitterLink: "https://twitter.com",
    phoneNumber: "+1(210) 418-2745",
    email: "support@gocomfortusa.com",
    address: "30 N Gould St Ste R, Sheridan, WY 82801, USA",
  })
  const [isLoading, setIsLoading] = useState(true)
  const [navLinks, setNavLinks] = useState<NavLink[]>([
    { name: "Home", href: "/", isActive: true },
    { name: "About Us", href: "/about", isActive: true },
  ])

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/site-settings')
        if (!response.ok) {
          console.error("Failed to fetch site settings, using defaults")
          return
        }
        const data = await response.json()
        setSettings(data)
      } catch (error) {
        console.error("Error fetching site settings:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSettings()
    
    const fetchNavLinks = async () => {
      try {
        const response = await fetch("/api/navbar-links")
        if (response.ok) {
          const data = await response.json()
          if (data && Array.isArray(data) && data.length > 0) {
            setNavLinks(data)
          }
        }
      } catch (error) {
        console.error("Failed to fetch footer links:", error)
      }
    }
    fetchNavLinks()

    // Refresh data every 5 minutes to match the API cache duration
    const interval = setInterval(() => {
      fetchSettings()
      fetchNavLinks()
    }, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-muted">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FooterSection title="GoComfortUSA">
            <p className="text-muted-foreground text-sm">
              GoComfortUSA provides travel assistance services including flight and hotel research, planning, and optional booking support. 
              We are a dedicated travel consultation platform helping you find the best options for your journey.
            </p>
          </FooterSection>

          <FooterSection title="Quick Links">
            <ul className="space-y-2">
              {navLinks.flatMap((link) => {
                // If it's "Home", don't duplicate it (since we also have a manual About Us)
                // but actually, we should just let the dynamic list drive it
                if (link.subLinks && link.subLinks.length > 0) {
                  return link.subLinks.map(sub => (
                    <FooterLink key={sub.id || sub.name} href={sub.href} text={sub.name} />
                  ))
                }
                return <FooterLink key={link.id || link.name} href={link.href} text={link.name} />
              })}
              <FooterLink href="/about" text="About Us" />
            </ul>
          </FooterSection>


          <FooterSection title="Legal">
            <ul className="space-y-2">
              <FooterLink href="/terms-of-service" text="Terms of Service" />
              <FooterLink href="/privacy-policy" text="Privacy Policy" />
            </ul>
          </FooterSection>

          <FooterSection title="Contact Us">
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <SocialLink href={settings.whatsappLink} icon={Phone} label="WhatsApp" />
                <SocialLink href={settings.facebookLink} icon={Facebook} label="Facebook" />
                <SocialLink href={settings.instagramLink} icon={Instagram} label="Instagram" />
                <SocialLink href={settings.twitterLink} icon={Twitter} label="Twitter" />
              </div>
              <div className="space-y-2">
                <ContactInfo icon={Mail} text={settings.email} />
                <ContactInfo icon={Phone} text={settings.phoneNumber} />
                <p className="text-sm text-muted-foreground flex items-start space-x-2">
                  <span className="font-bold">Address:</span>
                  <span>{settings.address}</span>
                </p>
              </div>
            </div>
          </FooterSection>
        </div>

        <div className="mt-8 pt-4 pb-8 border-t border-border">
          <p className="text-xs text-muted-foreground leading-relaxed text-center max-w-4xl mx-auto">
            GoComfort USA provides travel assistance services including flight and hotel research, planning, and optional booking support. 
            We do not sell airline tickets or hotel stays directly. All bookings are made through official providers in the customer’s name. 
            Consultation fees are for research and assistance services only.
          </p>
        </div>

        <div className="mt-4 pt-8 border-t border-border">
          <p className="text-center text-sm text-muted-foreground">
            &copy; {currentYear} GoComfortUSA. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default memo(Footer)
