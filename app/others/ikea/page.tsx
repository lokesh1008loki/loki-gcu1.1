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

// Sample IKEA stores data - you can expand this list
const ikeaStores = [
  { id: "1", name: "IKEA Burbank", city: "Burbank", state: "CA", zip: "91502" },
  { id: "2", name: "IKEA Carson", city: "Carson", state: "CA", zip: "90746" },
  { id: "3", name: "IKEA Emeryville", city: "Emeryville", state: "CA", zip: "94608" },
  { id: "4", name: "IKEA East Palo Alto", city: "East Palo Alto", state: "CA", zip: "94303" },
  { id: "5", name: "IKEA West Sacramento", city: "West Sacramento", state: "CA", zip: "95691" },
  { id: "6", name: "IKEA Portland", city: "Portland", state: "OR", zip: "97223" },
  { id: "7", name: "IKEA Seattle", city: "Seattle", state: "WA", zip: "98188" },
  { id: "8", name: "IKEA Las Vegas", city: "Las Vegas", state: "NV", zip: "89115" },
  { id: "9", name: "IKEA Tempe", city: "Tempe", state: "AZ", zip: "85281" },
  { id: "10", name: "IKEA Centennial", city: "Centennial", state: "CO", zip: "80112" },
  { id: "11", name: "IKEA Draper", city: "Draper", state: "UT", zip: "84020" },
  { id: "12", name: "IKEA Round Rock", city: "Round Rock", state: "TX", zip: "78664" },
  { id: "13", name: "IKEA Grand Prairie", city: "Grand Prairie", state: "TX", zip: "75052" },
  { id: "14", name: "IKEA Houston", city: "Houston", state: "TX", zip: "77038" },
  { id: "15", name: "IKEA Live Oak", city: "Live Oak", state: "TX", zip: "78233" },
  { id: "16", name: "IKEA Frisco", city: "Frisco", state: "TX", zip: "75034" },
  { id: "17", name: "IKEA Merriam", city: "Merriam", state: "KS", zip: "66203" },
  { id: "18", name: "IKEA Fishers", city: "Fishers", state: "IN", zip: "46037" },
  { id: "19", name: "IKEA Bolingbrook", city: "Bolingbrook", state: "IL", zip: "60440" },
  { id: "20", name: "IKEA Schaumburg", city: "Schaumburg", state: "IL", zip: "60173" },
  { id: "21", name: "IKEA Oak Creek", city: "Oak Creek", state: "WI", zip: "53154" },
  { id: "22", name: "IKEA Bloomington", city: "Bloomington", state: "MN", zip: "55425" },
  { id: "23", name: "IKEA Charlotte", city: "Charlotte", state: "NC", zip: "28278" },
  { id: "24", name: "IKEA Atlanta", city: "Atlanta", state: "GA", zip: "30360" },
  { id: "25", name: "IKEA Sunrise", city: "Sunrise", state: "FL", zip: "33323" },
  { id: "26", name: "IKEA Orlando", city: "Orlando", state: "FL", zip: "32819" },
  { id: "27", name: "IKEA Tampa", city: "Tampa", state: "FL", zip: "33619" },
  { id: "28", name: "IKEA Jacksonville", city: "Jacksonville", state: "FL", zip: "32256" },
  { id: "29", name: "IKEA Elizabeth", city: "Elizabeth", state: "NJ", zip: "07201" },
  { id: "30", name: "IKEA Paramus", city: "Paramus", state: "NJ", zip: "07652" },
  { id: "31", name: "IKEA Brooklyn", city: "Brooklyn", state: "NY", zip: "11220" },
  { id: "32", name: "IKEA Long Island", city: "Hicksville", state: "NY", zip: "11801" },
  { id: "33", name: "IKEA New Haven", city: "New Haven", state: "CT", zip: "06513" },
  { id: "34", name: "IKEA Stoughton", city: "Stoughton", state: "MA", zip: "02072" },
  { id: "35", name: "IKEA Philadelphia", city: "Philadelphia", state: "PA", zip: "19148" },
  { id: "36", name: "IKEA Pittsburgh", city: "Pittsburgh", state: "PA", zip: "15275" },
  { id: "37", name: "IKEA Baltimore", city: "Baltimore", state: "MD", zip: "21240" },
  { id: "38", name: "IKEA College Park", city: "College Park", state: "MD", zip: "20740" },
  { id: "39", name: "IKEA Woodbridge", city: "Woodbridge", state: "VA", zip: "22192" },
  { id: "40", name: "IKEA Norfolk", city: "Norfolk", state: "VA", zip: "23502" }
];

const pickupTimes = [
  { value: "morning", label: "Morning (9:00 AM - 12:00 PM)" },
  { value: "afternoon", label: "Afternoon (12:00 PM - 3:00 PM)" },
  { value: "evening", label: "Evening (3:00 PM - Close)" }
];

export default function IKEAOrderPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [selectedStore, setSelectedStore] = useState("")
  const [storeDetails, setStoreDetails] = useState({
    city: "",
    state: "",
    zip: ""
  })

  const handleStoreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const storeId = e.target.value;
    setSelectedStore(storeId);
    
    if (storeId) {
      const store = ikeaStores.find(s => s.id === storeId);
      if (store) {
        setStoreDetails({
          city: store.city,
          state: store.state,
          zip: store.zip
        });
      }
    } else {
      setStoreDetails({ city: "", state: "", zip: "" });
    }
  };

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
      email: formData.get("email")?.toString() || '',
      phone: formData.get("phone")?.toString() || '',
      contactInfo: contactInfo,
      storeId: selectedStore,
      storeName: ikeaStores.find(s => s.id === selectedStore)?.name || '',
      storeCity: storeDetails.city,
      storeState: storeDetails.state,
      storeZip: storeDetails.zip,
      productLink: formData.get("productLink")?.toString() || '',
      quantity: formData.get("quantity")?.toString() || '',
      productTitle: formData.get("productTitle")?.toString() || '',
      productOptions: formData.get("productOptions")?.toString() || '',
      pickupDate: formData.get("pickupDate")?.toString() || '',
      pickupTime: formData.get("pickupTime")?.toString() || '',
      specialRequests: formData.get("specialRequests")?.toString() || '',
      status: "Pending"
    }

    try {
      const response = await fetch("https://script.google.com/macros/s/AKfycbx9DjsooSkeQL1q0aET5rnAnpChKYC-F2KfHuLECqRgcxJAmQ2vJRp19WVekn_NSFNRoA/exec", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        mode: 'no-cors'
      })

      setShowConfirmation(true)
      form.reset()
      setSelectedStore("")
      setStoreDetails({ city: "", state: "", zip: "" })
    } catch (error) {
      console.error("Error submitting form:", error)
      toast.error("Failed to submit order request. Please try again.")
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
            src="/ass/ikea.jpg"
            alt="IKEA Order Placement"
            width={1920}
            height={600}
            className="w-full h-[300px] sm:h-[400px] md:h-[500px] object-cover brightness-110"
            priority
          />
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 sm:mb-4 drop-shadow-lg">
              Order from IKEA USA — We'll Handle the Checkout, You Collect It!
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-2xl text-white/95 mb-4 sm:mb-6 md:mb-8 max-w-2xl drop-shadow-md">
              Fast and secure IKEA USA order placement with your selected store and time. No login, no stress — just pick up your order!
            </p>
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-white/90 text-sm sm:text-base md:text-lg px-4 sm:px-6 md:px-8 py-2 sm:py-4 md:py-6 shadow-lg"
              onClick={() => document.getElementById('order-section')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Place My IKEA Order
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8" id="order-section">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Info className="h-5 w-5 mr-2 text-primary" />
                  IKEA Order Placement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <Label>Personal Information</Label>
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
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          placeholder="Enter your phone number"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Contact Options */}
                  <div className="space-y-4">
                    <Label>Contact Option</Label>
                    <div className="space-y-2">
                      <Label htmlFor="contactInfo">Telegram ID or WhatsApp Number * (For Instant Support and order confirmation) </Label>
                      <Input
                        id="contactInfo"
                        name="contactInfo"
                        placeholder="Enter your Telegram ID or WhatsApp number"
                        required
                      />
                    </div>
                  </div>

                  {/* Store Pickup Location */}
                  <div className="space-y-4">
                    <Label>Store Pickup Location</Label>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="store">IKEA Store *</Label>
                        <select
                          id="store"
                          name="store"
                          className="w-full rounded-md border border-input bg-background px-3 py-2"
                          value={selectedStore}
                          onChange={handleStoreChange}
                          required
                        >
                          <option value="">Select IKEA Store</option>
                          {ikeaStores.map((store) => (
                            <option key={store.id} value={store.id}>
                              {store.name} - {store.city}, {store.state}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="storeCity">City *</Label>
                          <Input
                            id="storeCity"
                            name="storeCity"
                            value={storeDetails.city}
                            readOnly
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="storeState">State *</Label>
                          <Input
                            id="storeState"
                            name="storeState"
                            value={storeDetails.state}
                            readOnly
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="storeZip">ZIP Code *</Label>
                          <Input
                            id="storeZip"
                            name="storeZip"
                            value={storeDetails.zip}
                            readOnly
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Item Details */}
                  <div className="space-y-4">
                    <Label>Item Details</Label>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="productLink">IKEA Product Link *</Label>
                        <Input
                          id="productLink"
                          name="productLink"
                          type="url"
                          placeholder="https://www.ikea.com/us/en/p/..."
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="quantity">Quantity *</Label>
                        <Input
                          id="quantity"
                          name="quantity"
                          type="number"
                          min="1"
                          placeholder="Enter quantity"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="productTitle">Item Title/Name</Label>
                        <Input
                          id="productTitle"
                          name="productTitle"
                          placeholder="Enter item title/name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="productOptions">Product Options</Label>
                        <Input
                          id="productOptions"
                          name="productOptions"
                          placeholder="Color, size, etc."
                        />
                      </div>
                    </div>
                  </div>

                  {/* Preferred Order Details */}
                  <div className="space-y-4">
                    <Label>Preferred Order Details</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="pickupDate">Preferred Pickup Date *</Label>
                        <Input
                          id="pickupDate"
                          name="pickupDate"
                          type="date"
                          required
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="pickupTime">Preferred Pickup Time</Label>
                        <select
                          id="pickupTime"
                          name="pickupTime"
                          className="w-full rounded-md border border-input bg-background px-3 py-2"
                        >
                          <option value="">Select pickup time</option>
                          {pickupTimes.map((time) => (
                            <option key={time.value} value={time.value}>
                              {time.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="specialRequests">Special Requests / Notes</Label>
                      <textarea
                        id="specialRequests"
                        name="specialRequests"
                        placeholder="Any special requests or notes"
                        className="w-full rounded-md border border-input bg-background px-3 py-2 min-h-[100px]"
                      />
                    </div>
                  </div>

                  <Button className="w-full" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit Order Request"}
                  </Button>

                  {showConfirmation && (
                    <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-green-700 text-center">
                        Thanks for your IKEA order request! We'll process it shortly and reach out via your preferred contact method.
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
                <h2 className="text-xl font-bold mb-4">Why Order With Us?</h2>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 mr-2" />
                    <div>
                      <h3 className="font-bold">Expert Order Research</h3>
                      <p className="text-sm text-muted-foreground">We optimize your order for the best experience</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 mr-2" />
                    <div>
                      <h3 className="font-bold">Flexible Pickup</h3>
                      <p className="text-sm text-muted-foreground">Choose your preferred store and time</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 mr-2" />
                    <div>
                      <h3 className="font-bold">24/7 Support</h3>
                      <p className="text-sm text-muted-foreground">Instant support via WhatsApp/Telegram</p>
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
                    <span>Having trouble with your order?</span>
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
                    We handle the checkout process for you. Simply provide your order details, and we'll take care of the rest!
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
