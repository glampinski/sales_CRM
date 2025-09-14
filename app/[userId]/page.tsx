import { Suspense } from "react"
import { ReferralTracker } from "@/components/referral-tracker"
import { LoginForm } from "@/components/auth/LoginForm"
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
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full space-y-8 p-8">
            <div className="text-center">
              <h2 className="mt-6 text-3xl font-bold text-gray-900">
                Welcome to Glampinski
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                You've been referred by one of our valued partners
              </p>
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">
                  Referral ID: <span className="font-mono font-bold">{userId}</span>
                </p>
              </div>
            </div>
            <LoginForm />
          </div>
        </div>
      </ReferralTracker>
    </Suspense>
  )
}
