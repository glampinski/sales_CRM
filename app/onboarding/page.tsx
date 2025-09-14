import { OnboardingFlow } from "@/components/onboarding-flow"
import { ReferralTracker } from "@/components/referral-tracker"
import { Suspense } from "react"

export default function OnboardingPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ReferralTracker>
        <OnboardingFlow />
      </ReferralTracker>
    </Suspense>
  )
}
