"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, AlertCircle, Train } from "lucide-react"
import { Toaster } from "@/components/ui/sonner"
import Link from "next/link"
import Image from "next/image"
import { LegalCheckboxes } from "@/components/legal-checkboxes"

export default function TrainBookingPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [hasReturnTrip, setHasReturnTrip] = useState(false)
  const [hasInsurance, setHasInsurance] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setShowConfirmation(false)

    const form = e.target as HTMLFormElement
    const formData = new FormData(form)

    const data = {
      // Passenger Information
      firstName: formData.get("first-name")?.toString() || '',
      lastName: formData.get("last-name")?.toString() || '',
      email: formData.get("email")?.toString() || '',
      phoneNumber: formData.get("phone-number")?.toString() || '',
      contactInfo: formData.get("contact-info")?.toString() || '',
      dateOfBirth: formData.get("date-of-birth")?.toString() || '',
      nationality: formData.get("nationality")?.toString() || '',

      // Travel Details
      departureStation: formData.get("departure-station")?.toString() || '',
      arrivalStation: formData.get("arrival-station")?.toString() || '',
      departureDate: formData.get("departure-date")?.toString() || '',
      departureTime: formData.get("departure-time")?.toString() || '',
      hasReturnTrip: formData.get("has-return-trip") === "on",
      returnDate: formData.get("return-date")?.toString() || '',
      returnTime: formData.get("return-time")?.toString() || '',
      numberOfAdults: formData.get("number-of-adults")?.toString() || '',
      numberOfChildren: formData.get("number-of-children")?.toString() || '',
      classOfService: formData.get("class-of-service")?.toString() || '',
      seatPreference: formData.get("seat-preference")?.toString() || '',
      specialAssistance: formData.get("special-assistance") === "on",
      specialRequests: formData.get("special-requests")?.toString() || '',

      // Additional Services
      hasInsurance: formData.get("has-insurance") === "on",
      mealPreference: formData.get("meal-preference")?.toString() || '',

      // Agreements
      termsAccepted: formData.get("terms") === "on",
      privacyAccepted: formData.get("privacy") === "on"
    }

    try {
      const response = await fetch("https://script.google.com/macros/s/AKfycbzV21cMZKUAkI75hxCu6UBSoqOIh4ooNyw2_fTNWsu1qk5TTYsi1RuxuGiGpp6V1KL1zA/exec", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        mode: 'no-cors'
      })

      setShowConfirmation(true)
      form.reset()
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
            src="/ass/train ticket 3.jpg"
            alt="Train Booking"
            width={1920}
            height={600}
            className="w-full h-[500px] object-cover brightness-110"
            priority
          />
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">Book Your Train Journey with GoComfort USA</h1>
            <p className="text-2xl text-white/95 mb-8 max-w-2xl drop-shadow-md">
              Experience premium train travel across the USA with our expert research and tailored coordination.
            </p>
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6 shadow-lg"
              onClick={() => document.getElementById('booking-section')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Book Your Train
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div id="booking-section">
              <div>
                <h1 className="text-3xl font-bold mb-2">Train Booking</h1>
                <p className="text-muted-foreground">Book your perfect journey with GoComfort USA — offering professional coordination and a wide selection of train routes worldwide.</p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Train className="h-5 w-5 mr-2 text-primary" />
                    Booking Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form className="space-y-6" onSubmit={handleSubmit}>
                    {/* Passenger Information Section */}
                    <div className="space-y-4">
                      <h2 className="text-xl font-semibold">Passenger Information</h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="first-name">First Name *</Label>
                          <Input 
                            id="first-name" 
                            name="first-name" 
                            placeholder="Enter your first name" 
                            required 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="last-name">Last Name *</Label>
                          <Input 
                            id="last-name" 
                            name="last-name" 
                            placeholder="Enter your last name" 
                            required 
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input 
                          id="email" 
                          name="email" 
                          type="email"
                          placeholder="Enter your email address" 
                          required 
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone-number">Phone Number *</Label>
                        <Input 
                          id="phone-number" 
                          name="phone-number" 
                          type="tel"
                          placeholder="Enter your phone number" 
                          required 
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="contact-info">Telegram ID or WhatsApp Number * (For ASAP Support)</Label>
                        <Input 
                          id="contact-info" 
                          name="contact-info" 
                          placeholder="Enter your Telegram ID or WhatsApp number" 
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="date-of-birth">Date of Birth *</Label>
                          <Input 
                            id="date-of-birth" 
                            name="date-of-birth" 
                            type="date" 
                            required 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="nationality">Nationality *</Label>
                          <Input 
                            id="nationality" 
                            name="nationality" 
                            placeholder="Enter your nationality" 
                            required 
                          />
                        </div>
                      </div>
                    </div>

                    {/* Travel Details Section */}
                    <div className="space-y-4">
                      <h2 className="text-xl font-semibold">Travel Details</h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="departure-station">Departure Station *</Label>
                          <Input 
                            id="departure-station" 
                            name="departure-station" 
                            placeholder="Enter departure station" 
                            required 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="arrival-station">Arrival Station *</Label>
                          <Input 
                            id="arrival-station" 
                            name="arrival-station" 
                            placeholder="Enter arrival station" 
                            required 
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="departure-date">Departure Date *</Label>
                          <Input 
                            id="departure-date" 
                            name="departure-date" 
                            type="date" 
                            min={new Date().toISOString().split('T')[0]}
                            required 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="departure-time">Departure Time *</Label>
                          <Input 
                            id="departure-time" 
                            name="departure-time" 
                            type="time" 
                            required 
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <input 
                            type="checkbox" 
                            id="has-return-trip" 
                            name="has-return-trip" 
                            className="h-4 w-4"
                            checked={hasReturnTrip}
                            onChange={(e) => setHasReturnTrip(e.target.checked)}
                          />
                          <Label htmlFor="has-return-trip">Return Trip</Label>
                        </div>
                      </div>

                      {hasReturnTrip && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="return-date">Return Date *</Label>
                            <Input 
                              id="return-date" 
                              name="return-date" 
                              type="date" 
                              min={new Date().toISOString().split('T')[0]}
                              required 
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="return-time">Return Time *</Label>
                            <Input 
                              id="return-time" 
                              name="return-time" 
                              type="time" 
                              required 
                            />
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="number-of-adults">Number of Adults *</Label>
                          <Input 
                            id="number-of-adults" 
                            name="number-of-adults" 
                            type="number" 
                            min="1" 
                            required 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="number-of-children">Number of Children</Label>
                          <Input 
                            id="number-of-children" 
                            name="number-of-children" 
                            type="number" 
                            min="0" 
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="class-of-service">Class of Service *</Label>
                          <select 
                            id="class-of-service" 
                            name="class-of-service" 
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            required
                          >
                            <option value="">Select class</option>
                            <option value="economy">Economy</option>
                            <option value="business">Business</option>
                            <option value="first">First Class</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="seat-preference">Seat Preference *</Label>
                          <select 
                            id="seat-preference" 
                            name="seat-preference" 
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            required
                          >
                            <option value="">Select preference</option>
                            <option value="window">Window</option>
                            <option value="aisle">Aisle</option>
                            <option value="no-preference">No Preference</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <input 
                            type="checkbox" 
                            id="special-assistance" 
                            name="special-assistance" 
                            className="h-4 w-4"
                          />
                          <Label htmlFor="special-assistance">Special Assistance Required</Label>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="special-requests">Special Requests</Label>
                        <textarea
                          id="special-requests"
                          name="special-requests"
                          placeholder="Any special requests or requirements"
                          className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                      </div>
                    </div>

                    {/* Additional Services Section */}
                    <div className="space-y-4">
                      <h2 className="text-xl font-semibold">Additional Services</h2>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <input 
                            type="checkbox" 
                            id="has-insurance" 
                            name="has-insurance" 
                            className="h-4 w-4"
                            checked={hasInsurance}
                            onChange={(e) => setHasInsurance(e.target.checked)}
                          />
                          <Label htmlFor="has-insurance">Add Travel Insurance</Label>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="meal-preference">Meal Preference</Label>
                          <select 
                            id="meal-preference" 
                            name="meal-preference" 
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <option value="">Select meal preference</option>
                            <option value="vegetarian">Vegetarian</option>
                            <option value="non-vegetarian">Non-Vegetarian</option>
                            <option value="vegan">Vegan</option>
                            <option value="no-preference">No Preference</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Agreements Section */}
                    <div className="space-y-4">
                      <h2 className="text-xl font-semibold">Agreements</h2>
                      <LegalCheckboxes />
                    </div>

                    <Button className="w-full" type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Submitting..." : "Submit Request"}
                    </Button>

                    {showConfirmation && (
                      <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-green-700 text-center">
                          Your train booking request has been submitted successfully. Our team will contact you via WhatsApp or Telegram shortly.
                        </p>
                      </div>
                    )}
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Why Book With Us?</h2>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 mr-2" />
                    <div>
                      <h3 className="font-bold">Expert Value Optimization</h3>
                      <p className="text-sm text-muted-foreground">We identify the most efficient train routes and rates</p>
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
                      <p className="text-sm text-muted-foreground">Easy modifications and cancellations</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 mr-2" />
                    <div>
                      <h3 className="font-bold">Wide Selection</h3>
                      <p className="text-sm text-muted-foreground">Choose from various train routes</p>
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
                    <Link href="/contact">Contact Train Support</Link>
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
