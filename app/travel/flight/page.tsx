"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, AlertCircle, Plane } from "lucide-react"
import { Toaster } from "@/components/ui/sonner"
import Link from "next/link"

export default function FlightBookingPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [departureDate, setDepartureDate] = useState("")
  const [returnDate, setReturnDate] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setShowConfirmation(false)

    const form = e.target as HTMLFormElement
    const formData = new FormData(form)

    const data = {
      firstName: formData.get("first-name")?.toString() || '',
      lastName: formData.get("last-name")?.toString() || '',
      phoneNumber: formData.get("phone-number")?.toString() || '',
      contactInfo: formData.get("contact-info")?.toString() || '',
      from: formData.get("from")?.toString() || '',
      to: formData.get("to")?.toString() || '',
      departureDate: formData.get("departureDate")?.toString() || '',
      departureTime: formData.get("departureTime")?.toString() || '',
      returnDate: formData.get("returnDate")?.toString() || '',
      returnTime: formData.get("returnTime")?.toString() || '',
      passengers: formData.get("passengers")?.toString() || '',
      class: formData.get("class")?.toString() || '',
      specialRequests: formData.get("special-requests")?.toString() || ''
    }

    try {
      const response = await fetch("https://script.google.com/macros/s/AKfycbw59MleojRO0q83VBa-e1TXYC7bu9fKg0Ly7TgqFZkFa623LdMEKwHsZDK6LS8UPbg/exec", {
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

  const handleDepartureDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDepartureDate(e.target.value)
    // If return date is before new departure date, clear it
    if (returnDate && e.target.value > returnDate) {
      setReturnDate("")
    }
  }

  const handleReturnDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReturnDate(e.target.value)
  }

  return (
    <>
      <Toaster />
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Flight Booking</h1>
              <p className="text-muted-foreground">Book your flights effortlessly and securely with GoComfort USA — offering the most competitive prices from destinations across the globe.</p>
          </div>

          <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Plane className="h-5 w-5 mr-2 text-primary" />
                  Flight Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4" onSubmit={handleSubmit}>
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
                      <Label htmlFor="from">From (City/Airport) *</Label>
                      <Input 
                        id="from" 
                        name="from" 
                        placeholder="e.g., New York (JFK)" 
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="to">To (City/Airport) *</Label>
                      <Input 
                        id="to" 
                        name="to" 
                        placeholder="e.g., Los Angeles (LAX)" 
                        required 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="departureDate">Departure Date *</Label>
                    <Input
                      id="departureDate"
                      name="departureDate"
                      type="date"
                      required
                      min={new Date().toISOString().split('T')[0]}
                      value={departureDate}
                      onChange={handleDepartureDateChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="departureTime">Departure Time *</Label>
                    <Input
                      id="departureTime"
                      name="departureTime"
                      type="time"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="returnDate">Return Date</Label>
                    <Input
                      id="returnDate"
                      name="returnDate"
                      type="date"
                      min={departureDate || new Date().toISOString().split('T')[0]}
                      value={returnDate}
                      onChange={handleReturnDateChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="returnTime">Return Time</Label>
                    <Input
                      id="returnTime"
                      name="returnTime"
                      type="time"
                      disabled={!returnDate}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="passengers">Number of Passengers *</Label>
                      <Input 
                        id="passengers" 
                        name="passengers" 
                        type="number" 
                        min="1" 
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="class">Travel Class *</Label>
                      <select 
                        id="class" 
                        name="class" 
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        required
                      >
                        <option value="">Select class</option>
                        <option value="economy">Economy</option>
                        <option value="premium-economy">Premium Economy</option>
                        <option value="business">Business</option>
                        <option value="first">First Class</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="special-requests">Special Requests (Optional)</Label>
                    <textarea
                      id="special-requests"
                      name="special-requests"
                      placeholder="Any special requests or requirements"
                      className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>

                  <Button className="w-full" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit Request"}
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

        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Why Book With Us?</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 mr-2" />
                  <div>
                    <h3 className="font-bold">Best Price Guarantee</h3>
                    <p className="text-sm text-muted-foreground">We promise the lowest airfares</p>
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
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 mr-2" />
                  <div>
                    <h3 className="font-bold">Secure Payments</h3>
                    <p className="text-sm text-muted-foreground">SSL encrypted transactions</p>
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
                  <Link href="/contact">Contact Flight Support</Link>
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