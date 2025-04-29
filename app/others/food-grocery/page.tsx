"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Mail, ChefHat, ShoppingBag, Sparkles } from "lucide-react"
import Image from "next/image"
import { motion } from "framer-motion"

// Floating food icons data
const floatingIcons = [
  { icon: "🍕", x: 20, delay: 0 },
  { icon: "🥗", x: 40, delay: 0.2 },
  { icon: "🍔", x: 60, delay: 0.4 },
  { icon: "🥛", x: 80, delay: 0.6 },
  { icon: "🥖", x: 10, delay: 0.8 },
  { icon: "🍎", x: 30, delay: 1 },
  { icon: "🥑", x: 50, delay: 1.2 },
  { icon: "🍝", x: 70, delay: 1.4 },
]

export default function FoodGroceryComingSoon() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Here you would typically send the email to your backend
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulated API call
      setShowSuccess(true)
      setEmail("")
    } catch (error) {
      console.error("Error submitting email:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted overflow-hidden">
      {/* Floating food icons */}
      <div className="fixed inset-0 pointer-events-none">
        {floatingIcons.map((item, index) => (
          <motion.div
            key={index}
            className="absolute text-4xl opacity-50"
            initial={{ y: "100vh", x: `${item.x}vw` }}
            animate={{
              y: "-10vh",
              x: `${item.x}vw`,
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              delay: item.delay,
              ease: "linear",
            }}
          >
            {item.icon}
          </motion.div>
        ))}
      </div>

      {/* Sparkles animation */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(20)].map((_, index) => (
          <motion.div
            key={index}
            className="absolute text-2xl opacity-30"
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
              x: `${Math.random() * 100}vw`,
              y: `${Math.random() * 100}vh`,
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          >
            ✨
          </motion.div>
        ))}
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Logo 
        <div className="flex justify-center mb-8">
          <Image
            src="/logo.png"
            alt="GoComfort"
            width={200}
            height={60}
            className="h-16 w-auto"
          />
        </div>*/}

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto"
        >
          <Card className="bg-card/90 backdrop-blur-sm shadow-xl border-border">
            <CardContent className="p-8 text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="mb-6"
              >
                <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
                  Deliciousness & Freshness — Coming Your Way Soon! 🌟
                </h1>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="space-y-4 text-lg text-foreground"
              >
                <p>
                  Hey there, foodies & grocery lovers! 👋
                </p>
                <p>
                  We're super excited to let you know that our team is cooking up something special just for you! 👨‍🍳🛒
                </p>
                <p>
                  We're currently working hand-in-hand with your favorite restaurants and trusted grocery stores to bring you a seamless ordering experience — from piping hot meals 🍕 to daily essentials 🥛.
                </p>
                <p>
                  We truly apologize for the wait 🙏, but trust us — it'll be worth it. 💯
                </p>
                <p className="font-bold text-primary">
                  ✨ GoComfort Food & Grocery is launching very soon across the USA! ✨
                </p>
                <p>
                  Until then, stay hungry, stay fresh, and keep an eye out... we're almost ready to serve you! 😋
                </p>
              </motion.div>

              {/* Features Icons */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="flex justify-center gap-8 mt-8"
              >
                <div className="flex flex-col items-center">
                  <ChefHat className="h-12 w-12 text-primary" />
                  <span className="mt-2 text-sm text-muted-foreground">Expert Chefs</span>
                </div>
                <div className="flex flex-col items-center">
                  <ShoppingBag className="h-12 w-12 text-primary" />
                  <span className="mt-2 text-sm text-muted-foreground">Fresh Groceries</span>
                </div>
                <div className="flex flex-col items-center">
                  <Sparkles className="h-12 w-12 text-primary" />
                  <span className="mt-2 text-sm text-muted-foreground">Amazing Deals</span>
                </div>
              </motion.div>

              {/* Email Subscription Form */}
              <motion.form
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.5 }}
                onSubmit={handleSubmit}
                className="mt-8 max-w-md mx-auto"
              >
                <div className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="flex-1"
                  />
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      "Submitting..."
                    ) : (
                      <>
                        <Mail className="mr-2 h-4 w-4" />
                        Keep Me Posted
                      </>
                    )}
                  </Button>
                </div>
                {showSuccess && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-2 text-primary text-sm"
                  >
                    Thanks! We'll notify you when we launch. 🎉
                  </motion.p>
                )}
              </motion.form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}