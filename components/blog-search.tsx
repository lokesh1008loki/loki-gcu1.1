"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useCallback } from "react"

export function BlogSearch() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(name, value)
      params.set("page", "1")
      return params.toString()
    },
    [searchParams]
  )

  return (
    <div className="relative w-full md:w-1/2">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder="Search blog posts..."
        className="pl-10"
        defaultValue={searchParams.get("search") || ""}
        onChange={(e) => {
          router.push(`/blog?${createQueryString("search", e.target.value)}`)
        }}
      />
    </div>
  )
} 