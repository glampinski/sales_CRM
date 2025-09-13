"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Download, Mail, Calendar, Building2, Crown } from "lucide-react"
import type { OnboardingData } from "./onboarding-flow"

interface ConfirmationStepProps {
  data: OnboardingData
}

const shareOptions = {
  full: { name: "Full Share", price: 50000, days: "365 days/year" },
  half: { name: "1/2 Share", price: 25000, days: "182 days/year" },
  quarter: { name: "1/4 Share", price: 12500, days: "91 days/year" },
  eighth: { name: "1/8 Share", price: 6250, days: "45 days/year" },
}

export function ConfirmationStep({ data }: ConfirmationStepProps) {
  const shareInfo = data.shareLevel ? shareOptions[data.shareLevel] : null
  const basePrice = shareInfo?.price || 0
  const vipPrice = data.vipPresale ? 5000 : 0
  const totalPrice = basePrice + vipPrice

  const orderNumber = `TS-${Date.now().toString().slice(-8)}`

  return (
    <div className="space-y-6">
      {/* Success Header */}
      <div className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
          <CheckCircle className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-primary mb-2">{"Congratulations!"}</h2>
          <p className="text-lg text-muted-foreground">{"Your Tiny Share purchase has been submitted successfully"}</p>
        </div>
      </div>

      {/* Order Details */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Order Summary
          </CardTitle>
          <CardDescription>Order #{orderNumber}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold mb-1">Ownership Level</h4>
                <p className="text-muted-foreground">
                  {shareInfo?.name} - {shareInfo?.days}
                </p>
              </div>
              {data.vipPresale && (
                <div>
                  <h4 className="font-semibold mb-1 flex items-center gap-2">
                    VIP Presale
                    <Crown className="h-4 w-4 text-accent" />
                  </h4>
                  <p className="text-muted-foreground">{"Exclusive deals and premium perks included"}</p>
                </div>
              )}
              <div>
                <h4 className="font-semibold mb-1">Payment Method</h4>
                <p className="text-muted-foreground">
                  {data.paymentMethod === "bank" ? "Bank Transfer" : "Cryptocurrency"}
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold mb-1">Total Purchase</h4>
                <p className="text-2xl font-bold text-primary">€{totalPrice.toLocaleString()}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Status</h4>
                <Badge className="bg-primary text-primary-foreground">Payment Pending</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle>What Happens Next?</CardTitle>
          <CardDescription>{"Here's what you can expect in the coming days"}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-sm font-bold text-primary">1</span>
              </div>
              <div>
                <h4 className="font-semibold">Payment Processing</h4>
                <p className="text-sm text-muted-foreground">
                  {"We'll process your payment within 1-3 business days and send you a confirmation email."}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-sm font-bold text-primary">2</span>
              </div>
              <div>
                <h4 className="font-semibold">Document Finalization</h4>
                <p className="text-sm text-muted-foreground">
                  {"Your signed documents will be processed and you'll receive final ownership certificates."}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-sm font-bold text-primary">3</span>
              </div>
              <div>
                <h4 className="font-semibold">Access Granted</h4>
                <p className="text-sm text-muted-foreground">
                  {"You'll receive login credentials for the booking system and can start planning your stays."}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Need Help?</CardTitle>
          <CardDescription>{"Our support team is here to assist you"}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium">Email Support</p>
              <p className="text-sm text-muted-foreground">support@tinyshare.com</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium">Business Hours</p>
              <p className="text-sm text-muted-foreground">Monday - Friday, 9:00 AM - 6:00 PM CET</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button variant="outline" className="flex items-center gap-2 bg-transparent">
          <Download className="h-4 w-4" />
          Download Receipt
        </Button>
        <Button variant="outline" className="flex items-center gap-2 bg-transparent">
          <Mail className="h-4 w-4" />
          Email Confirmation
        </Button>
      </div>
    </div>
  )
}
