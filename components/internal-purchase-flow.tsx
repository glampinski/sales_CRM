"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, FileText, CreditCard, Shield, Building2, User } from "lucide-react"
import { ShareSelection } from "./share-selection"
import { DocumentHandling } from "./document-handling"
import { PaymentStep } from "./payment-step"
import { ConfirmationStep } from "./confirmation-step"

export type ShareLevel = "full" | "half" | "quarter" | "eighth"

export interface PurchaseData {
  shareLevel: ShareLevel | null
  vipPresale: boolean
  documentsRead: string[]
  documentsUploaded: string[]
  paymentMethod: "bank" | "crypto" | null
  completed: boolean
  userInfo?: any
}

interface InternalPurchaseFlowProps {
  isReferralFlow?: boolean
  referralUserId?: string
}

const steps = [
  { id: 1, name: "Choose", icon: Building2 },
  { id: 3, name: "Docs", icon: FileText },
  { id: 4, name: "Upload", icon: CheckCircle },
  { id: 5, name: "Payment", icon: CreditCard },
  { id: 6, name: "Confirmation", icon: Shield },
]

export function InternalPurchaseFlow({ isReferralFlow = false, referralUserId }: InternalPurchaseFlowProps) {
  const { user } = useAuth()
  const searchParams = useSearchParams()
  const startStep = searchParams.get('step') ? parseInt(searchParams.get('step')!) : 1
  const [currentStep, setCurrentStep] = useState(startStep)
  const router = useRouter()
  const [data, setData] = useState<PurchaseData>({
    shareLevel: null,
    vipPresale: false,
    documentsRead: [],
    documentsUploaded: [],
    paymentMethod: null,
    completed: false,
    userInfo: user, // Pre-fill with existing user data
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
    
    // Pre-fill user data for existing customers
    if (user) {
      setData(prev => ({ ...prev, userInfo: user }))
    }
  }, [startStep, searchParams, user])

  const updateData = (updates: Partial<PurchaseData>) => {
    setData((prev) => ({ ...prev, ...updates }))
  }

  const nextStep = () => {
    // Skip step 2 (signup) for internal customers
    if (currentStep === 1) {
      setCurrentStep(3) // Jump from Choose to Docs
    } else if (currentStep < 6) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const canProceedToStep = (step: number): boolean => {
    switch (step) {
      case 3:
        return data.shareLevel !== null // Can proceed to docs if share level selected
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
    // Calculate progress based on 5 steps instead of 6
    const stepMapping = { 1: 1, 3: 2, 4: 3, 5: 4, 6: 5 }
    const progressStep = stepMapping[currentStep as keyof typeof stepMapping] || 1
    return ((progressStep - 1) / 4) * 100
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="border-b pb-6">
        <h1 className="text-3xl font-bold tracking-tight">Complete Your Purchase</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.name || 'valued customer'}! Complete your timeshare purchase below.
        </p>
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
                  <step.icon className="h-6 w-6" />
                </div>
                <span
                  className={`text-sm font-medium ${
                    isActive ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {step.name}
                </span>
                {index < steps.length - 1 && (
                  <div
                    className={`hidden md:block absolute h-0.5 w-16 mt-6 transition-colors ${
                      isCompleted ? "bg-primary" : "bg-muted"
                    }`}
                    style={{ left: "calc(50% + 3rem)" }}
                  />
                )}
              </div>
            )
          })}
        </div>
        <Progress value={getStepProgress()} className="w-full" />
      </div>

      {/* Step Content */}
      <div className="max-w-4xl mx-auto">
        {currentStep === 1 && (
          <ShareSelection
            data={data}
            updateData={updateData}
            onNext={nextStep}
            canProceed={canProceedToStep(3)}
            isReferralFlow={isReferralFlow}
          />
        )}

        {currentStep === 3 && (
          <DocumentHandling
            data={data}
            updateData={updateData}
            onNext={nextStep}
            canProceed={canProceedToStep(4)}
          />
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
          <PaymentStep
            data={data}
            updateData={updateData}
            onNext={nextStep}
            canProceed={canProceedToStep(6)}
          />
        )}

        {currentStep === 6 && (
          <ConfirmationStep
            data={data}
          />
        )}
      </div>
    </div>
  )
}
