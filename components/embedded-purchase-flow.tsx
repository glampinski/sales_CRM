"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, FileText, CreditCard, Shield, Building2, ShoppingCart, ArrowLeft } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ShareSelection } from "./share-selection"
import { DocumentHandling } from "./document-handling"
import { PaymentStep } from "./payment-step"
import { ConfirmationStep } from "./confirmation-step"
import type { OnboardingData, ShareLevel } from "./onboarding-flow"

interface Customer {
  id: string | number
  name: string
  email: string
  phone: string
  avatar?: string
  tier: "standard" | "vip" | "premium" | "VIP" | "Gold" | "Standard"
  totalOrders: number
  totalSpent: number
}

interface EmbeddedPurchaseFlowProps {
  customer?: Customer
  selectedShareLevel?: ShareLevel
  onComplete?: (orderData: OnboardingData & { customerId?: string }) => void
  onCancel?: () => void
}

const steps = [
  { id: 1, name: "Products", icon: ShoppingCart },
  { id: 2, name: "Documents", icon: FileText },
  { id: 3, name: "Upload", icon: CheckCircle },
  { id: 4, name: "Payment", icon: CreditCard },
  { id: 5, name: "Confirmation", icon: Shield },
]

export function EmbeddedPurchaseFlow({ 
  customer, 
  selectedShareLevel, 
  onComplete, 
  onCancel 
}: EmbeddedPurchaseFlowProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [currentStep, setCurrentStep] = useState(1)
  
  // Initialize with selected share level if provided
  const [data, setData] = useState<OnboardingData>({
    shareLevel: selectedShareLevel || null,
    vipPresale: customer?.tier === "vip" || customer?.tier === "premium" || customer?.tier === "VIP",
    documentsRead: [],
    documentsUploaded: [],
    paymentMethod: null,
    completed: false,
  })

  // If share level is pre-selected, start at step 2
  useEffect(() => {
    if (selectedShareLevel) {
      setCurrentStep(2)
    }
  }, [selectedShareLevel])

  const updateData = (updates: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...updates }))
  }

  const nextStep = () => {
    if (currentStep < 5) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1)
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

  const handleComplete = () => {
    if (onComplete) {
      onComplete({
        ...data,
        customerId: customer?.id?.toString(),
        completed: true
      })
    } else {
      // Default: redirect to success page or dashboard
      router.push('/dashboard?purchase=success')
    }
  }

  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    } else {
      // Default: go back to catalog or dashboard
      router.push('/catalog')
    }
  }

  const handleBack = () => {
    if (currentStep === 1) {
      // If we're on first step, go back to catalog
      router.push('/catalog')
    } else {
      prevStep()
    }
  }

  useEffect(() => {
    if (currentStep === 5 && data.completed) {
      handleComplete()
    }
  }, [currentStep, data.completed])

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header with Customer Info */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              
              {customer ? (
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={customer.avatar} alt={customer.name} />
                    <AvatarFallback>{customer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h1 className="text-2xl font-bold text-foreground">New Purchase Order</h1>
                    <p className="text-muted-foreground">
                      Customer: {customer.name} • {customer.email}
                      <Badge variant="secondary" className="ml-2">
                        {customer.tier.toUpperCase()}
                      </Badge>
                    </p>
                  </div>
                </div>
              ) : (
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Complete Your Purchase</h1>
                  <p className="text-muted-foreground">
                    Complete your timeshare purchase in just a few steps
                  </p>
                </div>
              )}
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          </div>

          {/* Customer Summary for existing customers */}
          {customer && (
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{customer.totalOrders}</div>
                    <div className="text-sm text-muted-foreground">Total Orders</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">€{customer.totalSpent.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Total Spent</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{customer.tier}</div>
                    <div className="text-sm text-muted-foreground">Customer Tier</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">Active</div>
                    <div className="text-sm text-muted-foreground">Status</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
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
                    w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-colors cursor-pointer
                    ${
                      isCompleted
                        ? "bg-primary text-primary-foreground"
                        : isActive
                          ? "bg-primary text-primary-foreground"
                          : canAccess
                            ? "bg-muted text-muted-foreground hover:bg-muted/80"
                            : "bg-muted/50 text-muted-foreground/50"
                    }
                  `}
                    onClick={() => canAccess && setCurrentStep(step.id)}
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
          <Card>
            <CardContent className="p-6">
              {currentStep === 1 && (
                <div>
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">Select Your Timeshare</h2>
                    <p className="text-muted-foreground">Choose the timeshare option that best fits your needs</p>
                  </div>
                  <ShareSelection 
                    data={data} 
                    updateData={updateData} 
                    onNext={nextStep} 
                    canProceed={canProceedToStep(2)} 
                  />
                </div>
              )}

              {currentStep === 2 && (
                <div>
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">Review Documents</h2>
                    <p className="text-muted-foreground">Please review all required documents before proceeding</p>
                  </div>
                  <DocumentHandling 
                    data={data} 
                    updateData={updateData} 
                    onNext={nextStep} 
                    canProceed={canProceedToStep(3)} 
                  />
                  <div className="flex gap-2 mt-6">
                    <Button variant="outline" onClick={prevStep}>
                      Back
                    </Button>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div>
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">Upload Documents</h2>
                    <p className="text-muted-foreground">Upload the required documents to complete your application</p>
                  </div>
                  <DocumentHandling
                    data={data}
                    updateData={updateData}
                    onNext={nextStep}
                    canProceed={canProceedToStep(4)}
                    uploadMode={true}
                  />
                  <div className="flex gap-2 mt-6">
                    <Button variant="outline" onClick={prevStep}>
                      Back
                    </Button>
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div>
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">Payment Processing</h2>
                    <p className="text-muted-foreground">Complete your payment to finalize the purchase</p>
                  </div>
                  <PaymentStep 
                    data={data} 
                    updateData={updateData} 
                    onNext={nextStep} 
                    canProceed={canProceedToStep(5)} 
                  />
                  <div className="flex gap-2 mt-6">
                    <Button variant="outline" onClick={prevStep}>
                      Back
                    </Button>
                  </div>
                </div>
              )}

              {currentStep === 5 && (
                <div>
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">Order Confirmation</h2>
                    <p className="text-muted-foreground">Review and confirm your purchase details</p>
                  </div>
                  <ConfirmationStep data={data} />
                  <div className="flex gap-2 mt-6">
                    <Button variant="outline" onClick={prevStep}>
                      Back
                    </Button>
                    <Button onClick={handleComplete} className="ml-auto">
                      Complete Purchase
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
