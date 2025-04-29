"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, AlertCircle, Hotel } from "lucide-react"
import { Toaster } from "@/components/ui/sonner"
import Link from "next/link"

export default function HotelBookingPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [checkInDate, setCheckInDate] = useState("")
  const [checkOutDate, setCheckOutDate] = useState("")
  const [numberOfNights, setNumberOfNights] = useState(0)

  useEffect(() => {
    if (checkInDate && checkOutDate) {
      const start = new Date(checkInDate)
      const end = new Date(checkOutDate)
      const diffTime = end.getTime() - start.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      setNumberOfNights(diffDays)
    }
  }, [checkInDate, checkOutDate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setShowConfirmation(false)

    const form = e.target as HTMLFormElement
    const formData = new FormData(form)

    const data = {
      // Guest Information
      firstName: formData.get("first-name")?.toString() || '',
      lastName: formData.get("last-name")?.toString() || '',
      email: formData.get("email")?.toString() || '',
      phoneNumber: formData.get("phone-number")?.toString() || '',
      contactInfo: formData.get("contact-info")?.toString() || '',
      nationality: formData.get("nationality")?.toString() || '',
      dateOfBirth: formData.get("date-of-birth")?.toString() || '',

      // Booking Details
      checkInDate: formData.get("check-in-date")?.toString() || '',
      checkOutDate: formData.get("check-out-date")?.toString() || '',
      numberOfNights: formData.get("number-of-nights")?.toString() || '',
      numberOfAdults: formData.get("number-of-adults")?.toString() || '',
      numberOfChildren: formData.get("number-of-children")?.toString() || '',
      roomType: formData.get("room-type")?.toString() || '',
      bedPreference: formData.get("bed-preference")?.toString() || '',
      smokingPreference: formData.get("smoking-preference")?.toString() || '',
      specialRequests: formData.get("special-requests")?.toString() || '',

      // Additional Services
      hasBreakfast: formData.get("has-breakfast") === "on",
      hasAirportPickup: formData.get("has-airport-pickup") === "on",
      hasExtraBed: formData.get("has-extra-bed") === "on",
      otherServices: formData.get("other-services")?.toString() || '',

      // Agreements
      termsAccepted: formData.get("terms") === "on",
      privacyAccepted: formData.get("privacy") === "on"
    }

    try {
      const response = await fetch("https://script.google.com/macros/s/AKfycbxFkeB4A9wMBhhlrw_B8ahK25Jso1_JYaSDuU4sLYTN3Y_6u-Yp9M06C7CVOKFVAif7/exec", {
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Hotel Booking</h1>
              <p className="text-muted-foreground">Discover Your Ideal Stay with GoComfort USA — Enjoy Unbeatable Rates and a Handpicked Selection of Hotels Across the Globe.</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Hotel className="h-5 w-5 mr-2 text-primary" />
                  Booking Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  {/* Guest Information Section */}
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Guest Information</h2>
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
                        <Label htmlFor="nationality">Nationality *</Label>
                        <Input 
                          id="nationality" 
                          name="nationality" 
                          placeholder="Enter your nationality" 
                          required 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="date-of-birth">Date of Birth *</Label>
                        <Input 
                          id="date-of-birth" 
                          name="date-of-birth" 
                          type="date" 
                          required 
                        />
                      </div>
                    </div>
                  </div>

                  {/* Booking Details Section */}
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Booking Details</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="check-in-date">Check-in Date *</Label>
                        <Input 
                          id="check-in-date" 
                          name="check-in-date" 
                          type="date" 
                          min={new Date().toISOString().split('T')[0]}
                          value={checkInDate}
                          onChange={(e) => setCheckInDate(e.target.value)}
                          required 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="check-out-date">Check-out Date *</Label>
                        <Input 
                          id="check-out-date" 
                          name="check-out-date" 
                          type="date" 
                          min={checkInDate || new Date().toISOString().split('T')[0]}
                          value={checkOutDate}
                          onChange={(e) => setCheckOutDate(e.target.value)}
                          required 
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="number-of-nights">Number of Nights</Label>
                      <Input 
                        id="number-of-nights" 
                        name="number-of-nights" 
                        type="number" 
                        value={numberOfNights}
                        readOnly
                      />
                    </div>

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

                    <div className="space-y-2">
                      <Label htmlFor="room-type">Room Type *</Label>
                      <select 
                        id="room-type" 
                        name="room-type" 
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        required
                      >
                        <option value="">Select room type</option>
                        <option value="single">Single</option>
                        <option value="double">Double</option>
                        <option value="twin">Twin</option>
                        <option value="suite">Suite</option>
                        <option value="family">Family</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bed-preference">Bed Preference *</Label>
                      <select 
                        id="bed-preference" 
                        name="bed-preference" 
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        required
                      >
                        <option value="">Select bed preference</option>
                        <option value="king">King</option>
                        <option value="queen">Queen</option>
                        <option value="twin">Twin</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label>Smoking Preference *</Label>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <input type="radio" id="smoking" name="smoking-preference" value="smoking" required className="h-4 w-4" />
                          <Label htmlFor="smoking">Smoking</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="radio" id="non-smoking" name="smoking-preference" value="non-smoking" className="h-4 w-4" />
                          <Label htmlFor="non-smoking">Non-Smoking</Label>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="special-requests">Special Requests</Label>
                      <textarea
                        id="special-requests"
                        name="special-requests"
                        placeholder="Any special requests or requirements (e.g., late check-in, accessibility needs)"
                        className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>
                  </div>

                  {/* Additional Services Section */}
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Additional Services</h2>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-2">
                        <input 
                          type="checkbox" 
                          id="has-breakfast" 
                          name="has-breakfast" 
                          className="mt-1 h-4 w-4"
                        />
                        <Label htmlFor="has-breakfast" className="text-sm">
                          Add Breakfast
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <input 
                          type="checkbox" 
                          id="has-airport-pickup" 
                          name="has-airport-pickup" 
                          className="mt-1 h-4 w-4"
                        />
                        <Label htmlFor="has-airport-pickup" className="text-sm">
                          Airport Pickup
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <input 
                          type="checkbox" 
                          id="has-extra-bed" 
                          name="has-extra-bed" 
                          className="mt-1 h-4 w-4"
                        />
                        <Label htmlFor="has-extra-bed" className="text-sm">
                          Extra Bed
                        </Label>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="other-services">Other Services</Label>
                      <textarea
                        id="other-services"
                        name="other-services"
                        placeholder="Any other services you require , also you can add hotel name here too."
                        className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>
                  </div>

                  {/* Agreements Section */}
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Agreements</h2>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-2">
                        <input 
                          type="checkbox" 
                          id="terms" 
                          name="terms" 
                          required 
                          className="mt-1 h-4 w-4"
                        />
                        <Label htmlFor="terms" className="text-sm">
                          I accept the Terms & Conditions *
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <input 
                          type="checkbox" 
                          id="privacy" 
                          name="privacy" 
                          required 
                          className="mt-1 h-4 w-4"
                        />
                        <Label htmlFor="privacy" className="text-sm">
                          I agree to the Privacy Policy *
                        </Label>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit Request"}
                  </Button>

                  {showConfirmation && (
                    <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-green-700 text-center">
                        Your hotel booking request has been submitted successfully. Our team will contact you via WhatsApp or Telegram shortly.
                      </p>
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Why Book With Us?</h2>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 mr-2" />
                    <div>
                      <h3 className="font-bold">Best Price Guarantee</h3>
                      <p className="text-sm text-muted-foreground">We promise the lowest hotel rates</p>
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
                      <p className="text-sm text-muted-foreground">Free cancellation on most hotels</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 mr-2" />
                    <div>
                      <h3 className="font-bold">Wide Selection</h3>
                      <p className="text-sm text-muted-foreground">Choose from various hotels worldwide</p>
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
                    <Link href="/contact">Contact Hotel Support</Link>
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
