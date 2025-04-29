"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, AlertCircle, MapPin } from "lucide-react"
import { Toaster } from "@/components/ui/sonner"
import Link from "next/link"
import Image from "next/image"

// CityPASS destinations and their attractions
const cityPassDestinations = [
  {
    id: "new-york",
    name: "New York",
    attractions: [
      { id: "empire-state", name: "Empire State Building" },
      { id: "met", name: "The Metropolitan Museum of Art" },
      { id: "top-of-rock", name: "Top of the Rock" },
      { id: "statue-liberty", name: "Statue of Liberty & Ellis Island" },
      { id: "moma", name: "Museum of Modern Art" },
      { id: "guggenheim", name: "Guggenheim Museum" },
      { id: "9-11-memorial", name: "9/11 Memorial & Museum" }
    ]
  },
  {
    id: "chicago",
    name: "Chicago",
    attractions: [
      { id: "shedd-aquarium", name: "Shedd Aquarium" },
      { id: "skydeck", name: "Skydeck Chicago" },
      { id: "field-museum", name: "Field Museum" },
      { id: "art-institute", name: "Art Institute of Chicago" },
      { id: "adler-planetarium", name: "Adler Planetarium" },
      { id: "museum-science", name: "Museum of Science and Industry" }
    ]
  },
  {
    id: "san-francisco",
    name: "San Francisco",
    attractions: [
      { id: "cal-academy", name: "California Academy of Sciences" },
      { id: "aquarium-bay", name: "Aquarium of the Bay" },
      { id: "exploratorium", name: "Exploratorium" },
      { id: "deyoung", name: "de Young Museum" },
      { id: "legion-honor", name: "Legion of Honor" },
      { id: "sfmoma", name: "SFMOMA" }
    ]
  },
  {
    id: "seattle",
    name: "Seattle",
    attractions: [
      { id: "space-needle", name: "Space Needle" },
      { id: "seattle-aquarium", name: "Seattle Aquarium" },
      { id: "argosy-cruise", name: "Argosy Cruises Harbor Tour" },
      { id: "museum-pop", name: "Museum of Pop Culture" },
      { id: "chihuly", name: "Chihuly Garden and Glass" },
      { id: "woodland-park", name: "Woodland Park Zoo" }
    ]
  },
  {
    id: "houston",
    name: "Houston",
    attractions: [
      { id: "space-center", name: "Space Center Houston" },
      { id: "houston-zoo", name: "Houston Zoo" },
      { id: "museum-natural", name: "Houston Museum of Natural Science" },
      { id: "museum-fine-arts", name: "Museum of Fine Arts, Houston" },
      { id: "kemah-boardwalk", name: "Kemah Boardwalk" },
      { id: "downtown-aquarium", name: "Downtown Aquarium" }
    ]
  },
  {
    id: "dallas",
    name: "Dallas",
    attractions: [
      { id: "perot-museum", name: "Perot Museum of Nature and Science" },
      { id: "dallas-zoo", name: "Dallas Zoo" },
      { id: "reunion-tower", name: "Reunion Tower" },
      { id: "dallas-aquarium", name: "Dallas World Aquarium" },
      { id: "george-bush", name: "George W. Bush Presidential Library" },
      { id: "dallas-arboretum", name: "Dallas Arboretum" }
    ]
  },
  {
    id: "boston",
    name: "Boston",
    attractions: [
      { id: "new-england-aquarium", name: "New England Aquarium" },
      { id: "museum-science", name: "Museum of Science" },
      { id: "harvard-museum", name: "Harvard Museum of Natural History" },
      { id: "franklin-park", name: "Franklin Park Zoo" },
      { id: "boston-children", name: "Boston Children's Museum" },
      { id: "boston-duck", name: "Boston Duck Tours" }
    ]
  },
  {
    id: "philadelphia",
    name: "Philadelphia",
    attractions: [
      { id: "franklin-institute", name: "The Franklin Institute" },
      { id: "philadelphia-zoo", name: "Philadelphia Zoo" },
      { id: "adventure-aquarium", name: "Adventure Aquarium" },
      { id: "philadelphia-museum", name: "Philadelphia Museum of Art" },
      { id: "eastern-state", name: "Eastern State Penitentiary" },
      { id: "barnes-foundation", name: "The Barnes Foundation" }
    ]
  },
  {
    id: "atlanta",
    name: "Atlanta",
    attractions: [
      { id: "georgia-aquarium", name: "Georgia Aquarium" },
      { id: "world-of-coca-cola", name: "World of Coca-Cola" },
      { id: "cnn-tour", name: "CNN Studio Tour" },
      { id: "zoo-atlanta", name: "Zoo Atlanta" },
      { id: "fernbank", name: "Fernbank Museum of Natural History" },
      { id: "high-museum", name: "High Museum of Art" }
    ]
  },
  {
    id: "tampa-bay",
    name: "Tampa Bay",
    attractions: [
      { id: "busch-gardens", name: "Busch Gardens Tampa Bay" },
      { id: "florida-aquarium", name: "The Florida Aquarium" },
      { id: "clearwater-marine", name: "Clearwater Marine Aquarium" },
      { id: "chihuly", name: "Chihuly Collection" },
      { id: "tampa-museum", name: "Tampa Museum of Art" },
      { id: "zoo-tampa", name: "ZooTampa at Lowry Park" }
    ]
  },
  {
    id: "southern-california",
    name: "Southern California",
    attractions: [
      { id: "disneyland", name: "Disneyland Resort" },
      { id: "universal-studios", name: "Universal Studios Hollywood" },
      { id: "legoland", name: "LEGOLAND California" },
      { id: "sea-world", name: "SeaWorld San Diego" },
      { id: "san-diego-zoo", name: "San Diego Zoo" },
      { id: "knott-berry", name: "Knott's Berry Farm" }
    ]
  }
]

export default function CityPassBookingPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [selectedCity, setSelectedCity] = useState("")
  const [selectedAttractions, setSelectedAttractions] = useState<string[]>([])
  const [guestCounts, setGuestCounts] = useState({
    adults: 1,
    children: 0,
    seniors: 0
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      contactInfo: formData.get("contactInfo") as string,
      city: selectedCity,
      startDate: formData.get("startDate") as string,
      guestCounts: {
        adults: guestCounts.adults,
        children: guestCounts.children,
        seniors: guestCounts.seniors
      },
      selectedAttractions: selectedAttractions,
      specialRequests: formData.get("specialRequests") as string,
      status: "Pending"
    }

    try {
      const response = await fetch("https://script.google.com/macros/s/AKfycbyVhUBVeuoMiUfz4dljQd-FIwrDu0Y5XiIvg0RE_Y1AoZShVMYmMTQOamw-hquucOXp/exec", {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      // Since we're using no-cors mode, we can't check response.ok
      // Instead, we'll assume success if we get here
      setShowConfirmation(true)
      toast.success("Booking request submitted successfully!")
      
      // Reset all form states
      if (e.currentTarget) {
        e.currentTarget.reset()
      }
      
      // Reset all state variables
      setSelectedCity("")
      setSelectedAttractions([])
      setGuestCounts({
        adults: 1,
        children: 0,
        seniors: 0
      })
      
      // Clear the form after a short delay
      setTimeout(() => {
        setShowConfirmation(false)
        // Force a re-render of the form
        window.location.reload()
      }, 3000)
    } catch (error) {
      console.error("Submission error:", error)
      toast.error("Failed to submit booking request. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGuestCountChange = (type: "adults" | "children" | "seniors", value: number) => {
    setGuestCounts(prev => ({
      ...prev,
      [type]: Math.max(0, value)
    }))
  }

  const handleAttractionToggle = (attractionId: string) => {
    setSelectedAttractions(prev =>
      prev.includes(attractionId)
        ? prev.filter(id => id !== attractionId)
        : [...prev, attractionId]
    )
  }

  const selectedCityData = cityPassDestinations.find(city => city.id === selectedCity)

  return (
    <>
      <Toaster />
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="relative mb-12 rounded-lg overflow-hidden shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/25 to-primary/50 z-10" />
          <Image
            src="/ass/citypass-01.jpg"
            alt="CityPASS Destinations"
            width={1920}
            height={600}
            className="w-full h-[500px] object-cover brightness-110"
            priority
          />
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">Explore Top U.S. Attractions with CityPASS</h1>
            <p className="text-2xl text-white/95 mb-8 max-w-2xl drop-shadow-md">
              Save up to 50% on admission to must-see destinations across major cities.
            </p>
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6 shadow-lg"
              onClick={() => document.getElementById('booking-section')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Start Your CityPASS Booking
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="booking-section">
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-primary" />
                  CityPASS Booking Request
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <Label>Personal Information</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          required
                          placeholder="Enter your first name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          required
                          placeholder="Enter your last name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          required
                          placeholder="Enter your email"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          required
                          placeholder="Enter your phone number"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contactInfo">Telegram ID or WhatsApp Number * (For Instant Support)</Label>
                        <Input
                          id="contactInfo"
                          name="contactInfo"
                          required
                          placeholder="Enter your Telegram ID or WhatsApp number"
                        />
                      </div>
                    </div>
                  </div>

                  {/* CityPASS Details */}
                  <div className="space-y-4">
                    <Label>CityPASS Details</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">Select CityPASS Destination *</Label>
                        <select
                          id="city"
                          className="w-full rounded-md border border-input bg-background px-3 py-2"
                          value={selectedCity}
                          onChange={(e) => setSelectedCity(e.target.value)}
                          required
                        >
                          <option value="">Select a city</option>
                          {cityPassDestinations.map((city) => (
                            <option key={city.id} value={city.id}>
                              {city.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="startDate">Preferred Start Date *</Label>
                        <Input
                          id="startDate"
                          name="startDate"
                          type="date"
                          required
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Label>Number of Travelers</Label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>Adults (10+)</Label>
                          <div className="flex items-center space-x-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.preventDefault();
                                handleGuestCountChange("adults", guestCounts.adults - 1);
                              }}
                            >
                              -
                            </Button>
                            <Input
                              type="number"
                              value={guestCounts.adults}
                              readOnly
                              className="w-16 text-center"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.preventDefault();
                                handleGuestCountChange("adults", guestCounts.adults + 1);
                              }}
                            >
                              +
                            </Button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Children (3-9)</Label>
                          <div className="flex items-center space-x-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.preventDefault();
                                handleGuestCountChange("children", guestCounts.children - 1);
                              }}
                            >
                              -
                            </Button>
                            <Input
                              type="number"
                              value={guestCounts.children}
                              readOnly
                              className="w-16 text-center"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.preventDefault();
                                handleGuestCountChange("children", guestCounts.children + 1);
                              }}
                            >
                              +
                            </Button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Seniors (65+)</Label>
                          <div className="flex items-center space-x-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.preventDefault();
                                handleGuestCountChange("seniors", guestCounts.seniors - 1);
                              }}
                            >
                              -
                            </Button>
                            <Input
                              type="number"
                              value={guestCounts.seniors}
                              readOnly
                              className="w-16 text-center"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.preventDefault();
                                handleGuestCountChange("seniors", guestCounts.seniors + 1);
                              }}
                            >
                              +
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Attraction Preferences */}
                  {selectedCityData && (
                    <div className="space-y-4">
                      <Label>Attraction Preferences</Label>
                      <div className="space-y-4">
                        <Label>Select Attractions to Visit</Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {selectedCityData.attractions.map((attraction) => (
                            <div key={attraction.id} className="flex items-start space-x-3">
                              <input
                                type="checkbox"
                                id={attraction.id}
                                checked={selectedAttractions.includes(attraction.id)}
                                onChange={() => handleAttractionToggle(attraction.id)}
                                className="mt-1"
                              />
                              <div>
                                <Label htmlFor={attraction.id} className="font-medium">
                                  {attraction.name}
                                </Label>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Special Requests */}
                  <div className="space-y-4">
                    <Label htmlFor="specialRequests">Special Requests</Label>
                    <textarea
                      id="specialRequests"
                      name="specialRequests"
                      placeholder="Any special requests or requirements (e.g., accessibility needs, group arrangements, etc.)"
                      className="w-full rounded-md border border-input bg-background px-3 py-2 min-h-[100px]"
                    />
                  </div>

                  <Button className="w-full" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit Booking Request"}
                  </Button>

                  {showConfirmation && (
                    <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-green-700 text-center">
                        Thank you! Your booking request has been submitted. Our team will contact you shortly via WhatsApp or Telegram.
                      </p>
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Why Book With Us?</h2>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 mr-2" />
                    <div>
                      <h3 className="font-bold">Best Price Guarantee</h3>
                      <p className="text-sm text-muted-foreground">We promise the lowest ticket prices</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 mr-2" />
                    <div>
                      <h3 className="font-bold">24/7 Support</h3>
                      <p className="text-sm text-muted-foreground">Instant support via WhatsApp/Telegram</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 mr-2" />
                    <div>
                      <h3 className="font-bold">Flexible Bookings</h3>
                      <p className="text-sm text-muted-foreground">Free cancellation on most tickets</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Need Assistance?</h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-primary" />
                    <span>Having trouble with your booking?</span>
                  </div>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/contact">Contact CityPASS Support</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}
