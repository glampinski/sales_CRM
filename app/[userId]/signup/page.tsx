import { Suspense } from "react"
import { ReferralTracker } from "@/components/referral-tracker"
import { SignupForm } from "@/components/signup-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, User } from "lucide-react"

interface ReferralSignupPageProps {
  params: {
    userId: string
  }
}

export default function ReferralSignupPage({ params }: ReferralSignupPageProps) {
  const { userId } = params;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ReferralTracker userId={userId}>
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-2xl mx-auto space-y-6 p-4">
            
            {/* Referral Info Banner */}
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-blue-900">Referred by: {userId}</p>
                      <p className="text-sm text-blue-700">Complete your registration to get started</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    Referral Active
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Selection Summary (if available in localStorage) */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Your Timeshare Selection
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div id="selection-summary" className="text-sm text-muted-foreground">
                  Your selected timeshare option will appear here after making your choice.
                </div>
              </CardContent>
            </Card>

            {/* Signup Form */}
            <Card>
              <CardHeader>
                <CardTitle>Complete Your Registration</CardTitle>
              </CardHeader>
              <CardContent>
                <SignupForm referralUserId={userId} />
              </CardContent>
            </Card>
          </div>
        </div>
      </ReferralTracker>
    </Suspense>
  )
}
