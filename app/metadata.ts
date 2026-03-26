import type { Metadata, Viewport } from "next"

export const metadata: Metadata = {
  title: "GoComfortUSA - Professional Travel Assistance & Consultation",
  description: "GoComfortUSA provides personalized travel assistance including flight and hotel research, planning, and expert booking support. Get optimized routes and professional guidance tailored to your needs.",
  metadataBase: new URL("https://gocomfortusa.com"),
  icons: {
    icon: "/ass/logo-round.png",
    shortcut: "/ass/logo-round.png",
    apple: "/ass/logo-round.png",
  },
  openGraph: {
    title: "GocomfortUSA - Best Deals on Tickets and Bill Payments",
    description: "Your one-stop solution for tickets and bill payments",
    type: "website",
  },
  alternates: {
    canonical: "https://gocomfortusa.com"
  }
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
  maximumScale: 1,
  userScalable: false
} 