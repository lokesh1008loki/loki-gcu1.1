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
}

function Footer() {
  const [settings, setSettings] = useState<SiteSettings>({
    whatsappLink: "https://whatsapp.com",
    facebookLink: "https://facebook.com",
    instagramLink: "https://instagram.com",
    twitterLink: "https://twitter.com",
    phoneNumber: "+1 437 849 7841",
    email: "support@gocomfortusa.com",
  })
  const [isLoading, setIsLoading] = useState(true)

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
    // Refresh data every 5 minutes to match the API cache duration
    const interval = setInterval(fetchSettings, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-muted">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FooterSection title="GocomfortUSA">
            <p className="text-muted-foreground text-sm">
              GocomfortUSA offers amazing deals on ticket bookings and bill payments, ensuring you get the best
              discounts and a hassle-free experience.
            </p>
          </FooterSection>

          <FooterSection title="Quick Links">
            <ul className="space-y-2">
              <FooterLink href="/" text="Home" />
              <FooterLink href="/tickets/water-park" text="Tickets & Parks" />
              <FooterLink href="/bills/utility" text="Bill & Payments" />
              <FooterLink href="/travel/flight" text="Travel" />
              <FooterLink href="/food-grocery" text="Food & Grocery" />
            </ul>
          </FooterSection>

          <FooterSection title="Services">
            <ul className="space-y-2">
              <FooterLink href="/tickets/adventure-park" text="Adventure Parks" />
              <FooterLink href="/bills/electricity" text="Electricity Bills" />
              <FooterLink href="/travel/hotel" text="Hotel Bookings" />
              <FooterLink href="/travel/flight" text="Flight Tickets" />
              <FooterLink href="/travel/apartment-rental" text="Apartment Rentals" />
            </ul>
          </FooterSection>

          <FooterSection title="Contact Us">
            <div className="flex items-center space-x-4">
              <SocialLink href={settings.whatsappLink} icon={Phone} label="WhatsApp" />
              <SocialLink href={settings.facebookLink} icon={Facebook} label="Facebook" />
              <SocialLink href={settings.instagramLink} icon={Instagram} label="Instagram" />
              <SocialLink href={settings.twitterLink} icon={Twitter} label="Twitter" />
            </div>
            <div className="space-y-2">
              <ContactInfo icon={Mail} text={settings.email} />
              <ContactInfo icon={Phone} text={settings.phoneNumber} />
            </div>
          </FooterSection>
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-center text-sm text-muted-foreground">
            &copy; {currentYear} GocomfortUSA. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default memo(Footer)
