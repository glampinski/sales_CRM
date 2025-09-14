"use client"

import { useAuth } from '@/contexts/AuthContext'
import { LoginForm } from '@/components/auth/LoginForm'
import { ReferralTracker } from '@/components/referral-tracker'
import { Suspense } from 'react'

export default function HomePage() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <ReferralTracker>
          <LoginForm />
        </ReferralTracker>
      </Suspense>
    )
  }

  // Redirect based on user role
  if (typeof window !== 'undefined') {
    switch (user.role) {
      case 'customer':
        window.location.href = '/onboarding'
        break
      default:
        window.location.href = '/dashboard'
        break
    }
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ReferralTracker>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </ReferralTracker>
    </Suspense>
  )
}
