"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, AlertCircle, Ship } from "lucide-react"
import { Toaster } from "@/components/ui/sonner"
import Link from "next/link"

export default function CruiseBookingPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [hasInsurance, setHasInsurance] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setShowConfirmation(false)

    const form = e.target as HTMLFormElement
    const formData = new FormData(form)

    const data = {
      // Personal Information
      firstName: formData.get("first-name")?.toString() || '',
      lastName: formData.get("last-name")?.toString() || '',
      email: formData.get("email")?.toString() || '',
      phoneNumber: formData.get("phone-number")?.toString() || '',
      contactInfo: formData.get("contact-info")?.toString() || '',
      dateOfBirth: formData.get("date-of-birth")?.toString() || '',
      nationality: formData.get("nationality")?.toString() || '',
      passportNumber: formData.get("passport-number")?.toString() || '',

      // Cruise Details
      cruiseLine: formData.get("cruise-line")?.toString() || '',
      shipName: formData.get("ship-name")?.toString() || '',
      departurePort: formData.get("departure-port")?.toString() || '',
      destinations: formData.get("destinations")?.toString() || '',
      departureDate: formData.get("departure-date")?.toString() || '',
      returnDate: formData.get("return-date")?.toString() || '',
      numberOfNights: formData.get("number-of-nights")?.toString() || '',
      numberOfAdults: formData.get("number-of-adults")?.toString() || '',
      numberOfChildren: formData.get("number-of-children")?.toString() || '',
      cabinType: formData.get("cabin-type")?.toString() || '',
      diningPreference: formData.get("dining-preference")?.toString() || '',
      specialRequests: formData.get("special-requests")?.toString() || '',

      // Travel Insurance
      hasInsurance: formData.get("has-insurance") === "yes",
      insurancePlan: formData.get("insurance-plan")?.toString() || '',

      // Agreements
      termsAccepted: formData.get("terms") === "on",
      privacyAccepted: formData.get("privacy") === "on"
    }

    try {
      const response = await fetch("https://script.google.com/macros/s/AKfycbz6qiCKhIMgj6DYUY-bW9HMtJ1qolq1TF424uK2pRZnftKsIBDT3nM976eZKHavUW_X/exec", {
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
              <h1 className="text-3xl font-bold mb-2">Cruise Booking</h1>
              <p className="text-muted-foreground">Book your dream cruise with GoComfort USA — offering the best rates and a wide selection of cruise lines.</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Ship className="h-5 w-5 mr-2 text-primary" />
                  Booking Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  {/* Personal Information Section */}
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Personal Information</h2>
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

                    <div className="space-y-2">
                      <Label htmlFor="passport-number">Passport Number *</Label>
                      <Input 
                        id="passport-number" 
                        name="passport-number" 
                        placeholder="Enter your passport number" 
                        required 
                      />
                    </div>
                  </div>

                  {/* Cruise Details Section */}
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Cruise Details</h2>
                    <div className="space-y-2">
                      <Label htmlFor="cruise-line">Cruise Line *</Label>
                      <select 
                        id="cruise-line" 
                        name="cruise-line" 
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        required
                      >
                        <option value="">Select cruise line</option>
                        <option value="royal-caribbean">Royal Caribbean</option>
                        <option value="carnival">Carnival Cruise Line</option>
                        <option value="norwegian">Norwegian Cruise Line</option>
                        <option value="msc">MSC Cruises</option>
                        <option value="disney">Disney Cruise Line</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="ship-name">Ship Name *</Label>
                      <Input 
                        id="ship-name" 
                        name="ship-name" 
                        placeholder="Enter ship name" 
                        required 
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="departure-port">Departure Port *</Label>
                      <select 
                        id="departure-port" 
                        name="departure-port" 
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        required
                      >
                        <option value="">Select departure port</option>
                        <option value="miami">Miami, Florida</option>
                        <option value="fort-lauderdale">Fort Lauderdale, Florida</option>
                        <option value="port-canaveral">Port Canaveral, Florida</option>
                        <option value="tampa">Tampa, Florida</option>
                        <option value="galveston">Galveston, Texas</option>
                        <option value="los-angeles">Los Angeles, California</option>
                        <option value="seattle">Seattle, Washington</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="destinations">Destinations *</Label>
                      <select 
                        id="destinations" 
                        name="destinations" 
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        required
                      >
                        <option value="">Select destinations</option>
                        <option value="caribbean">Caribbean</option>
                        <option value="bahamas">Bahamas</option>
                        <option value="mexico">Mexico</option>
                        <option value="alaska">Alaska</option>
                        <option value="europe">Europe</option>
                        <option value="asia">Asia</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="departure-date">Departure Date *</Label>
                        <Input 
                          id="departure-date" 
                          name="departure-date" 
                          type="date" 
                          required 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="return-date">Return Date *</Label>
                        <Input 
                          id="return-date" 
                          name="return-date" 
                          type="date" 
                          required 
                        />
                      </div>
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
                      <Label htmlFor="cabin-type">Cabin Type *</Label>
                      <select 
                        id="cabin-type" 
                        name="cabin-type" 
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        required
                      >
                        <option value="">Select cabin type</option>
                        <option value="interior">Interior</option>
                        <option value="oceanview">Oceanview</option>
                        <option value="balcony">Balcony</option>
                        <option value="suite">Suite</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label>Dining Preference *</Label>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <input type="radio" id="early" name="dining-preference" value="early" required className="h-4 w-4" />
                          <Label htmlFor="early">Early Seating</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="radio" id="late" name="dining-preference" value="late" className="h-4 w-4" />
                          <Label htmlFor="late">Late Seating</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="radio" id="anytime" name="dining-preference" value="anytime" className="h-4 w-4" />
                          <Label htmlFor="anytime">Anytime Dining</Label>
                        </div>
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

                  {/* Travel Insurance Section */}
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Travel Insurance</h2>
                    <div className="space-y-2">
                      <Label>Add Travel Insurance?</Label>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <input 
                            type="radio" 
                            id="insurance-yes" 
                            name="has-insurance" 
                            value="yes" 
                            className="h-4 w-4"
                            onChange={() => setHasInsurance(true)}
                          />
                          <Label htmlFor="insurance-yes">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input 
                            type="radio" 
                            id="insurance-no" 
                            name="has-insurance" 
                            value="no" 
                            className="h-4 w-4"
                            onChange={() => setHasInsurance(false)}
                          />
                          <Label htmlFor="insurance-no">No</Label>
                        </div>
                      </div>
                    </div>

                    {hasInsurance && (
                      <div className="space-y-2">
                        <Label htmlFor="insurance-plan">Insurance Plan *</Label>
                        <select 
                          id="insurance-plan" 
                          name="insurance-plan" 
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <option value="">Select insurance plan</option>
                          <option value="basic">Basic Coverage</option>
                          <option value="premium">Premium Coverage</option>
                          <option value="deluxe">Deluxe Coverage</option>
                        </select>
                      </div>
                    )}
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
                        Your cruise booking request has been submitted successfully. Our team will contact you via WhatsApp or Telegram shortly.
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
                      <p className="text-sm text-muted-foreground">We promise the lowest cruise rates</p>
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
                      <p className="text-sm text-muted-foreground">Free cancellation on most cruises</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 mr-2" />
                    <div>
                      <h3 className="font-bold">Wide Selection</h3>
                      <p className="text-sm text-muted-foreground">Choose from various cruise lines and destinations</p>
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
                    <Link href="/contact">Contact Cruise Support</Link>
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
