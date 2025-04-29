"use client"

import React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"

interface User {
  id: string
  email: string
  name: string
  role: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<User | null>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const checkAuth = async () => {
      // Skip auth check for create-admin page
      if (pathname === "/admin/create-admin") {
        setLoading(false)
        return
      }

      try {
        const response = await fetch("/api/auth/me", {
          credentials: "include"
        })
        
        if (response.ok) {
          const data = await response.json()
          if (data.user) {
            setUser(data.user)
            // If we're on the login page and we have a user, redirect to dashboard
            if (pathname === "/admin/login") {
              router.push("/admin/dashboard")
            }
          } else if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
            router.replace("/admin/login")
          }
        } else if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
          router.replace("/admin/login")
        }
      } catch (error) {
        console.error("Auth check error:", error)
        if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
          router.replace("/admin/login")
        }
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [pathname, router])

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include"
      })

      if (!response.ok) {
        throw new Error("Login failed")
      }

      const data = await response.json()
      if (data.user) {
        setUser(data.user)
        // Force a redirect to dashboard
        router.push("/admin/dashboard")
        return data.user
      }
      return null
    } catch (error) {
      console.error("Login error:", error)
      throw error
    }
  }

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include"
      })
      setUser(null)
      router.push("/admin/login")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const value = {
    user,
    loading,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
} 