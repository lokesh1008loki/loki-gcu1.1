"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, AlertCircle, Car } from "lucide-react"
import { Toaster } from "@/components/ui/sonner"

export default function CarRentalPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)

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
      pickupLocation: formData.get("pickup-location")?.toString() || '',
      dropoffLocation: formData.get("dropoff-location")?.toString() || '',
      pickupDate: formData.get("pickup-date")?.toString() || '',
      pickupTime: formData.get("pickup-time")?.toString() || '',
      dropoffDate: formData.get("dropoff-date")?.toString() || '',
      dropoffTime: formData.get("dropoff-time")?.toString() || '',
      carType: formData.get("car-type")?.toString() || '',
      transmission: formData.get("transmission")?.toString() || '',
      fuelType: formData.get("fuel-type")?.toString() || '',
      passengers: formData.get("passengers")?.toString() || '',
      luggage: formData.get("luggage")?.toString() || '',
      driveType: formData.get("drive-type")?.toString() || '',
      driverAge: formData.get("driver-age")?.toString() || '',
      licenseCountry: formData.get("license-country")?.toString() || '',
      accountNumber: formData.get("account-number")?.toString() || '',
      extras: Array.from(formData.getAll("extras")),
      insurance: formData.get("insurance")?.toString() || '',
      specialRequests: formData.get("special-requests")?.toString() || ''
    }

    try {
      const response = await fetch("YOUR_GOOGLE_SCRIPT_URL", {
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
              <h1 className="text-3xl font-bold mb-2">Car Rental</h1>
              <p className="text-muted-foreground">Rent your perfect car with GoComfort USA — offering expertly researched options and a wide selection of vehicles.</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Car className="h-5 w-5 mr-2 text-primary" />
                  Rental Details
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
                      <Label htmlFor="pickup-location">Pick-up Location *</Label>
                      <Input 
                        id="pickup-location" 
                        name="pickup-location" 
                        placeholder="City, airport, or address" 
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dropoff-location">Drop-off Location</Label>
                      <Input 
                        id="dropoff-location" 
                        name="dropoff-location" 
                        placeholder="Different from pick-up (optional)" 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="pickup-date">Pick-up Date *</Label>
                      <Input 
                        id="pickup-date" 
                        name="pickup-date" 
                        type="date" 
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pickup-time">Pick-up Time *</Label>
                      <Input 
                        id="pickup-time" 
                        name="pickup-time" 
                        type="time" 
                        required 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="dropoff-date">Drop-off Date *</Label>
                      <Input 
                        id="dropoff-date" 
                        name="dropoff-date" 
                        type="date" 
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dropoff-time">Drop-off Time *</Label>
                      <Input 
                        id="dropoff-time" 
                        name="dropoff-time" 
                        type="time" 
                        required 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="car-type">Car Type *</Label>
                      <select 
                        id="car-type" 
                        name="car-type" 
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        required
                      >
                        <option value="">Select car type</option>
                        <option value="economy">Economy</option>
                        <option value="compact">Compact</option>
                        <option value="midsize">Midsize</option>
                        <option value="fullsize">Full Size</option>
                        <option value="suv">SUV</option>
                        <option value="luxury">Luxury</option>
                        <option value="convertible">Convertible</option>
                        <option value="minivan">Minivan</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="transmission">Transmission *</Label>
                      <select 
                        id="transmission" 
                        name="transmission" 
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        required
                      >
                        <option value="">Select transmission</option>
                        <option value="automatic">Automatic</option>
                        <option value="manual">Manual</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fuel-type">Fuel Type *</Label>
                      <select 
                        id="fuel-type" 
                        name="fuel-type" 
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        required
                      >
                        <option value="">Select fuel type</option>
                        <option value="petrol">Petrol</option>
                        <option value="diesel">Diesel</option>
                        <option value="electric">Electric</option>
                        <option value="hybrid">Hybrid</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="passengers">Passenger Capacity *</Label>
                      <Input 
                        id="passengers" 
                        name="passengers" 
                        type="number" 
                        min="1" 
                        max="8"
                        placeholder="Number of passengers"
                        required 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="luggage">Luggage Capacity *</Label>
                      <Input 
                        id="luggage" 
                        name="luggage" 
                        type="number" 
                        min="1" 
                        max="6"
                        placeholder="Number of bags"
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="drive-type">Drive Type *</Label>
                      <select 
                        id="drive-type" 
                        name="drive-type" 
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        required
                      >
                        <option value="">Select drive type</option>
                        <option value="fwd">FWD</option>
                        <option value="rwd">RWD</option>
                        <option value="awd">AWD</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="driver-age">Driver's Age *</Label>
                      <Input 
                        id="driver-age" 
                        name="driver-age" 
                        type="number" 
                        min="18" 
                        max="99"
                        placeholder="Enter your age"
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="license-country">Driver's License Country *</Label>
                      <Input 
                        id="license-country" 
                        name="license-country" 
                        placeholder="Country of license issuance"
                        required 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="account-number">Account Number (Optional)</Label>
                    <Input 
                      id="account-number" 
                      name="account-number" 
                      placeholder="Enter your account number if you have one"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Extras (Optional)</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="gps" name="extras" value="gps" className="h-4 w-4" />
                        <Label htmlFor="gps">GPS Navigation</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="child-seat" name="extras" value="child-seat" className="h-4 w-4" />
                        <Label htmlFor="child-seat">Child Seat</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="additional-driver" name="extras" value="additional-driver" className="h-4 w-4" />
                        <Label htmlFor="additional-driver">Additional Driver</Label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="insurance">Insurance Option *</Label>
                    <select 
                      id="insurance" 
                      name="insurance" 
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      required
                    >
                      <option value="">Select insurance</option>
                      <option value="basic">Basic</option>
                      <option value="premium">Premium</option>
                    </select>
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
                        Your request has been successfully submitted. Our team will reach out to you via WhatsApp or Telegram shortly.
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
                <h2 className="text-xl font-bold mb-4">Why Rent With Us?</h2>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 mr-2" />
                    <div>
                      <h3 className="font-bold">Expert Value Optimization</h3>
                      <p className="text-sm text-muted-foreground">We identify the most efficient rental options</p>
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
                      <p className="text-sm text-muted-foreground">Free cancellation on most rentals</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 mr-2" />
                    <div>
                      <h3 className="font-bold">Wide Selection</h3>
                      <p className="text-sm text-muted-foreground">Choose from various car types and models</p>
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
                  <Button variant="outline" className="w-full">
                    Contact Rental Support
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