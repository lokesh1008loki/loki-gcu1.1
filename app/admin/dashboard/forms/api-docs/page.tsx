import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ApiDocsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Form Submission API Documentation</h1>
        <p className="text-muted-foreground">
          Learn how to use the GocomfortUSA Form Submission API to collect and store form data in Google Sheets.
        </p>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
          <TabsTrigger value="examples">Examples</TabsTrigger>
          <TabsTrigger value="errors">Error Handling</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>API Overview</CardTitle>
              <CardDescription>
                The Form Submission API allows you to collect form data from your website and store it directly in
                Google Sheets.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Key Features</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Submit form data directly to Google Sheets</li>
                  <li>Automatic validation of required fields</li>
                  <li>Phone number validation for all submissions</li>
                  <li>Configurable form fields and sheet destinations</li>
                  <li>Backup storage in database</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Requirements</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>
                    <strong>Form ID</strong>: Each form must have a unique ID configured in the admin panel
                  </li>
                  <li>
                    <strong>Phone Number</strong>: All form submissions must include a valid phone number
                  </li>
                  <li>
                    <strong>Google Sheets Integration</strong>: Must be configured in the admin panel
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="endpoints" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>API Endpoints</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">POST /api/form-submission</h3>
                <p className="mb-4">Submit form data to be stored in Google Sheets.</p>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium">Request Body</h4>
                    <pre className="bg-muted p-4 rounded-md overflow-x-auto mt-2">
                      {`{
  "formId": "form-config-id",  // Required: The ID of the form configuration
  "formData": {                // Required: The form data to be submitted
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",    // Required: Valid phone number
    "message": "Hello world",
    // ... other form fields
  }
}`}
                    </pre>
                  </div>

                  <div>
                    <h4 className="font-medium">Successful Response (200 OK)</h4>
                    <pre className="bg-muted p-4 rounded-md overflow-x-auto mt-2">
                      {`{
  "success": true,
  "message": "Form data successfully submitted",
  "updatedCells": 10  // Number of cells updated in Google Sheets
}`}
                    </pre>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="examples" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Code Examples</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">JavaScript/Fetch Example</h3>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                  {`// Example using fetch API
async function submitForm(formData) {
  try {
    const response = await fetch('/api/form-submission', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        formId: 'your-form-id',
        formData: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,  // Required
          message: formData.message,
          // ... other form fields
        },
      }),
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('Form submitted successfully:', data);
      return data;
    } else {
      console.error('Form submission failed:', data);
      throw new Error(data.message || 'Form submission failed');
    }
  } catch (error) {
    console.error('Error submitting form:', error);
    throw error;
  }
}`}
                </pre>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">React Component Example</h3>
                <p className="mb-2">
                  Use our pre-built <code>FormWithSheets</code> component for easy integration:
                </p>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                  {`import FormWithSheets from '@/components/form-with-sheets';

export default function ContactPage() {
  const formFields = [
    {
      name: 'name',
      label: 'Full Name',
      type: 'text',
      required: true,
      placeholder: 'Enter your full name'
    },
    {
      name: 'email',
      label: 'Email Address',
      type: 'email',
      required: true,
      placeholder: 'Enter your email address'
    },
    {
      name: 'phone',
      label: 'Phone Number',
      type: 'tel',
      required: true,
      placeholder: 'Enter your phone number'
    },
    {
      name: 'message',
      label: 'Message',
      type: 'textarea',
      required: true,
      placeholder: 'Enter your message'
    }
  ];

  return (
    <div className="container mx-auto py-12">
      <FormWithSheets
        formId="contact-form-id"
        title="Contact Us"
        description="Fill out the form below to get in touch with our team."
        fields={formFields}
        submitButtonText="Send Message"
      />
    </div>
  );
}`}
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="errors" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Error Handling</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Common Error Responses</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium">Missing Required Fields (400 Bad Request)</h4>
                      <pre className="bg-muted p-4 rounded-md overflow-x-auto mt-2">
                        {`{
  "success": false,
  "message": "Missing required fields"
}`}
                      </pre>
                    </div>

                    <div>
                      <h4 className="font-medium">Missing Phone Number (400 Bad Request)</h4>
                      <pre className="bg-muted p-4 rounded-md overflow-x-auto mt-2">
                        {`{
  "success": false,
  "message": "Phone number is required for all form submissions"
}`}
                      </pre>
                    </div>

                    <div>
                      <h4 className="font-medium">Form Configuration Not Found (404 Not Found)</h4>
                      <pre className="bg-muted p-4 rounded-md overflow-x-auto mt-2">
                        {`{
  "success": false,
  "message": "Form configuration not found"
}`}
                      </pre>
                    </div>

                    <div>
                      <h4 className="font-medium">Server Error (500 Internal Server Error)</h4>
                      <pre className="bg-muted p-4 rounded-md overflow-x-auto mt-2">
                        {`{
  "success": false,
  "message": "Failed to submit form data",
  "error": "Error details..."
}`}
                      </pre>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Error Handling Best Practices</h3>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>
                      Always check the <code>success</code> property in the response
                    </li>
                    <li>
                      Display user-friendly error messages based on the <code>message</code> property
                    </li>
                    <li>Implement client-side validation to reduce API errors</li>
                    <li>Log detailed error information for debugging</li>
                    <li>Implement retry logic for network errors</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
