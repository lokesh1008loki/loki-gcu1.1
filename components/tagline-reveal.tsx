"use client"

import React, { useEffect, useRef, useState } from "react"

interface TaglineRevealProps {
  phrase: string
  subphrase?: string
}

export function TaglineReveal({ phrase, subphrase }: TaglineRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [revealedCount, setRevealedCount] = useState<number>(0)
  const words = phrase.split(" ")

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    // Check prefers-reduced-motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setRevealedCount(words.length)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Animate words one by one
            let current = 0
            const interval = setInterval(() => {
              current += 1
              setRevealedCount(current)
              if (current >= words.length) {
                clearInterval(interval)
              }
            }, 60)
            observer.disconnect()
          }
        })
      },
      { threshold: 0.3 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [words.length])

  return (
    <section className="py-20 md:py-24 bg-white dark:bg-[#1F1F1F] border-y border-slate-200/80 dark:border-neutral-800">
      <div className="container mx-auto px-4">
        <div ref={containerRef} className="max-w-[680px] mx-auto text-center space-y-6">
          <p className="text-xs uppercase tracking-widest font-semibold text-blue-600 dark:text-blue-400">
            Our Core Principle
          </p>

          <h2 className="text-3xl md:text-5xl font-semibold leading-tight [text-wrap:balance]">
            {words.map((word, index) => {
              const isRevealed = index < revealedCount
              return (
                <span
                  key={index}
                  className={`inline-block mr-2.5 transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    isRevealed
                      ? "text-slate-900 dark:text-white"
                      : "text-slate-400/30 dark:text-neutral-600/30"
                  }`}
                >
                  {word}
                </span>
              )
            })}
          </h2>

          {subphrase && (
            <p className="text-base md:text-lg text-slate-600 dark:text-neutral-400 [text-wrap:pretty] leading-relaxed pt-2">
              {subphrase}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}

