"use client"

import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Providers } from "@/components/providers"
import { PopupNotification } from "@/components/PopupNotification"
import { MarqueeNews } from "@/components/MarqueeNews"

export function RootContent({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <div className="flex min-h-screen flex-col">
        <MarqueeNews />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <PopupNotification />
      </div>
    </Providers>
  )
} 