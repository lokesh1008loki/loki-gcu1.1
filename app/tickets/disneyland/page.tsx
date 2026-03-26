"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, AlertCircle, Castle } from "lucide-react"
import { Toaster } from "@/components/ui/sonner"
import Link from "next/link"
import Image from "next/image"
import { Metadata } from "next"

const parks = [
  {
    name: "Disneyland Park",
    description: "The original Disney theme park featuring classic attractions and magical experiences.",
    location: "1313 Disneyland Dr, Anaheim, CA 92802"
  },
  {
    name: "Disney California Adventure Park",
    description: "Celebrate the spirit of California with thrilling rides and entertainment.",
    location: "1313 Disneyland Dr, Anaheim, CA 92802"
  },
  {
    name: "Park Hopper",
    description: "Visit both parks on the same day with this flexible ticket option.",
    location: "1313 Disneyland Dr, Anaheim, CA 92802"
  }
]

const addOns = [
  {
    id: "geniePlus",
    name: "Genie+ Service",
    description: "Access to Lightning Lane entrances for select attractions"
  },
  {
    id: "parking",
    name: "Parking Pass",
    description: "Convenient parking for your visit"
  },
  {
    id: "dining",
    name: "Dining Plan",
    description: "Pre-paid meal vouchers for select restaurants"
  },
  {
    id: "specialEvent",
    name: "Special Event Access",
    description: "Access to seasonal events like Halloween Nights"
  }
]

export default function DisneylandBookingPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [selectedPark, setSelectedPark] = useState("")
  const [selectedAddOns, setSelectedAddOns] = useState<Record<string, boolean>>({})
  const [guestCount, setGuestCount] = useState({
    adult: 1,
    child: 0,
    infant: 0
  })

  const calculateTotal = () => {
    // const basePrice = selectedPark === "Park Hopper" ? 235 : 194
    // const adultTotal = guestCount.adult * basePrice
    // const childTotal = guestCount.child * (basePrice * 0.85)
    // const addOnsTotal = Object.entries(selectedAddOns)
    //   .filter(([_, selected]) => selected)
    //   .reduce((total, [id]) => {
    //     const addOn = addOns.find(a => a.id === id)
    //     return total + (addOn?.price || 0)
    //   }, 0)
    
    // return adultTotal + childTotal + addOnsTotal
    return 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setShowConfirmation(false)

    const form = e.target as HTMLFormElement
    const formData = new FormData(form)

    const data = {
      park: selectedPark,
      visitDate: formData.get("visitDate")?.toString() || '',
      adultCount: guestCount.adult,
      childCount: guestCount.child,
      infantCount: guestCount.infant,
      fullName: formData.get("fullName")?.toString() || '',
      email: formData.get("email")?.toString() || '',
      phone: formData.get("phone")?.toString() || '',
      contactInfo: formData.get("contactInfo")?.toString() || '',
      addOns: Object.entries(selectedAddOns)
        .filter(([_, selected]) => selected)
        .map(([id]) => id),
      specialRequests: formData.get("specialRequests")?.toString() || ''
    }

    try {
      const response = await fetch("https://script.google.com/macros/s/AKfycbyNqpF17t8T60sqmuFgAtIpjLEhp32Uhvm77RmLb4d-QgcrF4IkqSPkbBTAsRCXFWn8/exec", {
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
            src="/ass/disneyland-01.jpg"
            alt="Disneyland Magic"
            width={1920}
            height={600}
            className="w-full h-[500px] object-cover brightness-110"
            priority
          />
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">Experience Disneyland with GoComfort USA</h1>
            <p className="text-2xl text-white/95 mb-8 max-w-2xl drop-shadow-md">
              Professional research, expert assistance, and quick support for your perfect trip!
            </p>
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6 shadow-lg"
              onClick={() => document.getElementById('booking-section')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Book Your Adventure
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8" id="booking-section">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Castle className="h-5 w-5 mr-2 text-primary" />
                  Disneyland Ticket Booking
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
                      onChange={(e) => setSelectedPark(e.target.value)}
                      required
                    >
                      <option value="">Select a park</option>
                      {parks.map((park) => (
                        <option key={park.name} value={park.name}>
                          {park.name}
                        </option>
                      ))}
                    </select>
                    {selectedPark && (
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">
                          {parks.find(p => p.name === selectedPark)?.description}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Location: {parks.find(p => p.name === selectedPark)?.location}
                        </p>
                      </div>
                    )}
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
                    <p className="text-sm text-muted-foreground">
                      Note: A Disney account and park reservation are required for entry
                    </p>
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
                        <Label>Children (3-9)</Label>
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
                        <Label>Infants (under 3)</Label>
                        <div className="flex items-center space-x-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setGuestCount(prev => ({ ...prev, infant: Math.max(0, prev.infant - 1) }))}
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
                            onClick={() => setGuestCount(prev => ({ ...prev, infant: prev.infant + 1 }))}
                          >
                            +
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Add-ons */}
                  <div className="space-y-4">
                    <Label>Add-ons</Label>
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
                  <div className="space-y-4">
                    <Label>Contact Information</Label>
                    <div className="space-y-4">
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
                    {isSubmitting ? "Submitting..." : "Submit Booking"}
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
          <div className="space-y-6">
            {/* <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Booking Summary</h2>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Base Tickets:</span>
                    <span>${calculateTotal().toFixed(2)}</span>
                  </div>
                  {Object.entries(selectedAddOns)
                    .filter(([_, selected]) => selected)
                    .map(([id]) => {
                      const addOn = addOns.find(a => a.id === id)
                      return (
                        <div key={id} className="flex justify-between text-sm">
                          <span>{addOn?.name}:</span>
                          <span>${addOn?.price.toFixed(2)}</span>
                        </div>
                      )
                    })}
                  <div className="border-t pt-4">
                    <div className="flex justify-between font-bold">
                      <span>Total:</span>
                      <span>${calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card> */}

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
                    <Link href="/contact">Contact Disneyland Support</Link>
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
