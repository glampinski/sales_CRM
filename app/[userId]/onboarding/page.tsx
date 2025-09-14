import { Suspense } from "react"
import { ReferralTracker } from "@/components/referral-tracker"
import { OnboardingFlow } from "@/components/onboarding-flow"

interface ReferralOnboardingPageProps {
  params: {
    userId: string
  }
}

export default function ReferralOnboardingPage({ params }: ReferralOnboardingPageProps) {
  const { userId } = params;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ReferralTracker userId={userId}>
        <div className="min-h-screen bg-gray-50">
          <div className="pt-8 pb-4 text-center">
            <div className="max-w-md mx-auto p-3 bg-blue-50 rounded-lg mb-6">
              <p className="text-sm text-blue-700">
                Referral ID: <span className="font-mono font-bold">{userId}</span>
              </p>
              <p className="text-xs text-blue-600 mt-1">
                You've been referred by one of our valued partners
              </p>
            </div>
          </div>
          <OnboardingFlow />
        </div>
      </ReferralTracker>
    </Suspense>
  )
}
