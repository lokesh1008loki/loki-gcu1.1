"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, AlertCircle, Info } from "lucide-react"
import { Toaster } from "@/components/ui/sonner"
import Link from "next/link"
import Image from "next/image"

const entryTimes = [
  { value: "morning", label: "Morning (9:00 AM - 12:00 PM)" },
  { value: "noon", label: "Noon (12:00 PM - 3:00 PM)" },
  { value: "evening", label: "Evening (3:00 PM - Close)" }
]

const addOns = [
  {
    id: "locker",
    name: "Locker Rental",
    description: "Secure storage for your belongings"
  },
  {
    id: "meal",
    name: "Meal Combo",
    description: "Pre-paid meal package"
  },
  {
    id: "parking",
    name: "Parking Pass",
    description: "Parking access for your vehicle"
  },
  {
    id: "equipment",
    name: "Equipment Rental",
    description: "Rental of park equipment"
  },
  {
    id: "skipLine",
    name: "Skip-the-line Access",
    description: "Priority access to attractions"
  }
]

export default function CustomParkBookingPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [selectedAddOns, setSelectedAddOns] = useState<Record<string, boolean>>({})
  const [guestCount, setGuestCount] = useState({
    adult: 1,
    child: 0,
    senior: 0
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setShowConfirmation(false)

    const form = e.target as HTMLFormElement
    const formData = new FormData(form)

    // Validate contact information
    const contactInfo = formData.get("contactInfo")?.toString() || ''
    
    if (!contactInfo) {
      toast.error("Please provide either Telegram ID or WhatsApp Number")
      setIsSubmitting(false)
      return
    }

    const data = {
      firstName: formData.get("firstName")?.toString() || '',
      lastName: formData.get("lastName")?.toString() || '',
      phone: formData.get("phone")?.toString() || '',
      contactInfo: contactInfo,
      parkLink: formData.get("parkLink")?.toString() || '',
      visitDate: formData.get("visitDate")?.toString() || '',
      entryTime: formData.get("entryTime")?.toString() || '',
      adultCount: guestCount.adult,
      childCount: guestCount.child,
      seniorCount: guestCount.senior,
      addOns: Object.entries(selectedAddOns)
        .filter(([_, selected]) => selected)
        .map(([id]) => id),
      specialRequests: formData.get("specialRequests")?.toString() || '',
      status: "Pending"
    }

    try {
      const response = await fetch("https://script.google.com/macros/s/AKfycbwp_YksK5uBx9q5mBFkfi7Qd1EPD60uGuZBN6ev-1NTkD1Nakz0ylw3kCpRUyaq8qmV/exec", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        mode: 'no-cors'
      })

      setShowConfirmation(true)
      form.reset()
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
            src="/ass/otherpark-01.jpg"
            alt="Custom Park Booking"
            width={1920}
            height={600}
            className="w-full h-[500px] object-cover brightness-110"
            priority
          />
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">Can't Find Your Favorite Park? We've Got You Covered!</h1>
            <p className="text-2xl text-white/95 mb-8 max-w-2xl drop-shadow-md">
              Book tickets for any park in the USA using the custom request form below.
            </p>
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6 shadow-lg"
              onClick={() => document.getElementById('booking-section')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Request Booking Now
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8" id="booking-section">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Info className="h-5 w-5 mr-2 text-primary" />
                  Custom Park Booking
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  {/* Guest Information */}
                  <div className="space-y-4">
                    <Label>Guest Information</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          placeholder="Enter your first name"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          placeholder="Enter your last name"
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
                        <Label htmlFor="contactInfo">Telegram ID or WhatsApp Number *</Label>
                        <Input
                          id="contactInfo"
                          name="contactInfo"
                          placeholder="Enter your Telegram ID or WhatsApp number"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Park Link */}
                  <div className="space-y-2">
                    <Label htmlFor="parkLink">Park or Booking Link *</Label>
                    <Input
                      id="parkLink"
                      name="parkLink"
                      type="url"
                      placeholder="Paste the official park website or booking link"
                      required
                    />
                  </div>

                  {/* Visit Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <div className="space-y-2">
                      <Label htmlFor="entryTime">Preferred Entry Time</Label>
                      <select
                        id="entryTime"
                        name="entryTime"
                        className="w-full rounded-md border border-input bg-background px-3 py-2"
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
                    <Label>Number of Visitors</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Adults</Label>
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
                        <Label>Children</Label>
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
                        <Label>Seniors</Label>
                        <div className="flex items-center space-x-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.preventDefault();
                              setGuestCount(prev => ({ ...prev, senior: Math.max(0, prev.senior - 1) }));
                            }}
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
                            onClick={(e) => {
                              e.preventDefault();
                              setGuestCount(prev => ({ ...prev, senior: prev.senior + 1 }));
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
                    <Label>Add-Ons</Label>
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
                    <Label htmlFor="specialRequests">Special Requests or Notes</Label>
                    <textarea
                      id="specialRequests"
                      name="specialRequests"
                      placeholder="Any special requests or requirements"
                      className="w-full rounded-md border border-input bg-background px-3 py-2 min-h-[100px]"
                    />
                  </div>

                  <Button className="w-full" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit Booking Request"}
                  </Button>

                  {showConfirmation && (
                    <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-green-700 text-center">
                        Thanks! Your request has been submitted. Our team will contact you shortly via Telegram or WhatsApp.
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
                    <Link href="/contact">Contact Support</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-2">
                  <Info className="h-5 w-5 text-primary mt-0.5" />
                  <p className="text-sm text-muted-foreground">
                    GoComfort USA handles bookings for all types of parks not listed individually. If it exists, we can help you book it!
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
} 