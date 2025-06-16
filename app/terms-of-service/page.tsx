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
            <p>GoComfortUSA provides the following services:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Ticket bookings for various attractions and events</li>
              <li>Bill payment services</li>
              <li>Travel booking services</li>
              <li>Other related services as may be added from time to time</li>
            </ul>
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
            <CardTitle>5. Payment Terms</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Payment terms and conditions:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>All prices are in USD unless otherwise stated</li>
              <li>Payment must be made in full at the time of booking</li>
              <li>We accept various payment methods as indicated during checkout</li>
              <li>Prices are subject to change without notice</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>6. Cancellations and Refunds</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Cancellation and refund policies:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Cancellation policies vary by service provider</li>
              <li>Refunds are subject to the terms of the service provider</li>
              <li>Processing fees may be non-refundable</li>
              <li>Refund processing times may vary</li>
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
            <p>GoComfortUSA is not liable for:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Any indirect, incidental, or consequential damages</li>
              <li>Loss of profits or data</li>
              <li>Service interruptions or errors</li>
              <li>Actions of third-party service providers</li>
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

        {/*<Card>
          <CardHeader>
            <CardTitle>11. Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>For any questions regarding these terms, please contact us at:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Email: support@gocomfortusa.com</li>
              <li>Phone: +1 437 849 7841</li>
              <li>Address: [Your Company Address]</li>
            </ul>
          </CardContent>
        </Card>*/}
      </div>
    </div>
  )
} 