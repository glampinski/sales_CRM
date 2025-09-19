import { Suspense } from "react"
import { ReferralTracker } from "@/components/referral-tracker"
import { OnboardingFlow } from "@/components/onboarding-flow"
import { redirect } from 'next/navigation'

interface ReferralPageProps {
  params: {
    userId: string
  }
}

export default function ReferralPage({ params }: ReferralPageProps) {
  const { userId } = params;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ReferralTracker userId={userId}>
        <div className="min-h-screen bg-gray-50">
          <div className="pt-8 pb-4 text-center">
            <div className="max-w-md mx-auto p-3 bg-blue-50 rounded-lg mb-6">
              <p className="text-sm text-blue-700">
                Welcome! You've been referred by: <span className="font-mono font-bold">{userId}</span>
              </p>
              <p className="text-xs text-blue-600 mt-1">
                Choose your timeshare option to get started
              </p>
            </div>
          </div>
          <OnboardingFlow isReferralFlow={true} referralUserId={userId} />
        </div>
      </ReferralTracker>
    </Suspense>
  )
}
