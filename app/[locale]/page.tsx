"use client"

import { useAuth } from '@/contexts/AuthContext'
import { LoginForm } from '@/components/auth/LoginForm'
import { ReferralTracker } from '@/components/referral-tracker'
import { Suspense, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'

export default function HomePage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const locale = params.locale as string

  useEffect(() => {
    // Redirect based on user role with proper locale
    if (user && !isLoading) {
      switch (user.role) {
        case 'customer':
          router.replace(`/${locale}/onboarding`)
          break
        default:
          router.replace(`/${locale}/dashboard`)
          break
      }
    }
  }, [user, isLoading, router, locale])

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

  // Show loading while redirecting
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
