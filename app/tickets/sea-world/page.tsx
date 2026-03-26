"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, AlertCircle, Fish } from "lucide-react"
import { Toaster } from "@/components/ui/sonner"
import Link from "next/link"
import Image from "next/image"

const seaWorldLocations = [
  {
    name: "SeaWorld Orlando",
    city: "Orlando",
    state: "FL",
    description: "Experience thrilling rides and amazing animal encounters in the heart of Florida"
  },
  {
    name: "SeaWorld San Diego",
    city: "San Diego",
    state: "CA",
    description: "Discover marine life and enjoy spectacular shows on the California coast"
  },
  {
    name: "SeaWorld San Antonio",
    city: "San Antonio",
    state: "TX",
    description: "Explore aquatic adventures in the heart of Texas"
  }
]

const entryTimes = [
  { value: "morning", label: "Morning (9:00 AM - 12:00 PM)" },
  { value: "afternoon", label: "Afternoon (12:00 PM - 3:00 PM)" },
  { value: "evening", label: "Evening (3:00 PM - Close)" }
]

const addOns = [
  {
    id: "allDayDining",
    name: "SeaWorld Ticket + All Day Dining Bundle",
    description: "Admission to the park + all-day dining at select restaurants"
  },
  {
    id: "sesamePlace",
    name: "SeaWorld + Sesame Place Ticket",
    description: "Access to both SeaWorld and Sesame Place"
  },
  {
    id: "ultimateBundle",
    name: "Ultimate Bundle",
    description: "SeaWorld, Sesame Place, Quick Queue, Reserved Seating, and Animal Encounters"
  },
  {
    id: "quickQueue",
    name: "Quick Queue Access",
    description: "Skip the regular lines at select attractions"
  },
  {
    id: "reservedSeating",
    name: "Reserved Show Seating",
    description: "Guaranteed seating at shows"
  },
  {
    id: "dolphinInteraction",
    name: "Dolphin Interaction",
    description: "Up-close experience with dolphins"
  },
  {
    id: "penguinMeet",
    name: "Penguin Meet & Greet",
    description: "Meet and learn about penguins"
  },
  {
    id: "belugaInteraction",
    name: "Beluga Whale Interaction",
    description: "Special encounter with beluga whales"
  },
  {
    id: "rental",
    name: "Stroller or Wheelchair Rental",
    description: "Rental for your convenience"
  }
]

export default function SeaWorldBookingPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [selectedPark, setSelectedPark] = useState("")
  const [selectedAddOns, setSelectedAddOns] = useState<Record<string, boolean>>({})
  const [guestCount, setGuestCount] = useState({
    adult: 1,
    child: 0,
    infant: 0
  })
  const [location, setLocation] = useState({
    city: "",
    state: ""
  })

  const handleParkChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const parkName = e.target.value
    setSelectedPark(parkName)
    
    if (parkName) {
      const park = seaWorldLocations.find(p => p.name === parkName)
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
      fullName: formData.get("fullName")?.toString() || '',
      email: formData.get("email")?.toString() || '',
      phone: formData.get("phone")?.toString() || '',
      contactInfo: formData.get("contactInfo")?.toString() || '',
      park: selectedPark,
      city: location.city,
      state: location.state,
      visitDate: formData.get("visitDate")?.toString() || '',
      entryTime: formData.get("entryTime")?.toString() || '',
      adultCount: guestCount.adult,
      childCount: guestCount.child,
      infantCount: guestCount.infant,
      addOns: Object.entries(selectedAddOns)
        .filter(([_, selected]) => selected)
        .map(([id]) => id),
      specialRequests: formData.get("specialRequests")?.toString() || '',
      status: "Pending"
    }

    try {
      const response = await fetch("https://script.google.com/macros/s/AKfycbwfKvwv0muVJ3MtK5KyW12Snpd8AEV1gur5ZGpy2xptWB2H3MYe9ywfx2Q3pKaVx2KU4Q/exec", {
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
      setSelectedAddOns({})
      setGuestCount({ adult: 1, child: 0, infant: 0 })
      setLocation({ city: "", state: "" })
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
            src="/ass/seaworld-02.jpg"
            alt="SeaWorld"
            width={1920}
            height={600}
            className="w-full h-[500px] object-cover brightness-110"
            priority
          />
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">Experience SeaWorld with GoComfort USA</h1>
            <p className="text-2xl text-white/95 mb-8 max-w-2xl drop-shadow-md">
              Professional research, expert coordination, and instant support for your marine adventure!
            </p>
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6 shadow-lg"
              onClick={() => document.getElementById('booking-section')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Reserve Your Adventure Now
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8" id="booking-section">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Fish className="h-5 w-5 mr-2 text-primary" />
                  SeaWorld Booking
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  {/* Guest Information */}
                  <div className="space-y-4">
                    <Label>Guest Information</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name *</Label>
                        <Input
                          id="fullName"
                          name="fullName"
                          placeholder="Enter your full name"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="Enter your email"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          placeholder="Enter your phone number"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contactInfo">Telegram ID or WhatsApp Number * (For Instant Support)</Label>
                        <Input
                          id="contactInfo"
                          name="contactInfo"
                          placeholder="Enter your Telegram ID or WhatsApp number"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Park Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="park">Choose Your SeaWorld Destination *</Label>
                    <select
                      id="park"
                      className="w-full rounded-md border border-input bg-background px-3 py-2"
                      value={selectedPark}
                      onChange={handleParkChange}
                      required
                    >
                      <option value="">Select a location</option>
                      {seaWorldLocations.map((park) => (
                        <option key={park.name} value={park.name}>
                          {park.name}
                        </option>
                      ))}
                    </select>
                    {selectedPark && (
                      <p className="text-sm text-muted-foreground">
                        {seaWorldLocations.find(p => p.name === selectedPark)?.description}
                      </p>
                    )}
                  </div>

                  {/* Visit Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="visitDate">Preferred Visit Date *</Label>
                      <Input
                        id="visitDate"
                        name="visitDate"
                        type="date"
                        required
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="entryTime">Preferred Entry Time *</Label>
                      <select
                        id="entryTime"
                        name="entryTime"
                        className="w-full rounded-md border border-input bg-background px-3 py-2"
                        required
                      >
                        <option value="">Select entry time</option>
                        {entryTimes.map((time) => (
                          <option key={time.value} value={time.value}>
                            {time.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Guest Count */}
                  <div className="space-y-4">
                    <Label>Number of Guests</Label>
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
                              setGuestCount(prev => ({ ...prev, adult: Math.max(1, prev.adult - 1) }));
                            }}
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
                            onClick={(e) => {
                              e.preventDefault();
                              setGuestCount(prev => ({ ...prev, adult: prev.adult + 1 }));
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
                              setGuestCount(prev => ({ ...prev, child: Math.max(0, prev.child - 1) }));
                            }}
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
                            onClick={(e) => {
                              e.preventDefault();
                              setGuestCount(prev => ({ ...prev, child: prev.child + 1 }));
                            }}
                          >
                            +
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Infants (Under 3)</Label>
                        <div className="flex items-center space-x-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.preventDefault();
                              setGuestCount(prev => ({ ...prev, infant: Math.max(0, prev.infant - 1) }));
                            }}
                          >
                            -
                          </Button>
                          <Input
                            type="number"
                            value={guestCount.infant}
                            readOnly
                            className="w-16 text-center"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.preventDefault();
                              setGuestCount(prev => ({ ...prev, infant: prev.infant + 1 }));
                            }}
                          >
                            +
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Add-ons */}
                  <div className="space-y-4">
                    <Label>Add-On Experiences</Label>
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
                        Thank you for your booking request! Our team will contact you shortly via your provided Telegram or WhatsApp contact.
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
                    <Link href="/contact">Contact SeaWorld Support</Link>
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
