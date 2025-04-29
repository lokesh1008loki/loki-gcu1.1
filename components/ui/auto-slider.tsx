"use client"

import { useState, useEffect, Suspense } from "react"
import dynamic from "next/dynamic"
import Image from "next/image"

const slides = [
  {
    src: "/ass/slider_1.jpg",
    width: 1920,
    height: 1080
  },
  {
    src: "/ass/slider_2.jpg",
    width: 1920,
    height: 1080
  },
  {
    src: "/ass/slider_3.webp",
    width: 1920,
    height: 1080
  },
  {
    src: "/ass/slider_4.jpg",
    width: 1920,
    height: 1080
  }
]

const SliderImage = dynamic(() => import('./slider-image'), {
  loading: () => <div className="absolute inset-0 bg-muted animate-pulse" />
})

export function AutoSlider() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] overflow-hidden">
      <Suspense fallback={<div className="absolute inset-0 bg-muted animate-pulse" />}>
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <SliderImage
              src={slide.src}
              alt={`Slide ${index + 1}`}
              width={slide.width}
              height={slide.height}
              priority={index === 0}
              loading={index === 0 ? "eager" : "lazy"}
              quality={75}
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 100vw, 100vw"
              onLoadingComplete={() => setIsLoading(false)}
            />
          </div>
        ))}
      </Suspense>
      {isLoading && (
        <div className="absolute inset-0 bg-muted animate-pulse" />
      )}
    </div>
  )
} 