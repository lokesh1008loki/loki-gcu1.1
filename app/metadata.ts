import type { Metadata, Viewport } from "next"

export const metadata: Metadata = {
  title: "GocomfortUSA - Best Deals on Tickets and Bill Payments",
  description: "GocomfortUSA offers amazing deals on ticket bookings and bill payments, flight ticket bookings, House rent payment and many more services, ensuring you get the best discounts and a hassle-free experience. Save on everything from travel to living.",
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