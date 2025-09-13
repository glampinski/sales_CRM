"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { OnboardingFlow } from "@/components/onboarding-flow"

export default function HomePage() {
  const router = useRouter()

  // For now, let's show both options
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center space-y-6">
          <h1 className="text-4xl font-bold">MLM CRM System</h1>
          <p className="text-lg text-muted-foreground">Choose your entry point:</p>
          
          <div className="flex justify-center space-x-4">
            <button 
              onClick={() => router.push('/dashboard')}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Go to Dashboard
            </button>
            <button 
              onClick={() => {/* Show onboarding below */}}
              className="px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors"
            >
              Customer Onboarding
            </button>
          </div>
        </div>
        
        <div className="mt-12">
          <OnboardingFlow />
        </div>
      </div>
    </div>
  )
}
