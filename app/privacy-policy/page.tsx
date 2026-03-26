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
            <p>GoComfortUSA collects the following types of information to provide personalized consultation services:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Personal Contact Information: Name, email address, phone number, and billing details.</li>
              <li>Travel & Consultation Data: Preferred destinations, travel dates, passenger counts, and specific requirements for flights or accommodations.</li>
              <li>Technical Usage Data: IP address, browser type, and device information to optimize your experience on our platform.</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2. How We Use Your Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>We use your information to provide premium travel assistance:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Perform expert research and provide optimized travel recommendations.</li>
              <li>Communicate with you regarding your consultation requests.</li>
              <li>Deliver your personalized research reports via secure channels.</li>
              <li>Improve our research algorithms and service quality.</li>
              <li>Ensure the security of our platform and prevent fraudulent requests.</li>
              <li>Comply with applicable legal and financial regulations.</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>3. Information Sharing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>We handle your data with the highest level of confidentiality:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>We do not sell your personal data to third parties.</li>
              <li>Information is shared with payment processors only to complete consultation fee transactions.</li>
              <li>We may share anonymized travel requirements with verified service providers ONLY for the purpose of research and route optimization.</li>
              <li>We may disclose information to legal authorities if required by U.S. law.</li>
            </ul>
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