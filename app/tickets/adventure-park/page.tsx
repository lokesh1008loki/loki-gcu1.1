"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, AlertCircle, Mountain } from "lucide-react"
import { Toaster } from "@/components/ui/sonner"
import Link from "next/link"
import Image from "next/image"

const adventureParks = [
  {
    name: "Six Flags Great Adventure",
    city: "Jackson",
    state: "NJ",
    description: "Thrilling rides and attractions in the heart of New Jersey"
  },
  {
    name: "Cedar Point",
    city: "Sandusky",
    state: "OH",
    description: "America's Roller Coast with world-class attractions"
  },
  {
    name: "Universal's Islands of Adventure",
    city: "Orlando",
    state: "FL",
    description: "Immersive themed lands and thrilling rides"
  },
  {
    name: "Busch Gardens Tampa Bay",
    city: "Tampa",
    state: "FL",
    description: "African-themed adventure park with world-class coasters"
  },
  {
    name: "Kings Island",
    city: "Mason",
    state: "OH",
    description: "Premier amusement park with family-friendly attractions"
  },
  {
    name: "Hersheypark",
    city: "Hershey",
    state: "PA",
    description: "Sweet adventures in the chocolate capital"
  },
  {
    name: "Dollywood",
    city: "Pigeon Forge",
    state: "TN",
    description: "Smoky Mountain adventures with southern charm"
  },
  {
    name: "Silver Dollar City",
    city: "Branson",
    state: "MO",
    description: "1880s-themed park with thrilling rides"
  }
]

const addOns = [
  {
    id: "zipline",
    name: "Zipline Access",
    description: "Experience the thrill of ziplining through the park"
  },
  {
    id: "wallClimbing",
    name: "Wall Climbing",
    description: "Test your skills on our climbing walls"
  },
  {
    id: "goKarting",
    name: "Go Karting",
    description: "Race against friends on our karting tracks"
  },
  {
    id: "bungeeJumping",
    name: "Bungee Jumping",
    description: "Take the ultimate leap of faith"
  },
  {
    id: "vrExperience",
    name: "VR Experience",
    description: "Immerse yourself in virtual reality adventures"
  },
  {
    id: "guidedTour",
    name: "Guided Tour",
    description: "Explore the park with an expert guide"
  }
]

export default function AdventureParkBookingPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [selectedPark, setSelectedPark] = useState("")
  const [customPark, setCustomPark] = useState("")
  const [selectedAddOns, setSelectedAddOns] = useState<Record<string, boolean>>({})
  const [guestCount, setGuestCount] = useState({
    adult: 1,
    child: 0,
    senior: 0
  })
  const [location, setLocation] = useState({
    city: "",
    state: ""
  })

  const handleParkChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const parkName = e.target.value
    setSelectedPark(parkName)
    
    if (parkName) {
      const park = adventureParks.find(p => p.name === parkName)
      if (park) {
        setLocation({
          city: park.city,
          state: park.state
        })
      }
    } else {
      setLocation({
        city: "",
        state: ""
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setShowConfirmation(false)

    const form = e.target as HTMLFormElement
    const formData = new FormData(form)

    const data = {
      park: selectedPark || customPark,
      city: location.city,
      state: location.state,
      visitDate: formData.get("visitDate")?.toString() || '',
      adultCount: guestCount.adult,
      childCount: guestCount.child,
      seniorCount: guestCount.senior,
      contactInfo: formData.get("contactInfo")?.toString() || '',
      addOns: Object.entries(selectedAddOns)
        .filter(([_, selected]) => selected)
        .map(([id]) => id),
      specialRequests: formData.get("specialRequests")?.toString() || '',
      status: "Pending"
    }

    try {
      const response = await fetch("https://script.google.com/macros/s/AKfycbwDjhdoM8w7YN9I1u_zqL7Zp6PsAO8rvH63Kdi1g-HWQ1QobXK5gKfVjvQcvfYKyeQb/exec", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        mode: 'no-cors'
      })

      setShowConfirmation(true)
      form.reset()
      setSelectedPark("")
      setCustomPark("")
      setSelectedAddOns({})
      setGuestCount({ adult: 1, child: 0, senior: 0 })
    } catch (error) {
      console.error("Error submitting form:", error)
      toast.error("Failed to submit booking request. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Toaster />
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="relative mb-12 rounded-lg overflow-hidden shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/25 to-primary/50 z-10" />
          <Image
            src="/ass/adventure-02.jpg"
            alt="Adventure Park"
            width={1920}
            height={600}
            className="w-full h-[500px] object-cover brightness-110"
            priority
          />
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">Experience Adventure with GoComfort USA</h1>
            <p className="text-2xl text-white/95 mb-8 max-w-2xl drop-shadow-md">
              Professional research, expert consultation, and unforgettable experiences await!
            </p>
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6 shadow-lg"
              onClick={() => document.getElementById('booking-section')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Book Your Adventure Now
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8" id="booking-section">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mountain className="h-5 w-5 mr-2 text-primary" />
                  Adventure Park Booking
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  {/* Park Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="park">Select Park *</Label>
                    <select
                      id="park"
                      className="w-full rounded-md border border-input bg-background px-3 py-2"
                      value={selectedPark}
                      onChange={handleParkChange}
                      required
                    >
                      <option value="">Select a park</option>
                      {adventureParks.map((park) => (
                        <option key={park.name} value={park.name}>
                          {park.name}
                        </option>
                      ))}
                    </select>
                    {selectedPark === "" && (
                      <div className="space-y-2">
                        <Label htmlFor="customPark">Custom Park Name</Label>
                        <Input
                          id="customPark"
                          name="customPark"
                          placeholder="Enter park name if not listed"
                          value={customPark}
                          onChange={(e) => setCustomPark(e.target.value)}
                        />
                      </div>
                    )}
                  </div>

                  {/* Location Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        name="city"
                        placeholder="Enter city"
                        value={location.city}
                        onChange={(e) => setLocation(prev => ({ ...prev, city: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State *</Label>
                      <Input
                        id="state"
                        name="state"
                        placeholder="Enter state"
                        value={location.state}
                        onChange={(e) => setLocation(prev => ({ ...prev, state: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  {/* Visit Date */}
                  <div className="space-y-2">
                    <Label htmlFor="visitDate">Visit Date *</Label>
                    <Input
                      id="visitDate"
                      name="visitDate"
                      type="date"
                      required
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>

                  {/* Guest Count */}
                  <div className="space-y-4">
                    <Label>Number of Guests</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Adults (18-64)</Label>
                        <div className="flex items-center space-x-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setGuestCount(prev => ({ ...prev, adult: Math.max(1, prev.adult - 1) }))}
                          >
                            -
                          </Button>
                          <Input
                            type="number"
                            value={guestCount.adult}
                            readOnly
                            className="w-16 text-center"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setGuestCount(prev => ({ ...prev, adult: prev.adult + 1 }))}
                          >
                            +
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Children (3-17)</Label>
                        <div className="flex items-center space-x-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setGuestCount(prev => ({ ...prev, child: Math.max(0, prev.child - 1) }))}
                          >
                            -
                          </Button>
                          <Input
                            type="number"
                            value={guestCount.child}
                            readOnly
                            className="w-16 text-center"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setGuestCount(prev => ({ ...prev, child: prev.child + 1 }))}
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
                            onClick={() => setGuestCount(prev => ({ ...prev, senior: Math.max(0, prev.senior - 1) }))}
                          >
                            -
                          </Button>
                          <Input
                            type="number"
                            value={guestCount.senior}
                            readOnly
                            className="w-16 text-center"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setGuestCount(prev => ({ ...prev, senior: prev.senior + 1 }))}
                          >
                            +
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Add-ons */}
                  <div className="space-y-4">
                    <Label>Add-on Activities</Label>
                    <div className="space-y-4">
                      {addOns.map((addOn) => (
                        <div key={addOn.id} className="flex items-start space-x-3">
                          <input
                            type="checkbox"
                            id={addOn.id}
                            checked={selectedAddOns[addOn.id] || false}
                            onChange={(e) => setSelectedAddOns(prev => ({
                              ...prev,
                              [addOn.id]: e.target.checked
                            }))}
                            className="mt-1"
                          />
                          <div>
                            <Label htmlFor={addOn.id} className="font-medium">
                              {addOn.name}
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              {addOn.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-2">
                    <Label htmlFor="contactInfo">Telegram ID or WhatsApp Number * (For Instant Support)</Label>
                    <Input
                      id="contactInfo"
                      name="contactInfo"
                      placeholder="Enter your Telegram ID or WhatsApp number"
                      required
                    />
                  </div>

                  {/* Special Requests */}
                  <div className="space-y-2">
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
                        Your request has been submitted. Our team will contact you via Telegram or WhatsApp shortly.
                      </p>
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Why Book With Us?</h2>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 mr-2" />
                    <div>
                      <h3 className="font-bold">Expert Research Assistance</h3>
                      <p className="text-sm text-muted-foreground">We find the most optimized options for you</p>
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
                    <Link href="/contact">Contact Adventure Park Support</Link>
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
