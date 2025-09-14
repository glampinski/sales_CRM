import { Suspense } from "react"
import { ReferralTracker } from "@/components/referral-tracker"
import { SignupForm } from "@/components/signup-form"

export default function SignupPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ReferralTracker>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full space-y-8 p-8">
            <div className="text-center">
              <h2 className="mt-6 text-3xl font-bold text-gray-900">
                Join Our Network
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Start your journey with us today
              </p>
            </div>
            <SignupForm />
          </div>
        </div>
      </ReferralTracker>
    </Suspense>
  )
}
