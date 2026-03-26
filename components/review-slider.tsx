"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Star, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useRef } from "react"

const reviews = [
  {
    name: "John Dicosta",
    initials: "JD",
    role: "Regular Traveler",
    quote: "GoComfortUSA has made my travel planning so much easier. Their research and assistance are exceptional, providing clarity and peace of mind.",
  },
  {
    name: "Jane Smith",
    initials: "JS",
    role: "Verified Traveler",
    quote: "The personalized options from GoComfortUSA are exactly what I needed. I found excellent stay recommendations for my family's trip. Highly recommended!",
  },
  {
    name: "Robert Johnson",
    initials: "RJ",
    role: "Frequent Traveler",
    quote: "I used GoComfortUSA for my complex flight route and they found optimized options I hadn't considered. The professional guidance was excellent.",
  },
  {
    name: "Michael Larson",
    initials: "ML",
    role: "Business Professional",
    quote: "GoComfortUSA offers reliable research and planning assistance. Their attention to detail and professional approach are a must-try for any traveler.",
  },
  {
    name: "Emma Parker",
    initials: "EP",
    role: "Travel Nurse",
    quote: "The personalized travel options are fantastic! The team is always responsive and helpful, making my relocations smooth and stress-free.",
  },
  {
    name: "Thomas Wilson",
    initials: "TW",
    role: "Travel Enthusiast",
    quote: "GoComfortUSA's expert guidance has been invaluable for my trips. Their route optimization and stay recommendations are top-notch. Couldn't be happier!",
  },
]

export default function ReviewSlider() {
  const [isPaused, setIsPaused] = useState(false)
  const sliderRef = useRef<HTMLDivElement>(null)

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -300, behavior: 'smooth' })
    }
  }

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 300, behavior: 'smooth' })
    }
  }

  return (
    <div 
      className="relative w-full overflow-hidden bg-muted/50 py-8"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Left gradient overlay */}
      <div className="absolute left-0 top-0 bottom-0 w-25 bg-gradient-to-r from-background to-transparent z-10" />
      
      {/* Right gradient overlay */}
      <div className="absolute right-0 top-0 bottom-0 w-25 bg-gradient-to-l from-background to-transparent z-10" />

      {/* Navigation Buttons */}
      <Button
        variant="outline"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-background/80 hover:bg-background"
        onClick={scrollLeft}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-background/80 hover:bg-background"
        onClick={scrollRight}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>
      
      <div 
        ref={sliderRef}
        className={`flex space-x-6 overflow-x-auto scrollbar-hide ${isPaused ? 'pause-scroll' : 'animate-scroll'}`}
      >
        {reviews.map((review, index) => (
          <Card key={index} className="min-w-[400px] flex-shrink-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-5 w-5 fill-primary text-primary" />
                ))}
              </div>
              <p className="mb-4 italic text-sm leading-relaxed max-w-[360px]">{review.quote}</p>
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                  <span className="font-bold text-primary text-base">{review.initials}</span>
                </div>
                <div>
                  <h4 className="font-bold text-base">{review.name}</h4>
                  <p className="text-sm text-muted-foreground">{review.role}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {/* Duplicate reviews for seamless scrolling */}
        {reviews.map((review, index) => (
          <Card key={`duplicate-${index}`} className="min-w-[400px] flex-shrink-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-5 w-5 fill-primary text-primary" />
                ))}
              </div>
              <p className="mb-4 italic text-sm leading-relaxed max-w-[360px]">{review.quote}</p>
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                  <span className="font-bold text-primary text-base">{review.initials}</span>
                </div>
                <div>
                  <h4 className="font-bold text-base">{review.name}</h4>
                  <p className="text-sm text-muted-foreground">{review.role}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 