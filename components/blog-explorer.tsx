"use client"

import React, { useState, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, Clock, ArrowRight, Sparkles, BookOpen, ChevronRight, X } from "lucide-react"

export interface BlogPostItem {
  id: string
  title: string
  slug: string
  excerpt: string | null
  image: string | null
  category: "flights" | "parks" | "living" | "all"
  categoryLabel: string
  readingTime: string
  createdAt: string
  authorName: string
  featured?: boolean
}

interface BlogExplorerProps {
  initialPosts: BlogPostItem[]
}

function renderAuthor(author?: string | null): string {
  if (!author || author.toLowerCase().includes("muse") || author.toLowerCase().includes("admin")) {
    return "GoComfort Editorial Desk"
  }
  return author.startsWith("GoComfort") ? author : `By ${author}`
}

export function BlogExplorer({ initialPosts }: BlogExplorerProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  const categories = [
    { id: "all", label: "All guides" },
    { id: "flights", label: "Flights and travel" },
    { id: "parks", label: "Theme parks" },
    { id: "living", label: "IKEA and living" },
  ]

  const filteredPosts = useMemo(() => {
    return initialPosts.filter((post) => {
      const matchesCategory =
        selectedCategory === "all" || post.category === selectedCategory
      const query = searchQuery.toLowerCase().trim()
      const matchesSearch =
        !query ||
        post.title.toLowerCase().includes(query) ||
        (post.excerpt && post.excerpt.toLowerCase().includes(query)) ||
        post.categoryLabel.toLowerCase().includes(query)

      return matchesCategory && matchesSearch
    })
  }, [initialPosts, selectedCategory, searchQuery])

  // Split featured post from remaining posts
  const featuredPost = useMemo(() => {
    if (selectedCategory !== "all" || searchQuery) return null
    return initialPosts.find((p) => p.featured) || initialPosts[0] || null
  }, [initialPosts, selectedCategory, searchQuery])

  const gridPosts = useMemo(() => {
    if (featuredPost && selectedCategory === "all" && !searchQuery) {
      return filteredPosts.filter((p) => p.id !== featuredPost.id)
    }
    return filteredPosts
  }, [filteredPosts, featuredPost, selectedCategory, searchQuery])

  return (
    <div className="space-y-12">
      {/* Search and Category Filters Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-2 rounded-2xl bg-white dark:bg-[#1F1F1F] border border-slate-200/80 dark:border-neutral-800 shadow-xs">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none px-1">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-[0.98] ${
                  isSelected
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#272727]"
                }`}
              >
                {cat.label}
              </button>
            )
          })}
        </div>

        {/* Search Input Box */}
        <div className="relative min-w-[260px] md:max-w-xs">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search guides and strategies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-9 py-2 text-xs rounded-xl bg-slate-50 dark:bg-[#181818] border border-slate-200 dark:border-neutral-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-neutral-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Featured Editorial Article (Hero Format) */}
      {featuredPost && (
        <div className="relative rounded-3xl border border-slate-200/80 dark:border-neutral-800 bg-white dark:bg-[#1F1F1F] overflow-hidden shadow-xs hover:shadow-md hover:border-blue-400 dark:hover:border-blue-700 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group">
          <Link href={`/blog/${featuredPost.slug}`} className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            {/* Featured Image */}
            <div className="lg:col-span-7 relative h-64 sm:h-80 lg:h-auto min-h-[280px] overflow-hidden bg-slate-100 dark:bg-neutral-800">
              <Image
                src={featuredPost.image || "/ass/slider_1.jpg"}
                alt={featuredPost.title}
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                priority
              />
              <div className="absolute top-4 left-4 px-3 py-1 rounded-lg bg-blue-600 text-white text-xs font-semibold tracking-wide uppercase shadow-sm">
                Featured Blueprint
              </div>
            </div>

            {/* Featured Copy & Metadata */}
            <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2.5 text-xs text-slate-500 dark:text-neutral-400">
                  <span className="font-semibold text-blue-600 dark:text-blue-400">
                    {featuredPost.categoryLabel}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 font-mono">
                    <Clock className="w-3.5 h-3.5" />
                    {featuredPost.readingTime}
                  </span>
                  <span>•</span>
                  <span>{featuredPost.createdAt}</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 dark:text-white [text-wrap:balance] group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {featuredPost.title}
                </h3>

                <p className="text-sm text-slate-600 dark:text-neutral-400 leading-relaxed [text-wrap:pretty]">
                  {featuredPost.excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-neutral-800 flex items-center justify-between">
                <span className="text-xs text-slate-500 dark:text-neutral-400">
                  {renderAuthor(featuredPost.authorName)}
                </span>
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform">
                  <span>Read full guide</span>
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </Link>
        </div>
      )}

      {/* Grid of Articles */}
      {gridPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gridPosts.map((post) => (
            <article
              key={post.id}
              className="rounded-2xl border border-slate-200/80 dark:border-neutral-800 bg-white dark:bg-[#1F1F1F] overflow-hidden shadow-xs hover:shadow-md hover:border-blue-400 dark:hover:border-blue-700 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group flex flex-col justify-between"
            >
              <Link href={`/blog/${post.slug}`} className="flex flex-col h-full justify-between">
                <div>
                  {/* Thumbnail Container (Skill.md B3 nested radius formula) */}
                  <div className="aspect-[16/10] relative overflow-hidden rounded-xl m-2 bg-slate-100 dark:bg-neutral-800">
                    <Image
                      src={post.image || "/ass/slider_2.jpg"}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                    />
                    <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-semibold uppercase tracking-wider">
                      {post.categoryLabel}
                    </div>
                    <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-white/90 dark:bg-[#181818]/90 backdrop-blur-md text-slate-800 dark:text-neutral-200 text-[10px] font-mono font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      <span>{post.readingTime}</span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 sm:p-5 space-y-2.5">
                    <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-neutral-500">
                      <span>{post.createdAt}</span>
                      <span>•</span>
                      <span>{renderAuthor(post.authorName)}</span>
                    </div>

                    <h4 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white [text-wrap:balance] group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug">
                      {post.title}
                    </h4>

                    <p className="text-xs sm:text-sm text-slate-600 dark:text-neutral-400 leading-relaxed [text-wrap:pretty] line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>
                </div>

                {/* Card Action Link */}
                <div className="p-4 sm:p-5 pt-0 border-t border-slate-100 dark:border-neutral-800 mt-2 flex items-center justify-between text-xs font-semibold text-blue-600 dark:text-blue-400">
                  <span>Explore strategy</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </article>
          ))}
        </div>
      ) : (
        /* Empty State (Skill.md B9: Composed getting started / empty view) */
        <div className="rounded-2xl border border-dashed border-slate-300 dark:border-neutral-700 p-12 text-center space-y-3 bg-white dark:bg-[#1F1F1F]">
          <BookOpen className="w-10 h-10 text-slate-400 mx-auto" />
          <h4 className="text-base font-semibold text-slate-800 dark:text-white">
            No articles found
          </h4>
          <p className="text-xs text-slate-500 dark:text-neutral-400 max-w-sm mx-auto">
            We couldn&apos;t find any guides matching &ldquo;{searchQuery}&rdquo;. Try another term or reset your search.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("")
              setSelectedCategory("all")
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold shadow-xs hover:bg-blue-700 active:scale-[0.98] transition-all"
          >
            Reset filters
          </button>
        </div>
      )}

      {/* Bottom Concierge Consultation Callout */}
      <div className="p-8 sm:p-10 rounded-3xl bg-blue-600 text-white shadow-md border border-blue-500 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/15 text-xs font-semibold uppercase tracking-wider text-blue-100">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Need Custom Travel Research?</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-semibold tracking-tight text-white [text-wrap:balance]">
            Let our specialists audit your itinerary or quote
          </h3>
          <p className="text-xs sm:text-sm text-blue-100 [text-wrap:pretty]">
            Skip hours of comparison shopping. Get a verified flight, hotel, or theme park dossier delivered within 4 hours.
          </p>
        </div>

        <Link
          href="/contact"
          className="px-6 py-3 rounded-xl bg-white text-blue-600 hover:bg-blue-50 font-semibold text-sm shadow-sm active:scale-[0.98] transition-all shrink-0"
        >
          Talk to a specialist
        </Link>
      </div>
    </div>
  )
}
