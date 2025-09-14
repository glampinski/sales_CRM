"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Building2, Crown, Calendar, Wrench, Users } from "lucide-react"
import type { OnboardingData, ShareLevel } from "./onboarding-flow"

interface ShareSelectionProps {
  data: OnboardingData
  updateData: (updates: Partial<OnboardingData>) => void
  onNext: () => void
  canProceed: boolean
  isReferralFlow?: boolean
}

const shareOptions = [
  {
    id: "full" as ShareLevel,
    name: "Full Share",
    fraction: "1/1",
    percentage: "100%",
    price: "€150,000",
    usageDays: "365 days/year",
    services: "Full access privileges",
    maintenance: "All maintenance included",
    commissionShare: "75%",
    commissionSplit: "You: 75% | Glampinski: 5% | Landowner: 12% | Tour Operator: 8%",
    popular: true,
  },
  {
    id: "half" as ShareLevel,
    name: "1/2 Share",
    fraction: "1/2",
    percentage: "50%",
    price: "€80,000",
    usageDays: "180 days/year",
    services: "Standard access privileges",
    maintenance: "Shared maintenance costs",
    commissionShare: "72.5%",
    commissionSplit: "You: 72.5% | Glampinski: 7.5% | Landowner: 12% | Tour Operator: 8%",
  },
  {
    id: "quarter" as ShareLevel,
    name: "1/4 Share",
    fraction: "1/4",
    percentage: "25%",
    price: "€42,500",
    usageDays: "90 days/year",
    services: "Basic access privileges",
    maintenance: "Proportional maintenance",
    commissionShare: "70%",
    commissionSplit: "You: 70% | Glampinski: 10% | Landowner: 12% | Tour Operator: 8%",
  },
  {
    id: "eighth" as ShareLevel,
    name: "1/8 Share",
    fraction: "1/8",
    percentage: "12.5%",
    price: "€21,250",
    usageDays: "40 days/year",
    services: "Essential access only",
    maintenance: "Minimal maintenance included",
    commissionShare: "67.5%",
    commissionSplit: "You: 67.5% | Glampinski: 12.5% | Landowner: 12% | Tour Operator: 8%",
  },
]

export function ShareSelection({ data, updateData, onNext, canProceed, isReferralFlow = false }: ShareSelectionProps) {
  const handleShareSelect = (shareLevel: ShareLevel) => {
    updateData({
      shareLevel,
      vipPresale: shareLevel === "full" ? data.vipPresale : false,
    })
  }

  const handleVipToggle = (checked: boolean) => {
    updateData({ vipPresale: checked })
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Choose Your Ownership Level</h2>
        <p className="text-muted-foreground">{"Select the timeshare option that best fits your needs"}</p>
      </div>

      {/* Group 1: In Production */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">In Production</h3>
          <Badge variant="secondary">Available Now</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {shareOptions.map((option) => (
            <Card
              key={option.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                data.shareLevel === option.id ? "ring-2 ring-primary bg-primary/5" : "hover:bg-muted/50"
              }`}
              onClick={() => handleShareSelect(option.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{option.name}</CardTitle>
                  {option.popular && <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>}
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-2xl font-bold text-primary">{option.price}</div>
                  <div className="text-sm text-muted-foreground">
                    {option.fraction} = {option.percentage}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{option.usageDays}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{option.services}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Wrench className="h-4 w-4 text-muted-foreground" />
                  <span>{option.maintenance}</span>
                </div>
                <div className="pt-2 border-t">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-primary">Your Commission Share:</span>
                    <span className="font-bold text-primary">{option.commissionShare}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">{option.commissionSplit}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Group 2: VIP Presale (always visible but disabled when not full share) */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Crown className="h-5 w-5 text-accent" />
          <h3 className="text-lg font-semibold">VIP Presale</h3>
          <Badge variant="outline" className="border-accent text-accent">
            Exclusive
          </Badge>
        </div>

        <Card className={`border-accent/20 ${data.shareLevel === "full" ? "bg-accent/5" : "bg-muted/20 opacity-60"}`}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <h4 className="font-semibold">Join VIP Presale</h4>
                <p className="text-sm text-muted-foreground">
                  {data.shareLevel === "full"
                    ? "Add €20,000 for exclusive deals, priority access, and premium perks"
                    : "Only available with Full Share ownership"}
                </p>
                <div className="text-lg font-bold text-accent">+€20,000</div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="vip-presale"
                  checked={data.vipPresale}
                  onCheckedChange={handleVipToggle}
                  disabled={data.shareLevel !== "full"}
                />
                <Label htmlFor="vip-presale" className="sr-only">
                  Join VIP Presale
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center pt-6">
        <Button onClick={onNext} disabled={!canProceed} size="lg" className="px-8">
          {isReferralFlow ? "Continue to Sign Up" : "Continue to Sign Up"}
        </Button>
      </div>
    </div>
  )
}
