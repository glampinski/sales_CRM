"use client"

import { useState } from "react"
import { Crown, TrendingUp, Users, Target, Plus, Edit, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

// Mock rank data
const ranks = [
  {
    id: 1,
    name: "Distributor",
    level: 1,
    color: "bg-green-100 text-green-800",
    requirements: {
      personalPV: 100,
      groupPV: 0,
      activeLegs: 0,
      teamSize: 0,
    },
    benefits: {
      retailProfit: 30,
      commissionRate: 0,
      bonuses: ["Retail Profit"],
      carBonus: 0,
      recognition: "Starter Pin",
    },
    currentCount: 12,
    description: "Entry level position for new distributors",
  },
  {
    id: 2,
    name: "Bronze",
    level: 2,
    color: "bg-orange-100 text-orange-800",
    requirements: {
      personalPV: 300,
      groupPV: 500,
      activeLegs: 1,
      teamSize: 2,
    },
    benefits: {
      retailProfit: 35,
      commissionRate: 5,
      bonuses: ["Retail Profit", "Team Bonus"],
      carBonus: 0,
      recognition: "Bronze Pin",
    },
    currentCount: 18,
    description: "First advancement level with team bonuses",
  },
  {
    id: 3,
    name: "Silver",
    level: 3,
    color: "bg-gray-100 text-gray-800",
    requirements: {
      personalPV: 500,
      groupPV: 2000,
      activeLegs: 2,
      teamSize: 5,
    },
    benefits: {
      retailProfit: 40,
      commissionRate: 8,
      bonuses: ["Retail Profit", "Team Bonus", "Leadership Bonus"],
      carBonus: 0,
      recognition: "Silver Pin + Certificate",
    },
    currentCount: 9,
    description: "Leadership level with increased commission rates",
  },
  {
    id: 4,
    name: "Gold",
    level: 4,
    color: "bg-yellow-100 text-yellow-800",
    requirements: {
      personalPV: 750,
      groupPV: 5000,
      activeLegs: 3,
      teamSize: 10,
    },
    benefits: {
      retailProfit: 45,
      commissionRate: 12,
      bonuses: ["Retail Profit", "Team Bonus", "Leadership Bonus", "Rank Bonus"],
      carBonus: 300,
      recognition: "Gold Pin + Plaque",
    },
    currentCount: 5,
    description: "Advanced leadership with car bonus eligibility",
  },
  {
    id: 5,
    name: "Diamond",
    level: 5,
    color: "bg-blue-100 text-blue-800",
    requirements: {
      personalPV: 1000,
      groupPV: 15000,
      activeLegs: 4,
      teamSize: 25,
    },
    benefits: {
      retailProfit: 50,
      commissionRate: 15,
      bonuses: ["All Bonuses", "Diamond Bonus", "Global Pool"],
      carBonus: 800,
      recognition: "Diamond Ring + Trophy",
    },
    currentCount: 2,
    description: "Elite level with maximum benefits and global pool participation",
  },
  {
    id: 6,
    name: "Crown Diamond",
    level: 6,
    color: "bg-purple-100 text-purple-800",
    requirements: {
      personalPV: 1500,
      groupPV: 50000,
      activeLegs: 6,
      teamSize: 100,
    },
    benefits: {
      retailProfit: 50,
      commissionRate: 18,
      bonuses: ["All Bonuses", "Crown Bonus", "Lifestyle Fund"],
      carBonus: 1500,
      recognition: "Crown + Annual Trip",
    },
    currentCount: 1,
    description: "Highest achievable rank with lifestyle rewards",
  },
]

const stats = [
  { label: "Total Ranks", value: "6", change: "Active", icon: Award },
  { label: "Avg. Advancement Time", value: "8.5 mo", change: "-2.1 mo", icon: TrendingUp },
  { label: "This Month Promotions", value: "3", change: "+1", icon: Users },
  { label: "Qualification Rate", value: "64%", change: "+5.2%", icon: Target },
]

// Mock personal progress
const personalProgress = {
  currentRank: "Diamond",
  nextRank: "Crown Diamond",
  progress: 75,
  requirements: [
    { name: "Personal PV", current: 1245, required: 1500, percentage: 83 },
    { name: "Group PV", current: 37500, required: 50000, percentage: 75 },
    { name: "Active Legs", current: 5, required: 6, percentage: 83 },
    { name: "Team Size", current: 78, required: 100, percentage: 78 },
  ]
}

export default function RanksPage() {
  const [viewMode, setViewMode] = useState<"overview" | "requirements" | "progress">("overview")

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const RankCard = ({ rank }: { rank: typeof ranks[0] }) => (
    <Card className="relative overflow-hidden hover:shadow-md transition-shadow">
      <div className={`absolute top-0 left-0 right-0 h-1 ${rank.color.split(' ')[0]}`} />
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-full bg-muted">
              <Crown className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-xl">{rank.name}</CardTitle>
              <CardDescription>Level {rank.level} • {rank.currentCount} distributors</CardDescription>
            </div>
          </div>
          <Badge className={rank.color}>
            {rank.name}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{rank.description}</p>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Retail Profit</p>
            <p className="text-lg font-semibold">{rank.benefits.retailProfit}%</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Commission Rate</p>
            <p className="text-lg font-semibold">{rank.benefits.commissionRate}%</p>
          </div>
        </div>

        <div>
          <p className="text-sm text-muted-foreground mb-2">Requirements</p>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Personal PV:</span>
              <span className="font-medium">{rank.requirements.personalPV.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Group PV:</span>
              <span className="font-medium">{rank.requirements.groupPV.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Active Legs:</span>
              <span className="font-medium">{rank.requirements.activeLegs}</span>
            </div>
          </div>
        </div>

        <div>
          <p className="text-sm text-muted-foreground mb-2">Benefits</p>
          <div className="flex flex-wrap gap-1">
            {rank.benefits.bonuses.map((bonus, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {bonus}
              </Badge>
            ))}
          </div>
          {rank.benefits.carBonus > 0 && (
            <p className="text-xs text-green-600 mt-2">
              Car Bonus: {formatCurrency(rank.benefits.carBonus)}/month
            </p>
          )}
        </div>

        <div className="pt-2">
          <Button variant="outline" size="sm" className="w-full">
            <Edit className="h-3 w-3 mr-1" />
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Rank Management</h1>
          <p className="text-muted-foreground">
            Manage rank requirements and track advancement progress
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Edit className="h-4 w-4 mr-2" />
            Edit Requirements
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Rank
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">{stat.change}</span> this month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* View Toggle */}
      <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "overview" | "requirements" | "progress")}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="requirements">Requirements</TabsTrigger>
          <TabsTrigger value="progress">My Progress</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {ranks.map((rank) => (
              <RankCard key={rank.id} rank={rank} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="requirements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Rank Requirements Matrix</CardTitle>
              <CardDescription>Complete requirements for each rank level</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rank</TableHead>
                    <TableHead>Personal PV</TableHead>
                    <TableHead>Group PV</TableHead>
                    <TableHead>Active Legs</TableHead>
                    <TableHead>Team Size</TableHead>
                    <TableHead>Commission Rate</TableHead>
                    <TableHead>Car Bonus</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ranks.map((rank) => (
                    <TableRow key={rank.id}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Badge className={rank.color}>{rank.name}</Badge>
                        </div>
                      </TableCell>
                      <TableCell>{rank.requirements.personalPV.toLocaleString()}</TableCell>
                      <TableCell>{rank.requirements.groupPV.toLocaleString()}</TableCell>
                      <TableCell>{rank.requirements.activeLegs}</TableCell>
                      <TableCell>{rank.requirements.teamSize}</TableCell>
                      <TableCell>{rank.benefits.commissionRate}%</TableCell>
                      <TableCell>
                        {rank.benefits.carBonus > 0 ? formatCurrency(rank.benefits.carBonus) : "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Current Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Current Rank Progress</CardTitle>
                <CardDescription>
                  Your progress from {personalProgress.currentRank} to {personalProgress.nextRank}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant="default" className="text-lg py-1 px-3">
                    {personalProgress.currentRank}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {personalProgress.progress}% to {personalProgress.nextRank}
                  </span>
                </div>
                
                <Progress value={personalProgress.progress} className="h-3" />
                
                <div className="space-y-3">
                  {personalProgress.requirements.map((req, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>{req.name}</span>
                        <span>{req.current.toLocaleString()} / {req.required.toLocaleString()}</span>
                      </div>
                      <Progress value={req.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Next Rank Benefits */}
            <Card>
              <CardHeader>
                <CardTitle>Next Rank Benefits</CardTitle>
                <CardDescription>What you'll achieve at {personalProgress.nextRank}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {(() => {
                  const nextRank = ranks.find(r => r.name === personalProgress.nextRank)
                  if (!nextRank) return null
                  
                  return (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Commission Rate</p>
                          <p className="text-2xl font-bold text-green-600">{nextRank.benefits.commissionRate}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Car Bonus</p>
                          <p className="text-2xl font-bold text-green-600">
                            {formatCurrency(nextRank.benefits.carBonus)}
                          </p>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Additional Benefits</p>
                        <div className="flex flex-wrap gap-1">
                          {nextRank.benefits.bonuses.map((bonus, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {bonus}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-sm font-medium">Recognition</p>
                        <p className="text-sm text-muted-foreground">{nextRank.benefits.recognition}</p>
                      </div>
                    </>
                  )
                })()}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
