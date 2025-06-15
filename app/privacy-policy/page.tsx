"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
      
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>1. Information We Collect</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>GoComfortUSA collects the following types of information:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Personal Information:
                <ul className="list-disc pl-6 mt-2">
                  <li>Name and contact details</li>
                  <li>Email address</li>
                  <li>Phone number</li>
                  <li>Billing and shipping addresses</li>
                  <li>Payment information</li>
                </ul>
              </li>
              <li>Travel Information:
                <ul className="list-disc pl-6 mt-2">
                  <li>Passport details (for international travel)</li>
                  <li>Travel preferences</li>
                  <li>Booking history</li>
                </ul>
              </li>
              <li>Technical Information:
                <ul className="list-disc pl-6 mt-2">
                  <li>IP address</li>
                  <li>Browser type</li>
                  <li>Device information</li>
                  <li>Usage data</li>
                </ul>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2. How We Use Your Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>We use your information to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Process your bookings and payments</li>
              <li>Communicate about your reservations</li>
              <li>Send booking confirmations and updates</li>
              <li>Provide customer support</li>
              <li>Send marketing communications (with your consent)</li>
              <li>Improve our services and website</li>
              <li>Prevent fraud and ensure security</li>
              <li>Comply with legal obligations</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>3. Data Sharing with Third Parties</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>We share your information with:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Travel service providers (airlines, hotels, etc.)</li>
              <li>Payment processors</li>
              <li>Analytics providers</li>
              <li>Customer service platforms</li>
              <li>Legal authorities when required by law</li>
            </ul>
            <p>We ensure all third parties maintain appropriate security measures and comply with data protection laws.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>4. Cookies and Analytics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>We use cookies and similar technologies to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Remember your preferences</li>
              <li>Analyze website usage</li>
              <li>Improve user experience</li>
              <li>Provide personalized content</li>
              <li>Track marketing campaign performance</li>
            </ul>
            <p>You can control cookie settings through your browser preferences.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>5. Your Rights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request data deletion</li>
              <li>Object to data processing</li>
              <li>Data portability</li>
              <li>Withdraw consent</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>6. Data Security</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>We implement various security measures to protect your data:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>SSL encryption for data transmission</li>
              <li>Secure data storage</li>
              <li>Regular security audits</li>
              <li>Access controls and authentication</li>
              <li>Employee training on data protection</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>7. Data Retention</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>We retain your data for:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>As long as necessary to provide our services</li>
              <li>To comply with legal obligations</li>
              <li>To resolve disputes</li>
              <li>To enforce our agreements</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>8. Children's Privacy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Our services are not intended for children under 13. We do not knowingly collect personal information from children under 13.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>9. Changes to Privacy Policy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>10. Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>For any privacy-related questions or concerns, please contact us at:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Email: privacy@gocomfortusa.com</li>
              <li>Phone: +1 437 849 7841</li>
              <li>Address: [Your Company Address]</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 