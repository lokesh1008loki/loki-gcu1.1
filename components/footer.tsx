"use client"

import { useEffect, useState, memo } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  ArrowUpRight,
  MessageCircle,
  Clock,
  Sparkles,
  ChevronRight,
} from "lucide-react"

interface SiteSettings {
  whatsappLink: string
  facebookLink: string
  instagramLink: string
  twitterLink: string
  phoneNumber: string
  email: string
  address: string
}

interface FooterLinkItem {
  name: string
  href: string
  external?: boolean
  badge?: string
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

  useEffect(() => {
    let isMounted = true
    const fetchSettings = async () => {
      try {
        const response = await fetch("/api/site-settings")
        if (response.ok) {
          const data = await response.json()
          if (isMounted && data) {
            setSettings({
              whatsappLink: data.whatsappLink || "https://whatsapp.com",
              facebookLink: data.facebookLink || "https://facebook.com",
              instagramLink: data.instagramLink || "https://instagram.com",
              twitterLink: data.twitterLink || "https://twitter.com",
              phoneNumber: data.phoneNumber || "+1(210) 418-2745",
              email: data.email || "support@gocomfortusa.com",
              address: data.address || "30 N Gould St Ste R, Sheridan, WY 82801, USA",
            })
          }
        }
      } catch (error) {
        console.error("Failed to fetch site settings:", error)
      }
    }

    fetchSettings()
    return () => {
      isMounted = false
    }
  }, [])

  const currentYear = new Date().getFullYear()

  // Grouped logically rather than dumping a 14-item unformatted list
  const travelLinks: FooterLinkItem[] = [
    { name: "Flight consultation", href: "/travel/flight", badge: "30% off" },
    { name: "Hotel bookings", href: "/travel/hotel" },
    { name: "Car rental assistance", href: "/travel/car-rental" },
    { name: "Train and rail passes", href: "/travel/train" },
    { name: "Cruise planning", href: "/travel/cruise" },
  ]

  const parkLinks: FooterLinkItem[] = [
    { name: "Disneyland passes", href: "/tickets/disneyland" },
    { name: "Universal Studios", href: "/tickets/universal-studios" },
    { name: "Water and aqua parks", href: "/tickets/water-park" },
    { name: "Adventure theme parks", href: "/tickets/adventure-park" },
    { name: "City pass access", href: "/tickets/city-pass" },
    { name: "SeaWorld and marine parks", href: "/tickets/sea-world" },
  ]

  const livingLinks: FooterLinkItem[] = [
    { name: "Utility bill support", href: "/bills/utility" },
    { name: "Apartment rental payments", href: "/bills/apartment-rental" },
    { name: "IKEA order reconciliation", href: "/others/ikea" },
    { name: "Food and grocery orders", href: "/others/food-grocery" },
  ]

  const companyLinks: FooterLinkItem[] = [
    { name: "About our concierge", href: "/about" },
    { name: "Travel and lifestyle blog", href: "/blog" },
    { name: "Frequently asked questions", href: "/faq" },
    { name: "Contact support desk", href: "/contact" },
    { name: "Terms of service", href: "/terms-of-service" },
    { name: "Privacy policy", href: "/privacy-policy" },
  ]

  return (
    <footer className="bg-slate-50 dark:bg-[#181818] border-t border-slate-200 dark:border-neutral-800 transition-colors">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl pt-16 pb-12">
        
        {/* Pre-Footer Concierge Quick Banner */}
        <div className="mb-14 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-[#1F1F1F] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Dedicated Concierge Desk</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-900 dark:text-white [text-wrap:balance]">
              Have an urgent booking inquiry or unique itinerary request?
            </h3>
            <p className="text-sm text-slate-600 dark:text-neutral-400 [text-wrap:pretty]">
              Connect directly with our human specialists on WhatsApp for 4 hour turnaround route audits.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href={settings.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-xs transition-all active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat on WhatsApp</span>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-80" />
            </a>

            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-neutral-700 bg-white dark:bg-[#272727] text-slate-800 dark:text-neutral-200 hover:bg-slate-100 dark:hover:bg-[#313131] text-sm font-semibold transition-all active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <span>Submit ticket</span>
              <ChevronRight className="w-4 h-4 opacity-70" />
            </Link>
          </div>
        </div>

        {/* Main 5-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-14 border-b border-slate-200/80 dark:border-neutral-800">
          
          {/* Brand & Contact (4 columns on lg) */}
          <div className="lg:col-span-4 space-y-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl"
            >
              <Image
                src="/ass/logo-round.png"
                alt="GoComfortUSA"
                width={36}
                height={36}
                className="w-9 h-9 rounded-full object-cover shrink-0"
              />
              <div className="flex flex-col">
                <span className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white leading-tight">
                  GoComfortUSA
                </span>
                <span className="text-xs text-slate-500 dark:text-neutral-400 leading-none">
                  Concierge & Booking Consultation
                </span>
              </div>
            </Link>

            <p className="text-sm text-slate-600 dark:text-neutral-400 leading-relaxed max-w-sm [text-wrap:pretty]">
              Professional travel research, itinerary optimization, and payment concierge platform. 
              We streamline complex bookings and domestic arrangements with zero hidden markups.
            </p>

            {/* Direct Contact Info */}
            <div className="space-y-2.5 text-xs text-slate-600 dark:text-neutral-400">
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <a
                  href={`mailto:${settings.email}`}
                  className="hover:text-primary transition-colors font-medium"
                >
                  {settings.email}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <a
                  href={`tel:${settings.phoneNumber}`}
                  className="hover:text-primary transition-colors font-medium"
                >
                  {settings.phoneNumber}
                </a>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span className="leading-snug">
                  {settings.address}
                </span>
              </div>
            </div>

            {/* Real-time Status Beacon */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>All concierge desks operational</span>
            </div>
          </div>

          {/* Vertical 1: Travel (2 columns on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs uppercase tracking-wider font-semibold text-slate-900 dark:text-white">
              Travel Concierge
            </h4>
            <ul className="space-y-2.5 text-sm">
              {travelLinks.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="group inline-flex items-center gap-1.5 text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-200"
                  >
                    <span>{item.name}</span>
                    {item.badge && (
                      <span className="text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded bg-primary/10 text-primary">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Vertical 2: Parks & Passes (2 columns on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs uppercase tracking-wider font-semibold text-slate-900 dark:text-white">
              Theme Parks
            </h4>
            <ul className="space-y-2.5 text-sm">
              {parkLinks.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-200"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Vertical 3: Living & Bills (2 columns on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs uppercase tracking-wider font-semibold text-slate-900 dark:text-white">
              Bills and Living
            </h4>
            <ul className="space-y-2.5 text-sm">
              {livingLinks.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-200"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Vertical 4: Company & Legal (2 columns on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs uppercase tracking-wider font-semibold text-slate-900 dark:text-white">
              Company and Trust
            </h4>
            <ul className="space-y-2.5 text-sm">
              {companyLinks.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-200"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Regulatory Disclosure (Skill.md B8: Real clarity and human transparency) */}
        <div className="py-6 border-b border-slate-200/80 dark:border-neutral-800 text-xs text-slate-500 dark:text-neutral-400 leading-relaxed [text-wrap:pretty]">
          <p className="max-w-4xl">
            GoComfortUSA operates as an independent travel research, itinerary optimization, and payment consultation platform. 
            We do not sell airline tickets or hotel rooms directly. All passenger tickets, admissions, and lodging confirmations 
            are issued directly through authorized partner airlines, ticketing systems, or official merchants in the customer’s name. 
            Consultation and service fees cover dedicated research, optimization analysis, and itinerary support.
          </p>
        </div>

        {/* Bottom Bar: Copyright & Security Badges */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-neutral-400">
          <p>
            &copy; {currentYear} GoComfortUSA. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Verified 256 bit SSL encryption</span>
            </span>
            <Link
              href="/privacy-policy"
              className="hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Privacy policy
            </Link>
            <Link
              href="/terms-of-service"
              className="hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Terms of service
            </Link>
          </div>
        </div>

      </div>
    </footer>
  )
}

export default memo(Footer)