"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, FileText, CreditCard, Shield, Building2, User } from "lucide-react"
import { ShareSelection } from "./share-selection"
import { DocumentHandling } from "./document-handling"
import { PaymentStep } from "./payment-step"
import { ConfirmationStep } from "./confirmation-step"
import { OnboardingSignupStep } from "./onboarding-signup-step"
import { ImpersonationBanner } from "./impersonation-banner"
import Image from "next/image"

export type ShareLevel = "full" | "half" | "quarter" | "eighth"

export interface OnboardingData {
  shareLevel: ShareLevel | null
  vipPresale: boolean
  documentsRead: string[]
  documentsUploaded: string[]
  paymentMethod: "bank" | "crypto" | null
  completed: boolean
  userInfo?: any
}

interface OnboardingFlowProps {
  isReferralFlow?: boolean
  referralUserId?: string
}

const steps = [
  { id: 1, name: "Choose", icon: Building2 },
  { id: 2, name: "Sign Up", icon: User },
  { id: 3, name: "Docs", icon: FileText },
  { id: 4, name: "Upload", icon: CheckCircle },
  { id: 5, name: "Payment", icon: CreditCard },
  { id: 6, name: "Confirmation", icon: Shield },
]

export function OnboardingFlow({ isReferralFlow = false, referralUserId }: OnboardingFlowProps) {
  const searchParams = useSearchParams()
  const startStep = searchParams.get('step') ? parseInt(searchParams.get('step')!) : 1
  const [currentStep, setCurrentStep] = useState(startStep)
  const router = useRouter()
  const [data, setData] = useState<OnboardingData>({
    shareLevel: null,
    vipPresale: false,
    documentsRead: [],
    documentsUploaded: [],
    paymentMethod: null,
    completed: false,
  })

  // If starting from step 3 (docs), prefill share selection
  useEffect(() => {
    if (startStep === 3) {
      // For existing customers jumping to docs, set a default share level
      const selectedShare = searchParams.get('share') as ShareLevel
      if (selectedShare) {
        setData(prev => ({ ...prev, shareLevel: selectedShare }))
      }
    }
  }, [startStep, searchParams])

  const updateData = (updates: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...updates }))
  }

  const nextStep = () => {
    // Normal flow - continue to next step
    if (currentStep < 6) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const canProceedToStep = (step: number): boolean => {
    switch (step) {
      case 2:
        return data.shareLevel !== null
      case 3:
        return true // User is signed up
      case 4:
        return data.documentsRead.length === 5
      case 5:
        return data.documentsUploaded.length === 5
      case 6:
        return data.paymentMethod !== null
      default:
        return true
    }
  }

  const getStepProgress = () => {
    return ((currentStep - 1) / 5) * 100
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <ImpersonationBanner />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-start mb-6">
            <Image src="/images/glampinski-logo.jpg" alt="Glampinski" width={200} height={60} className="h-12 w-auto" />
          </div>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-foreground mb-2">Purchase your glamping retreat</h1>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => {
              const isActive = currentStep === step.id
              const isCompleted = currentStep > step.id
              const canAccess = canProceedToStep(step.id)

              return (
                <div key={step.id} className="flex flex-col items-center">
                  <div
                    className={`
                    w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-colors
                    ${
                      isCompleted
                        ? "bg-primary text-primary-foreground"
                        : isActive
                          ? "bg-primary text-primary-foreground"
                          : canAccess
                            ? "bg-muted text-muted-foreground"
                            : "bg-muted/50 text-muted-foreground/50"
                    }
                  `}
                  >
                    {isCompleted ? <CheckCircle className="h-6 w-6" /> : <step.icon className="h-6 w-6" />}
                  </div>
                  <span className={`text-sm font-medium ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                    {step.name}
                  </span>
                </div>
              )
            })}
          </div>
          <Progress value={getStepProgress()} className="h-2" />
        </div>

        {/* Step Content */}
        <div className="max-w-4xl mx-auto">
          {currentStep === 1 && (
            <ShareSelection 
              data={data} 
              updateData={updateData} 
              onNext={nextStep} 
              canProceed={canProceedToStep(2)} 
              isReferralFlow={isReferralFlow}
            />
          )}

          {currentStep === 2 && (
            <OnboardingSignupStep 
              data={data} 
              updateData={updateData} 
              onNext={nextStep} 
              canProceed={canProceedToStep(3)}
              referralUserId={referralUserId}
            />
          )}

          {currentStep === 3 && (
            <DocumentHandling data={data} updateData={updateData} onNext={nextStep} canProceed={canProceedToStep(4)} />
          )}

          {currentStep === 4 && (
            <DocumentHandling
              data={data}
              updateData={updateData}
              onNext={nextStep}
              canProceed={canProceedToStep(5)}
              uploadMode={true}
            />
          )}

          {currentStep === 5 && (
            <PaymentStep data={data} updateData={updateData} onNext={nextStep} canProceed={canProceedToStep(6)} />
          )}

          {currentStep === 6 && <ConfirmationStep data={data} />}
        </div>
      </div>
    </div>
  )
}
