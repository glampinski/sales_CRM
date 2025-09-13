"use client"

import { useState } from "react"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, FileText, CreditCard, Shield, Building2 } from "lucide-react"
import { ShareSelection } from "./share-selection"
import { DocumentHandling } from "./document-handling"
import { PaymentStep } from "./payment-step"
import { ConfirmationStep } from "./confirmation-step"
import Image from "next/image"

export type ShareLevel = "full" | "half" | "quarter" | "eighth"

export interface OnboardingData {
  shareLevel: ShareLevel | null
  vipPresale: boolean
  documentsRead: string[]
  documentsUploaded: string[]
  paymentMethod: "bank" | "crypto" | null
  completed: boolean
}

const steps = [
  { id: 1, name: "Choose", icon: Building2 },
  { id: 2, name: "Docs", icon: FileText },
  { id: 3, name: "Upload", icon: CheckCircle },
  { id: 4, name: "Payment", icon: CreditCard },
  { id: 5, name: "Confirmation", icon: Shield },
]

export function OnboardingFlow() {
  const [currentStep, setCurrentStep] = useState(1)
  const [data, setData] = useState<OnboardingData>({
    shareLevel: null,
    vipPresale: false,
    documentsRead: [],
    documentsUploaded: [],
    paymentMethod: null,
    completed: false,
  })

  const updateData = (updates: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...updates }))
  }

  const nextStep = () => {
    if (currentStep < 5) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const canProceedToStep = (step: number): boolean => {
    switch (step) {
      case 2:
        return data.shareLevel !== null
      case 3:
        return data.documentsRead.length === 5
      case 4:
        return data.documentsUploaded.length === 5
      case 5:
        return data.paymentMethod !== null
      default:
        return true
    }
  }

  const getStepProgress = () => {
    return ((currentStep - 1) / 4) * 100
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
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
            <ShareSelection data={data} updateData={updateData} onNext={nextStep} canProceed={canProceedToStep(2)} />
          )}

          {currentStep === 2 && (
            <DocumentHandling data={data} updateData={updateData} onNext={nextStep} canProceed={canProceedToStep(3)} />
          )}

          {currentStep === 3 && (
            <DocumentHandling
              data={data}
              updateData={updateData}
              onNext={nextStep}
              canProceed={canProceedToStep(4)}
              uploadMode={true}
            />
          )}

          {currentStep === 4 && (
            <PaymentStep data={data} updateData={updateData} onNext={nextStep} canProceed={canProceedToStep(5)} />
          )}

          {currentStep === 5 && <ConfirmationStep data={data} />}
        </div>
      </div>
    </div>
  )
}
