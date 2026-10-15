"use client"

import { useState, Suspense } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, AlertCircle, Plane, Search, FileText, Sparkles } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import FlightBookingFlow from "@/components/FlightBookingFlow"

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
    if (returnDate && e.target.value > returnDate) {
      setReturnDate("")
    }
  }

  const handleReturnDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReturnDate(e.target.value)
  }

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="relative mb-12 rounded-lg overflow-hidden shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/25 to-primary/50 z-10" />
          <Image
            src="/ass/flight united.jpg"
            alt="Flight Booking"
            width={1920}
            height={600}
            className="w-full h-[500px] object-cover brightness-110"
            priority
          />
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">Expert Flight Research with GoComfort USA</h1>
            <p className="text-2xl text-white/95 mb-8 max-w-2xl drop-shadow-md">
              Optimize your air travel with our professional research services and expert itinerary planning.
            </p>
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6 shadow-lg"
              onClick={() => document.getElementById('booking-section')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Book Your Flight
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div id="booking-section" className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-primary/10 text-primary border-primary/20 text-xs font-bold uppercase tracking-wider">
                    Airline Deals
                  </Badge>
                  <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-xs font-bold flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    Save 30% on Every Flight
                  </Badge>
                </div>
                <h2 className="text-3xl font-extrabold tracking-tight mb-2">Flight Booking & Research</h2>
                <p className="text-muted-foreground text-sm max-w-2xl">
                  Search live airline fares with our guaranteed 30% savings applied, or submit a custom route request to our dedicated travel specialists.
                </p>
              </div>

              <Tabs defaultValue="live-search" className="w-full">
                <TabsList className="grid w-full grid-cols-2 p-1 h-12 bg-slate-100 dark:bg-slate-800/80 rounded-xl mb-6">
                  <TabsTrigger 
                    value="live-search" 
                    className="rounded-lg text-sm font-bold flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:text-primary data-[state=active]:shadow-sm"
                  >
                    <Search className="h-4 w-4 text-primary" />
                    <span>Live Flight Search</span>
                    <span className="hidden sm:inline-block px-1.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                      30% OFF
                    </span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="custom-inquiry" 
                    className="rounded-lg text-sm font-bold flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:text-primary data-[state=active]:shadow-sm"
                  >
                    <FileText className="h-4 w-4" />
                    <span>Custom Route Inquiry</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="live-search" className="mt-0 focus-visible:outline-none">
                  <Suspense fallback={<div className="p-8 text-center text-sm text-muted-foreground animate-pulse">Loading live flight search...</div>}>
                    <FlightBookingFlow />
                  </Suspense>
                </TabsContent>

                <TabsContent value="custom-inquiry" className="mt-0 focus-visible:outline-none">
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
              </TabsContent>
            </Tabs>
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
                      <h3 className="font-bold">Expert Itinerary Research</h3>
                      <p className="text-sm text-muted-foreground">We identify the most efficient routes for your trip</p>
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