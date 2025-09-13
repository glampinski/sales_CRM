"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  Users, 
  Award,
  Download,
  Eye,
  ChevronRight,
  Target,
  Percent,
  Clock
} from "lucide-react"

interface CommissionPeriod {
  id: string
  period: string
  startDate: string
  endDate: string
  status: "active" | "pending" | "paid" | "processing"
  personalVolume: number
  groupVolume: number
  totalCommission: number
  rankBonus: number
  leadershipBonus: number
  breakdown: {
    level1: number
    level2: number
    level3: number
    level4: number
    level5: number
  }
}

interface RankRequirement {
  rank: string
  personalVolume: number
  groupVolume: number
  directDistributors: number
  currentPV: number
  currentGV: number
  currentDirects: number
  progress: number
}

// Mock data
const mockCommissionData: CommissionPeriod[] = [
  {
    id: "1",
    period: "September 2025",
    startDate: "2025-09-01",
    endDate: "2025-09-30",
    status: "active",
    personalVolume: 3250,
    groupVolume: 18750,
    totalCommission: 4687.50,
    rankBonus: 1250,
    leadershipBonus: 875,
    breakdown: {
      level1: 1750,
      level2: 950,
      level3: 640,
      level4: 290,
      level5: 125
    }
  },
  {
    id: "2",
    period: "August 2025", 
    startDate: "2025-08-01",
    endDate: "2025-08-31",
    status: "paid",
    personalVolume: 2890,
    groupVolume: 16200,
    totalCommission: 4050,
    rankBonus: 1100,
    leadershipBonus: 750,
    breakdown: {
      level1: 1620,
      level2: 810,
      level3: 540,
      level4: 270,
      level5: 135
    }
  }
]

const mockRankProgress: RankRequirement = {
  rank: "Diamond",
  personalVolume: 5000,
  groupVolume: 25000,
  directDistributors: 5,
  currentPV: 3250,
  currentGV: 18750,
  currentDirects: 4,
  progress: 75
}

const commissionRates = [
  { level: "Level 1 (Direct)", rate: "25%", color: "bg-green-500" },
  { level: "Level 2", rate: "15%", color: "bg-blue-500" },
  { level: "Level 3", rate: "10%", color: "bg-purple-500" },
  { level: "Level 4", rate: "5%", color: "bg-orange-500" },
  { level: "Level 5", rate: "3%", color: "bg-pink-500" },
]

export function CommissionDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState(mockCommissionData[0])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500"
      case "pending": return "bg-yellow-500"
      case "paid": return "bg-blue-500"
      case "processing": return "bg-orange-500"
      default: return "bg-gray-500"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "active": return "Current Period"
      case "pending": return "Pending Calculation"
      case "paid": return "Paid"
      case "processing": return "Processing Payment"
      default: return status
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Commission Dashboard</h2>
          <p className="text-muted-foreground">Track your earnings and rank progress</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button>
            <Eye className="h-4 w-4 mr-2" />
            View Statement
          </Button>
        </div>
      </div>

      {/* Current Period Summary */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Commission</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${selectedPeriod.totalCommission.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12.5%</span> from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Personal Volume</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${selectedPeriod.personalVolume.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Personal sales this period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Group Volume</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${selectedPeriod.groupVolume.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Total team volume
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rank Progress</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockRankProgress.progress}%</div>
            <p className="text-xs text-muted-foreground">
              Progress to {mockRankProgress.rank}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="current" className="space-y-4">
        <TabsList>
          <TabsTrigger value="current">Current Period</TabsTrigger>
          <TabsTrigger value="history">Commission History</TabsTrigger>
          <TabsTrigger value="ranks">Rank Requirements</TabsTrigger>
          <TabsTrigger value="structure">Commission Structure</TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Commission Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Commission Breakdown</CardTitle>
                <CardDescription>
                  Earnings by level for {selectedPeriod.period}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(selectedPeriod.breakdown).map(([level, amount], index) => (
                  <div key={level} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${commissionRates[index]?.color}`}></div>
                      <span className="text-sm font-medium">Level {level.slice(-1)}</span>
                    </div>
                    <span className="font-semibold">${amount.toLocaleString()}</span>
                  </div>
                ))}
                <div className="border-t pt-2 flex items-center justify-between">
                  <span className="font-medium">Rank Bonus</span>
                  <span className="font-semibold text-green-600">${selectedPeriod.rankBonus.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Leadership Bonus</span>
                  <span className="font-semibold text-blue-600">${selectedPeriod.leadershipBonus.toLocaleString()}</span>
                </div>
                <div className="border-t pt-2 flex items-center justify-between">
                  <span className="text-lg font-bold">Total Commission</span>
                  <span className="text-lg font-bold">${selectedPeriod.totalCommission.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>

            {/* Period Status */}
            <Card>
              <CardHeader>
                <CardTitle>Period Status</CardTitle>
                <CardDescription>
                  Current commission period details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Period</span>
                  <span className="font-semibold">{selectedPeriod.period}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Start Date</span>
                  <span>{new Date(selectedPeriod.startDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">End Date</span>
                  <span>{new Date(selectedPeriod.endDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Status</span>
                  <Badge className={`${getStatusColor(selectedPeriod.status)} text-white`}>
                    {getStatusText(selectedPeriod.status)}
                  </Badge>
                </div>
                
                <div className="pt-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Period Progress</span>
                    <span>75%</span>
                  </div>
                  <Progress value={75} className="h-2" />
                  <p className="text-xs text-muted-foreground">8 days remaining</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Commission History</CardTitle>
              <CardDescription>
                Your commission earnings over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockCommissionData.map((period) => (
                  <div key={period.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div>
                        <p className="font-medium">{period.period}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(period.startDate).toLocaleDateString()} - {new Date(period.endDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Badge className={`${getStatusColor(period.status)} text-white`}>
                        {getStatusText(period.status)}
                      </Badge>
                      <div className="text-right">
                        <p className="font-semibold">${period.totalCommission.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">Total Commission</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ranks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Rank Advancement Progress</CardTitle>
              <CardDescription>
                Track your progress towards the next rank
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Personal Volume</span>
                    <span className="text-sm">{mockRankProgress.currentPV} / {mockRankProgress.personalVolume}</span>
                  </div>
                  <Progress value={(mockRankProgress.currentPV / mockRankProgress.personalVolume) * 100} className="h-2" />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Group Volume</span>
                    <span className="text-sm">{mockRankProgress.currentGV} / {mockRankProgress.groupVolume}</span>
                  </div>
                  <Progress value={(mockRankProgress.currentGV / mockRankProgress.groupVolume) * 100} className="h-2" />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Direct Distributors</span>
                    <span className="text-sm">{mockRankProgress.currentDirects} / {mockRankProgress.directDistributors}</span>
                  </div>
                  <Progress value={(mockRankProgress.currentDirects / mockRankProgress.directDistributors) * 100} className="h-2" />
                </div>
              </div>
              
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium mb-2">Next Rank: {mockRankProgress.rank}</h4>
                <p className="text-sm text-muted-foreground">
                  You're {100 - mockRankProgress.progress}% away from advancing to {mockRankProgress.rank} rank.
                  Focus on increasing your group volume and recruiting one more direct distributor.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="structure" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Commission Structure</CardTitle>
              <CardDescription>
                Understanding how commissions are calculated
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {commissionRates.map((rate, index) => (
                <div key={rate.level} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full ${rate.color}`}></div>
                    <span className="font-medium">{rate.level}</span>
                  </div>
                  <Badge variant="secondary">{rate.rate}</Badge>
                </div>
              ))}
              
              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium mb-2">Additional Bonuses</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Rank Bonus (Gold+)</span>
                    <span>5-15% of personal volume</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Leadership Bonus (Platinum+)</span>
                    <span>2-8% of team volume</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Monthly Achievement Bonus</span>
                    <span>Up to $2,500</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
