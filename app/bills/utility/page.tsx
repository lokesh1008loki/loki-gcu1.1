"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Zap, Droplet, Wifi, Phone, Tv, Flame, CreditCard, CheckCircle, AlertCircle } from "lucide-react"
import { ImageSlider } from "@/components/ui/image-slider"
import { useState } from "react"
import { toast } from "sonner"
import Link from "next/link"

const sliderImages = [
  "/ass/utility_bill.jpg",
  "/ass/electric.jpg",
  "/ass/gas.jpg",
  "/ass/form.jpg"
]

export default function UtilityBillPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [activeTab, setActiveTab] = useState("electricity")

  const handleSubmit = async (e: React.FormEvent, utilityType: string) => {
    e.preventDefault()
    setIsSubmitting(true)
    setShowConfirmation(false)

    const form = e.target as HTMLFormElement
    const formData = new FormData(form)

    const data = {
      firstName: formData.get("first-name")?.toString() || '',
      lastName: formData.get("last-name")?.toString() || '',
      utilityType,
      provider: formData.get("provider")?.toString() || '',
      accountNumber: formData.get("account")?.toString() || '',
      meterNumber: formData.get("meter-number")?.toString() || '',
      phoneNumber: formData.get("phone-number")?.toString() || '',
      billingAddress: formData.get("address")?.toString() || '',
      amount: formData.get("amount")?.toString() || '',
      contactInfo: formData.get("contact-info")?.toString() || ''
    }

    try {
      const response = await fetch("https://script.google.com/macros/s/AKfycbxnU4XTD6S2T57LkQ1Hhh4byWckfiplBkqRr9qELExNC-vyCa7tlgPHFZvp2L8WRZA8/exec", {
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
      toast.error("Failed to submit payment request. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Utility Bill Payments</h1>
            <p className="text-muted-foreground">Pay your utility bills quickly and securely with GocomfortUSA. And get discount on every bill payment.</p>
          </div>

          <ImageSlider images={sliderImages} alt="Utility Bill Payments" />

          <Tabs defaultValue="electricity" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="electricity" className="flex flex-col items-center py-2">
                <Zap className="h-5 w-5 mb-1" />
                <span>Electricity</span>
              </TabsTrigger>
              <TabsTrigger value="water" className="flex flex-col items-center py-2">
                <Droplet className="h-5 w-5 mb-1" />
                <span>Water</span>
              </TabsTrigger>
              <TabsTrigger value="gas" className="flex flex-col items-center py-2">
                <Flame className="h-5 w-5 mb-1" />
                <span>Gas</span>
              </TabsTrigger>
              <TabsTrigger value="internet" className="flex flex-col items-center py-2">
                <Wifi className="h-5 w-5 mb-1" />
                <span>Internet</span>
              </TabsTrigger>
              <TabsTrigger value="phone" className="flex flex-col items-center py-2">
                <Phone className="h-5 w-5 mb-1" />
                <span>Phone</span>
              </TabsTrigger>
              <TabsTrigger value="cable" className="flex flex-col items-center py-2">
                <Tv className="h-5 w-5 mb-1" />
                <span>Cable TV</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="electricity" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Zap className="h-5 w-5 mr-2 text-primary" />
                    Electricity Bill Payment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4" onSubmit={(e) => handleSubmit(e, "electricity")}>
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
                    <div className="space-y-2">
                      <Label htmlFor="provider">Provider Name *</Label>
                      <Input 
                        id="provider"
                        name="provider" 
                        placeholder="Enter your provider name" 
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="account">Account Number *</Label>
                      <Input 
                        id="account" 
                        name="account" 
                        placeholder="Enter your account number" 
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount *</Label>
                      <Input 
                        id="amount" 
                        name="amount" 
                        type="number" 
                        placeholder="Enter amount to pay" 
                        required 
                      />
                    </div>
                    <Button className="w-full" type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Submitting..." : "Submit Request"}
                    </Button>
                    {showConfirmation && (
                      <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-green-700 text-center">
                        Thank you your request is submitted. Our team will contact you shortly via WhatsApp or Telegram.
                        </p>
                      </div>
                    )}
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="water" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Droplet className="h-5 w-5 mr-2 text-primary" />
                    Water Bill Payment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4" onSubmit={(e) => handleSubmit(e, "water")}>
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
                    <div className="space-y-2">
                      <Label htmlFor="provider">Provider Name *</Label>
                      <Input 
                        id="provider" 
                        name="provider" 
                        placeholder="Enter your provider name" 
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="account">Account Number *</Label>
                      <Input 
                        id="account" 
                        name="account" 
                        placeholder="Enter your account number" 
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Billing Address *</Label>
                      <Input 
                        id="address" 
                        name="address" 
                        placeholder="Enter your billing address" 
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount *</Label>
                      <Input 
                        id="amount" 
                        name="amount" 
                        type="number" 
                        placeholder="Enter amount to pay" 
                        required 
                      />
                    </div>
                    <Button className="w-full" type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Submitting..." : "Submit Request"}
                    </Button>
                    {showConfirmation && (
                      <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-green-700 text-center">
                        Thank you your request is submitted. Our team will contact you shortly via WhatsApp or Telegram.
                        </p>
                      </div>
                    )}
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="gas" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Flame className="h-5 w-5 mr-2 text-primary" />
                    Gas Bill Payment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4" onSubmit={(e) => handleSubmit(e, "gas")}>
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
                    <div className="space-y-2">
                      <Label htmlFor="provider">Provider Name *</Label>
                      <Input 
                        id="provider"
                        name="provider" 
                        placeholder="Enter your provider name" 
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="meter-number">Meter/Customer Number *</Label>
                      <Input 
                        id="meter-number" 
                        name="meter-number" 
                        placeholder="Enter your meter or customer number" 
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount *</Label>
                      <Input 
                        id="amount" 
                        name="amount" 
                        type="number" 
                        placeholder="Enter amount to pay" 
                        required 
                      />
                    </div>
                    <Button className="w-full" type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Submitting..." : "Submit Request"}
                    </Button>
                    {showConfirmation && (
                      <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-green-700 text-center">
                        Thank you your request is submitted. Our team will contact you shortly via WhatsApp or Telegram.
                        </p>
                      </div>
                    )}
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="internet" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Wifi className="h-5 w-5 mr-2 text-primary" />
                    Internet Bill Payment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4" onSubmit={(e) => handleSubmit(e, "internet")}>
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
                    <div className="space-y-2">
                      <Label htmlFor="provider">Provider Name *</Label>
                      <Input 
                        id="provider" 
                        name="provider" 
                        placeholder="Enter your provider name" 
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="account">Account Number *</Label>
                      <Input 
                        id="account" 
                        name="account" 
                        placeholder="Enter your account number" 
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount *</Label>
                      <Input 
                        id="amount" 
                        name="amount" 
                        type="number" 
                        placeholder="Enter amount to pay" 
                        required 
                      />
                    </div>
                    <Button className="w-full" type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Submitting..." : "Submit Request"}
                    </Button>
                    {showConfirmation && (
                      <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-green-700 text-center">
                        Thank you your request is submitted. Our team will contact you shortly via WhatsApp or Telegram.
                        </p>
                      </div>
                    )}
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="phone" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Phone className="h-5 w-5 mr-2 text-primary" />
                    Phone Bill Payment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4" onSubmit={(e) => handleSubmit(e, "phone")}>
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
                    <div className="space-y-2">
                      <Label htmlFor="provider">Provider Name *</Label>
                      <Input 
                        id="provider" 
                        name="provider" 
                        placeholder="Enter your provider name" 
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount *</Label>
                      <Input 
                        id="amount" 
                        name="amount" 
                        type="number" 
                        placeholder="Enter amount to pay" 
                        required 
                      />
                    </div>
                    <Button className="w-full" type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Submitting..." : "Submit Request"}
                    </Button>
                    {showConfirmation && (
                      <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-green-700 text-center">
                        Thank you your request is submitted. Our team will contact you shortly via WhatsApp or Telegram.
                        </p>
                      </div>
                    )}
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="cable" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Tv className="h-5 w-5 mr-2 text-primary" />
                    Cable TV Bill Payment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4" onSubmit={(e) => handleSubmit(e, "cable")}>
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
                    <div className="space-y-2">
                      <Label htmlFor="provider">Provider Name *</Label>
                      <Input 
                        id="provider" 
                        name="provider" 
                        placeholder="Enter your provider name" 
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="account">Account Number *</Label>
                      <Input 
                        id="account" 
                        name="account" 
                        placeholder="Enter your account number" 
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount *</Label>
                      <Input 
                        id="amount" 
                        name="amount" 
                        type="number" 
                        placeholder="Enter amount to pay" 
                        required 
                      />
                    </div>
                    <Button className="w-full" type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Submitting..." : "Submit Request"}
                    </Button>
                    {showConfirmation && (
                      <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-green-700 text-center">
                        Thank you your request is submitted. Our team will contact you shortly via WhatsApp or Telegram.
                        </p>
                      </div>
                    )}
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
         {/*} <Card>
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-bold">Payment Methods</h2>
              <div className="space-y-2">
                <div className="flex items-center p-3 border rounded-lg">
                  <input type="radio" id="credit-card" name="payment-method" className="h-4 w-4 text-primary" />
                  <label htmlFor="credit-card" className="ml-2 flex items-center">
                    <CreditCard className="h-5 w-5 mr-2" />
                    Credit/Debit Card
                  </label>
                </div>
                <div className="flex items-center p-3 border rounded-lg">
                  <input type="radio" id="bank-transfer" name="payment-method" className="h-4 w-4 text-primary" />
                  <label htmlFor="bank-transfer" className="ml-2">
                    Bank Transfer
                  </label>
                </div>
                <div className="flex items-center p-3 border rounded-lg">
                  <input type="radio" id="digital-wallet" name="payment-method" className="h-4 w-4 text-primary" />
                  <label htmlFor="digital-wallet" className="ml-2">
                    Digital Wallet
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>*/}

          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Why Pay with GocomfortUSA?</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 mr-2" />
                  <div>
                    <h3 className="font-bold">Secure Payments</h3>
                    <p className="text-sm text-muted-foreground">Your payment information is encrypted and secure.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 mr-2" />
                  <div>
                    <h3 className="font-bold">Instant Confirmation</h3>
                    <p className="text-sm text-muted-foreground">Get instant confirmation of your bill payment.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 mr-2" />
                  <div>
                    <h3 className="font-bold">24/7 Support</h3>
                    <p className="text-sm text-muted-foreground">Our customer support team is available 24/7.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 mr-2" />
                  <div>
                    <h3 className="font-bold">Guranteed Discount</h3>
                    <p className="text-sm text-muted-foreground">Get discount on every bill payment.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 mr-2" />
                  <div>
                    <h3 className="font-bold">No Credit/Debit Card Required</h3>
                    <p className="text-sm text-muted-foreground">We accept all major payment methods.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Need Help?</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-primary" />
                  <span>Having trouble with your payment?</span>
                </div>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/contact">Contact Support</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

