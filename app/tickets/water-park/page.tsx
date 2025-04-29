"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, AlertCircle, Waves } from "lucide-react"
import { Toaster } from "@/components/ui/sonner"
import Link from "next/link"
import Image from "next/image"

// Sample waterpark data - replace with actual API data
const waterparks = [
  {
    name: "Disney's Typhoon Lagoon",
    cities: [
      { name: "Orlando", state: "FL", address: "1145 East Buena Vista Drive, Lake Buena Vista, FL 32830" }
    ]
  },
  {
    name: "Disney's Blizzard Beach",
    cities: [
      { name: "Orlando", state: "FL", address: "1534 Blizzard Beach Drive, Lake Buena Vista, FL 32830" }
    ]
  },
  {
    name: "Aquatica Orlando",
    cities: [
      { name: "Orlando", state: "FL", address: "5800 Water Play Way, Orlando, FL 32821" }
    ]
  },
  {
    name: "Wet 'n Wild",
    cities: [
      { name: "Orlando", state: "FL", address: "6200 International Drive, Orlando, FL 32821" }
    ]
  },
  {
    name: "Schlitterbahn Waterpark",
    cities: [
      { name: "New Braunfels", state: "TX", address: "400 N Liberty Ave, New Braunfels, TX 78130" },
      { name: "Galveston", state: "TX", address: "2026 Lockheed St, Galveston, TX 77554" },
      { name: "Kansas City", state: "KS", address: "9400 State Ave, Kansas City, KS 66112" }
    ]
  },
  {
    name: "Noah's Ark Waterpark",
    cities: [
      { name: "Wisconsin Dells", state: "WI", address: "1410 Wisconsin Dells Pkwy, Wisconsin Dells, WI 53965" }
    ]
  },
  {
    name: "Water World",
    cities: [
      { name: "Federal Heights", state: "CO", address: "8801 N Pecos St, Federal Heights, CO 80260" }
    ]
  },
  {
    name: "Raging Waters",
    cities: [
      { name: "San Dimas", state: "CA", address: "111 Raging Waters Dr, San Dimas, CA 91773" },
      { name: "San Jose", state: "CA", address: "2333 S White Rd, San Jose, CA 95148" },
      { name: "Sacramento", state: "CA", address: "1600 Exposition Blvd, Sacramento, CA 95815" }
    ]
  },
  {
    name: "Six Flags Hurricane Harbor",
    cities: [
      { name: "Arlington", state: "TX", address: "1800 E Lamar Blvd, Arlington, TX 76006" },
      { name: "Jackson", state: "NJ", address: "1 Six Flags Blvd, Jackson, NJ 08527" },
      { name: "Valencia", state: "CA", address: "26101 Magic Mountain Pkwy, Valencia, CA 91355" },
      { name: "Chicago", state: "IL", address: "1 Great America Parkway, Gurnee, IL 60031" },
      { name: "St. Louis", state: "MO", address: "4900 Six Flags Rd, Eureka, MO 63025" }
    ]
  },
  {
    name: "Adventure Island",
    cities: [
      { name: "Tampa", state: "FL", address: "10001 McKinley Dr, Tampa, FL 33612" }
    ]
  },
  {
    name: "Wild Waves Theme & Water Park",
    cities: [
      { name: "Federal Way", state: "WA", address: "36201 Enchanted Pkwy S, Federal Way, WA 98003" }
    ]
  },
  {
    name: "Dollywood's Splash Country",
    cities: [
      { name: "Pigeon Forge", state: "TN", address: "2700 Dollywood Parks Blvd, Pigeon Forge, TN 37863" }
    ]
  },
  {
    name: "Cedar Point Shores",
    cities: [
      { name: "Sandusky", state: "OH", address: "1 Cedar Point Dr, Sandusky, OH 44870" }
    ]
  },
  {
    name: "Kings Island Soak City",
    cities: [
      { name: "Mason", state: "OH", address: "6300 Kings Island Dr, Mason, OH 45040" }
    ]
  },
  {
    name: "Carowinds Carolina Harbor",
    cities: [
      { name: "Charlotte", state: "NC", address: "14523 Carowinds Blvd, Charlotte, NC 28273" }
    ]
  },
  {
    name: "Other",
    cities: []
  }
]

export default function WaterparkBookingPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [selectedPark, setSelectedPark] = useState("")
  const [selectedCity, setSelectedCity] = useState("")
  const [selectedState, setSelectedState] = useState("")
  const [parkAddress, setParkAddress] = useState("")
  const [customParkName, setCustomParkName] = useState("")
  const [customParkLocation, setCustomParkLocation] = useState("")
  const [visitorCount, setVisitorCount] = useState({
    adult: 1,
    child: 0,
    senior: 0
  })

  const scrollToBooking = () => {
    const bookingSection = document.getElementById('booking-section')
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleParkSelect = (parkName: string) => {
    setSelectedPark(parkName)
    setSelectedCity("")
    setSelectedState("")
    setParkAddress("")
  }

  const handleCitySelect = (city: string, state: string, address: string) => {
    setSelectedCity(city)
    setSelectedState(state)
    setParkAddress(address)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setShowConfirmation(false)

    const form = e.target as HTMLFormElement
    const formData = new FormData(form)

    const data = {
      waterpark: selectedPark,
      customParkName: selectedPark === "Other" ? customParkName : "",
      city: selectedCity,
      state: selectedState,
      parkAddress: parkAddress,
      customParkLocation: selectedPark === "Other" ? customParkLocation : "",
      visitDate: formData.get("visitDate")?.toString() || '',
      adultCount: visitorCount.adult,
      childCount: visitorCount.child,
      seniorCount: visitorCount.senior,
      lockerRental: formData.get("lockerRental") === "on",
      towelRental: formData.get("towelRental") === "on",
      mealCombo: formData.get("mealCombo") === "on",
      parkingPass: formData.get("parkingPass") === "on",
      contactInfo: formData.get("contactInfo")?.toString() || '',
      specialRequests: formData.get("specialRequests")?.toString() || ''
    }

    try {
      const response = await fetch("https://script.google.com/macros/s/AKfycbxpYuzl4Ss2snOeYwx-Pekgz-guDYg92n7aXwze6yJ6OGrob3Ars28UKdrxCw4wL2b5rQ/exec", {
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
      setSelectedCity("")
      setSelectedState("")
      setParkAddress("")
      setCustomParkName("")
      setCustomParkLocation("")
      setVisitorCount({ adult: 1, child: 0, senior: 0 })
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
            src="/ass/waterpark-hero.jpg"
            alt="Waterpark Adventure"
            width={1920}
            height={600}
            className="w-full h-[500px] object-cover brightness-110"
            priority
          />
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">Make a Splash with GoComfort USA</h1>
            <p className="text-2xl text-white/95 mb-8 max-w-2xl drop-shadow-md">
            Enjoy guaranteed lowest rates on waterpark bookings with GoComfort USA — plus exciting offers and heavy discounts to make your splash-filled day even better!.
            </p>
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6 shadow-lg"
              onClick={scrollToBooking}
            >
              Start Booking
            </Button>
          </div>
          </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8" id="booking-section">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Waves className="h-5 w-5 mr-2 text-primary" />
                  Waterpark Booking
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  {/* Waterpark Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="waterpark">Waterpark Name *</Label>
                    <select
                      id="waterpark"
                      className="w-full rounded-md border border-input bg-background px-3 py-2"
                      value={selectedPark}
                      onChange={(e) => handleParkSelect(e.target.value)}
                      required
                    >
                      <option value="">Select a waterpark</option>
                      {waterparks.map((park) => (
                        <option key={park.name} value={park.name}>
                          {park.name}
                        </option>
                      ))}
                    </select>
                </div>

                  {/* Custom Park Input */}
                  {selectedPark === "Other" && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="customParkName">Waterpark Name *</Label>
                        <Input
                          id="customParkName"
                          name="customParkName"
                          placeholder="Enter waterpark name"
                          value={customParkName}
                          onChange={(e) => setCustomParkName(e.target.value)}
                          required
                        />
                </div>
                      <div className="space-y-2">
                        <Label htmlFor="customParkLocation">Waterpark Location *</Label>
                        <Input
                          id="customParkLocation"
                          name="customParkLocation"
                          placeholder="Enter waterpark location (City, State)"
                          value={customParkLocation}
                          onChange={(e) => setCustomParkLocation(e.target.value)}
                          required
                        />
                </div>
              </div>
                  )}

                  {/* Location Selection */}
                  {selectedPark && selectedPark !== "Other" && (
                    <div className="space-y-2">
                      <Label>Location *</Label>
                      <select
                        className="w-full rounded-md border border-input bg-background px-3 py-2"
                        value={selectedCity}
                        onChange={(e) => {
                          const park = waterparks.find(p => p.name === selectedPark)
                          const city = park?.cities.find(c => c.name === e.target.value)
                          if (city) {
                            handleCitySelect(city.name, city.state, city.address)
                          }
                        }}
                        required
                      >
                        <option value="">Select a city</option>
                        {waterparks
                          .find(p => p.name === selectedPark)
                          ?.cities.map((city) => (
                            <option key={city.name} value={city.name}>
                              {city.name}, {city.state}
                            </option>
                          ))}
                      </select>
                      {parkAddress && (
                        <p className="text-sm text-muted-foreground mt-2">
                          Address: {parkAddress}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Visit Date */}
                  <div className="space-y-2">
                    <Label htmlFor="visitDate">Date of Visit *</Label>
                    <Input
                      id="visitDate"
                      name="visitDate"
                      type="date"
                      required
                      min={new Date().toISOString().split('T')[0]}
                    />
              </div>

                  {/* Visitor Count */}
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
                            onClick={() => setVisitorCount(prev => ({ ...prev, adult: Math.max(0, prev.adult - 1) }))}
                          >
                            -
                          </Button>
                          <Input
                            type="number"
                            value={visitorCount.adult}
                            readOnly
                            className="w-16 text-center"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setVisitorCount(prev => ({ ...prev, adult: prev.adult + 1 }))}
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
                            onClick={() => setVisitorCount(prev => ({ ...prev, child: Math.max(0, prev.child - 1) }))}
                          >
                            -
                          </Button>
                          <Input
                            type="number"
                            value={visitorCount.child}
                            readOnly
                            className="w-16 text-center"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setVisitorCount(prev => ({ ...prev, child: prev.child + 1 }))}
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
                            onClick={() => setVisitorCount(prev => ({ ...prev, senior: Math.max(0, prev.senior - 1) }))}
                          >
                            -
                          </Button>
                          <Input
                            type="number"
                            value={visitorCount.senior}
                            readOnly
                            className="w-16 text-center"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setVisitorCount(prev => ({ ...prev, senior: prev.senior + 1 }))}
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
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="lockerRental"
                          name="lockerRental"
                          className="rounded border-gray-300"
                        />
                        <Label htmlFor="lockerRental">Locker Rental</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="towelRental"
                          name="towelRental"
                          className="rounded border-gray-300"
                        />
                        <Label htmlFor="towelRental">Towel Rental</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="mealCombo"
                          name="mealCombo"
                          className="rounded border-gray-300"
                        />
                        <Label htmlFor="mealCombo">Meal Combo</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="parkingPass"
                          name="parkingPass"
                          className="rounded border-gray-300"
                        />
                        <Label htmlFor="parkingPass">Parking Pass</Label>
                      </div>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-2">
                    <Label htmlFor="contactInfo">Telegram ID or WhatsApp Number * (For ASAP Support)</Label>
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
                    <Link href="/contact">Contact Waterpark Support</Link>
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
