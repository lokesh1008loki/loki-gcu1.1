"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import Link from "next/link"

interface LegalCheckboxesProps {
  termsName?: string
  privacyName?: string
  termsRequired?: boolean
  privacyRequired?: boolean
}

export function LegalCheckboxes({
  termsName = "terms",
  privacyName = "privacy",
  termsRequired = true,
  privacyRequired = true
}: LegalCheckboxesProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-start space-x-2">
        <Checkbox
          id={termsName}
          name={termsName}
          required={termsRequired}
        />
        <Label htmlFor={termsName} className="text-sm">
          I accept the{" "}
          <Link href="/terms-of-service" className="text-primary hover:underline">
            Terms & Conditions
          </Link>
          {termsRequired && " *"}
        </Label>
      </div>
      <div className="flex items-start space-x-2">
        <Checkbox
          id={privacyName}
          name={privacyName}
          required={privacyRequired}
        />
        <Label htmlFor={privacyName} className="text-sm">
          I agree to the{" "}
          <Link href="/privacy-policy" className="text-primary hover:underline">
            Privacy Policy
          </Link>
          {privacyRequired && " *"}
        </Label>
      </div>
    </div>
  )
} 