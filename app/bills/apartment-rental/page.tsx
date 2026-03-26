"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, MapPin, Clock, Home, Info, CheckCircle, Bed, Bath, XCircle } from "lucide-react"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import BookingForm from "@/components/booking-form"
import { useState } from "react"

const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbx5g-rNOcle7uNQQjYgxLhOIotk8bPz9vFiqid7LILngmXc5W1Ceaovttuo_3qVabcN6Q/exec";

export default function ApartmentRentalPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    rentAddress: "",
    apartmentNumber: "",
    zipCode: "",
    rentAmount: "",
    whatsapp: "",
    consent: false,
    wantsOptimization: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");
    setErrorMessage("");
    
    try {
      const response = await fetch(GOOGLE_SHEET_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        mode: 'no-cors', // This disables CORS restrictions, but limits access to the response
      });
      
      

      setSubmitStatus("success");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        rentAddress: "",
        apartmentNumber: "",
        zipCode: "",
        rentAmount: "",
        whatsapp: "",
        consent: false,
        wantsOptimization: false,
      });
    } catch (error) {
      console.error("Form submission error:", error);
      setSubmitStatus("error");
      setErrorMessage("Submission failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Professional Rent Assistance</h1>
            <p className="text-muted-foreground">
                Expertly manage your house or apartment rent through GoComfort USA with professional research and hassle-free processing.
            </p>
          </div>

          <div className="relative h-[300px] md:h-[400px] rounded-xl overflow-hidden">
            <Image src="/ass/sub_hero.jpg?height=400&width=800" alt="Apartment Rental" fill className="object-cover" />
          </div>

          <Tabs defaultValue="description">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="steps">Steps to pay</TabsTrigger>
              {/*<TabsTrigger value="amenities">Amenities</TabsTrigger>*/}
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="space-y-4 mt-4">
              <h2 className="text-xl font-bold">Expert Rent Optimization for Professionals</h2>
              <p>
                <b>Optimize Your House or Apartment Rent Management.</b>
                <br />
                Living away from home while working hard to build your future requires professional management of your largest expenses. We understand the challenges faced by travel nurses and professionals working far from their families.
                At GoComfort USA, we provide a professional way to manage your house or apartment rent payments through expert research and coordination. Our tailored services are designed to ensure your housing logistics are handled with precision, giving you the freedom to focus on your career without the administrative burden.
                Let us handle the coordination—because you deserve comfort, expert management, and peace of mind.
              </p>
              <p>
              <b>Expert planning for travel nurses and hardworking professionals living away from home.</b>
              <br />
              We help you optimize rent expenses so you can focus on your career and financial goals.
              </p>
              
            </TabsContent>
            
            <TabsContent value="steps" className="space-y-4 mt-4">
            <h2 className="text-xl font-semibold mb-2">Steps to Pay Your Rent Through GoComfort USA</h2>
            <ul className="list-disc pl-5 space-y-2 text-m text-muted-foreground">
                <li><strong>Step 1:</strong> Share your rent portal login or invite us to access your portal (e.g., RentCafe, Buildium, AppFolio).</li>
                <li><strong>Step 2:</strong> Provide your lease details – including rent amount, due date, and property address.(optional)</li>
                <li><strong>Step 3:</strong> Upload or email a recent rent invoice or screenshot from the rent portal.(optional)</li>
                <li><strong>Step 4:</strong> Authorize GoComfort USA to pay on your behalf with a simple consent message or form.</li>
                <li><strong>Step 5:</strong> Sit back! We process your rent payment and send you the confirmation once it's done.</li>
            </ul>

            </TabsContent>
            <TabsContent value="reviews" className="space-y-4 mt-4">
              <h2 className="text-xl font-bold">Customer Reviews</h2>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i}>
                    <CardContent className="p-4">
                      <div className="flex items-center mb-2">
                        <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                          <span className="font-bold text-primary">{["AR", "SM", "RK"][i - 1]}</span>
                        </div>
                        <div>
                          <h4 className="font-bold">{["Anna Reed", "Sarah Miller", "Ujjwal Chardran"][i - 1]}</h4>
                          <div className="text-sm text-muted-foreground">
                            {["Travel Nurse", "Travel Nurse", "Student"][i - 1]}
                            
                           
                          </div>
                          <div className="flex">
                            {Array(5)
                              .fill(0)
                              .map((_, j) => (
                                <svg
                                  key={j}
                                  className={`h-4 w-4 ${j < 5 - (i - 1) ? "text-primary" : "text-muted"}`}
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-muted-foreground">
                        {
                          [
                            "Thanks to GoComfort USA, my apartment rent management is completely handled—the process is professional and seamless!",
                           "As a travel nurse constantly relocating, GoComfort gave me a reliable way to manage rent payments with zero hassle and expert coordination.",
                            "I needed a professional partner for my housing logistics, and GoComfort helped me manage everything directly with my landlord—super smooth experience!",
                          ][i - 1]
                        }
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-bold">Rent Payment Form</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="John"
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Doe"
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Email ID</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your-email@example.com"
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Your Rent Address</label>
                    <input
                      type="text"
                      name="rentAddress"
                      value={formData.rentAddress}
                      onChange={handleChange}
                      placeholder="1234 Elm Street, Apt 56B, Los Angeles, CA 90017"
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Apartment Number</label>
                    <input
                      type="text"
                      name="apartmentNumber"
                      value={formData.apartmentNumber}
                      onChange={handleChange}
                      placeholder="Apt 56B"
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">ZIP Code</label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      placeholder="90017"
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Rent Amount (in USD)</label>
                    <input
                      type="number"
                      name="rentAmount"
                      value={formData.rentAmount}
                      onChange={handleChange}
                      placeholder="Enter amount"
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">WhatsApp or Telegram ID</label>
                    <input
                      type="text"
                      name="whatsapp"
                      value={formData.whatsapp}
                      onChange={handleChange}
                      placeholder="@yourhandle or +1234567890"
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="consent"
                        checked={formData.consent}
                        onChange={(e) => setFormData(prev => ({ ...prev, consent: e.target.checked }))}
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                        required
                      />
                      <span className="text-sm font-medium">I agree to authorize rent payment</span>
                    </label>
                  </div>
                  <div>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="wantsOptimization"
                        checked={formData.wantsOptimization}
                        onChange={(e) => setFormData(prev => ({ ...prev, wantsOptimization: e.target.checked }))}
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      />
                      <span className="text-sm font-medium">I want professional assistance</span>
                    </label>
                  </div>
                </div>

                {submitStatus === "success" && (
                  <div className="p-4 bg-green-50 text-green-800 rounded-md">
                    Form submitted successfully! We'll contact you shortly.
                  </div>
                )}

                {submitStatus === "error" && (
                  <div className="p-4 bg-red-50 text-red-800 rounded-md">
                    {errorMessage}
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full mt-4"
                  disabled={isSubmitting || !formData.consent}
                >
                  {isSubmitting ? "Submitting..." : "Submit Rent Payment Request"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Rental Payment Requirements</h2>
              <div className="space-y-3">
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 mr-2" />
                  <div>
                    <h3 className="font-bold">Valid Address </h3>
                    <p className="text-sm text-muted-foreground">Required to access your rent portal.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <XCircle className="h-5 w-5 text-primary mt-0.5 mr-2" />
                  <div>
                    <h3 className="font-bold">No Credit Card Required</h3>
                    <p className="text-sm text-muted-foreground">Not required for rent payment.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 mr-2" />
                  <div>
                    <h3 className="font-bold">Age Requirement</h3>
                    <p className="text-sm text-muted-foreground">Must be 21 years or older</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 mr-2" />
                  <div>
                    <h3 className="font-bold">WhatsApp or Telegram ID</h3>
                    <p className="text-sm text-muted-foreground">For ASAP communication purposes.</p>
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
                  <Info className="h-5 w-5 text-primary" />
                  <span>Have questions about apartment rentals?</span>
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
