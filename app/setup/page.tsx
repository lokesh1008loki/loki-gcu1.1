"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export default function SetupPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSetup = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/auth/setup", {
        method: "POST",
      })
      const data = await response.json()
      
      if (response.ok) {
        toast.success("Admin user created successfully!")
        router.push("/admin/login")
      } else if (response.status === 400 && data.error === "Admin user already exists") {
        toast.info("Admin user already exists. You can now log in.")
        router.push("/admin/login")
      } else {
        toast.error(data.error || "Setup failed")
      }
    } catch (error) {
      toast.error("An error occurred during setup")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Initial Setup
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {isLoading 
              ? "Setting up admin user..." 
              : "Click the button below to create the admin user"}
          </p>
        </div>
        <Button
          onClick={handleSetup}
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? "Setting up..." : "Create Admin User"}
        </Button>
      </div>
    </div>
  )
} 