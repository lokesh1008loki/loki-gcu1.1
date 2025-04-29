"use client"

import { useState } from "react"
import { toast } from "sonner"

export default function CreateAdminPage() {
  const [isLoading, setIsLoading] = useState(false)

  const handleCreateAdmin = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/admin/create-admin", {
        method: "POST",
      })
      const data = await response.json()

      if (response.ok) {
        toast.success("Admin user created successfully!")
      } else {
        toast.error(data.error || "Failed to create admin user")
      }
    } catch (error) {
      toast.error("An error occurred while creating admin user")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4">Create Admin User</h1>
        <p className="text-gray-600 mb-6">
          Click the button below to create a new admin user with the following credentials:
        </p>
        <div className="bg-gray-50 p-4 rounded-md mb-6">
          <p className="font-medium">Email: admin01@gocomfortusa.com</p>
          <p className="font-medium">Password: Lokeshanand@786</p>
        </div>
        <button
          onClick={handleCreateAdmin}
          disabled={isLoading}
          className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 disabled:opacity-50"
        >
          {isLoading ? "Creating..." : "Create Admin User"}
        </button>
      </div>
    </div>
  )
} 