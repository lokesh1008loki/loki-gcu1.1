"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TermsOfService() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
      
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>1. Acceptance of Terms</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>By accessing and using GoComfortUSA's website and services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.</p>
            <p>GoComfortUSA reserves the right to modify these terms at any time. Continued use of our services after such modifications constitutes acceptance of the updated terms.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2. Eligibility</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>To use GoComfortUSA's services, you must:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Be at least 18 years of age</li>
              <li>Have the legal capacity to enter into binding contracts</li>
              <li>Reside in the United States</li>
              <li>Provide accurate and complete information when using our services</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>3. Services Provided</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>GoComfortUSA is a professional travel assistance and consultation platform. Our services include:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Personalized travel research and route optimization</li>
              <li>Flight and accommodation recommendations</li>
              <li>Theme park and attraction planning assistance</li>
              <li>Booking guidance and technical support</li>
              <li>IKEA procurement research and logistics planning</li>
            </ul>
            <p className="font-bold text-primary mt-4 italic">
              Important Disclosure: GoComfortUSA is a consultation platform and does not directly sell airline tickets, hotel rooms, or third-party services. All final bookings are made through official providers in the customer's name.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>4. User Responsibilities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Users are responsible for:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Providing accurate and complete information</li>
              <li>Maintaining the security of their account</li>
              <li>Complying with all applicable laws and regulations</li>
              <li>Using the services in accordance with these terms</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>5. Consultation Fees & Payments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Our fee structure and payment terms:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Consultation fees are charged for professional research and planning services rendered.</li>
              <li>The standard travel consultation fee starts at $29 per request.</li>
              <li>All fees must be paid in full at the time of the consultation request.</li>
              <li>Prices for specialized research (e.g., IKEA or multi-city routes) may vary.</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>6. Cancellations and Refunds</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Policy regarding service fees:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Consultation fees are for services rendered (expert research) and are generally non-refundable once the research process has commenced.</li>
              <li>If you wish to cancel a request before any work has started, please contact us immediately.</li>
              <li>Cancellations or changes to final travel bookings (flights/hotels) are governed by the terms of the respective third-party provider.</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>7. Intellectual Property</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>All content on this website is the property of GoComfortUSA and is protected by intellectual property laws. Users may not:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Copy or reproduce any content without permission</li>
              <li>Use the content for commercial purposes</li>
              <li>Modify or create derivative works</li>
              <li>Remove any copyright or proprietary notices</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>8. Limitation of Liability</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>GoComfortUSA acts solely as a travel consultant. We are not liable for:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Decisions, cancellations, or service failures of third-party providers (airlines, hotels, etc.).</li>
              <li>Accuracy of information provided by third parties (e.g., flight schedules, availability).</li>
              <li>Any financial loss or damages resulting from travel bookings made based on our recommendations.</li>
              <li>Indirect, incidental, or consequential damages.</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>9. Dispute Resolution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Any disputes shall be resolved through:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Good-faith negotiations</li>
              <li>Mediation if necessary</li>
              <li>Arbitration as a last resort</li>
              <li>Applicable laws of the United States</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>10. Governing Law</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>These terms are governed by the laws of the United States. Any legal proceedings shall be brought in the appropriate courts of the United States.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>11. Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>For any questions regarding these terms, please contact us at:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Email: support@gocomfortusa.com</li>
              <li>Phone: +1(210) 418-2745</li>
              <li>Address: 30 N Gould St Ste R, Sheridan, WY 82801, USA</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 