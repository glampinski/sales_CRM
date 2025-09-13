"use client"

import { useState } from "react"
import { TrendingUp, DollarSign, Calendar, Download, Filter, Search, Eye, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

// Mock commission data
const commissionStats = [
  { label: "This Month Commissions", value: "$3,245.80", change: "+18.2%", icon: DollarSign },
  { label: "YTD Commissions", value: "$28,967.50", change: "+24.5%", icon: TrendingUp },
  { label: "Pending Commissions", value: "$1,567.25", change: "+5.8%", icon: Calendar },
  { label: "Lifetime Earnings", value: "$156,789.90", change: "+15.3%", icon: TrendingUp },
]

const commissionPeriods = [
  {
    id: "2025-09",
    period: "September 2025",
    status: "current",
    totalEarnings: 3245.80,
    personalPV: 1245,
    groupPV: 15680,
    bonuses: [
      { type: "Retail Profit", amount: 567.30 },
      { type: "Team Bonus", amount: 1234.50 },
      { type: "Leadership Bonus", amount: 890.00 },
      { type: "Rank Bonus", amount: 554.00 },
    ]
  },
  {
    id: "2025-08",
    period: "August 2025",
    status: "paid",
    totalEarnings: 2987.45,
    personalPV: 1189,
    groupPV: 14230,
    bonuses: [
      { type: "Retail Profit", amount: 523.40 },
      { type: "Team Bonus", amount: 1156.70 },
      { type: "Leadership Bonus", amount: 801.35 },
      { type: "Rank Bonus", amount: 506.00 },
    ]
  },
  {
    id: "2025-07",
    period: "July 2025",
    status: "paid",
    totalEarnings: 3156.20,
    personalPV: 1356,
    groupPV: 15890,
    bonuses: [
      { type: "Retail Profit", amount: 612.80 },
      { type: "Team Bonus", amount: 1287.40 },
      { type: "Leadership Bonus", amount: 756.00 },
      { type: "Rank Bonus", amount: 500.00 },
    ]
  },
]

const teamCommissions = [
  {
    name: "Sarah Johnson",
    rank: "Gold",
    personalPV: 890,
    commissionEarned: 1234.50,
    myCommission: 123.45,
    level: 1,
  },
  {
    name: "David Wilson",
    rank: "Silver", 
    personalPV: 780,
    commissionEarned: 890.25,
    myCommission: 89.03,
    level: 1,
  },
  {
    name: "Mike Chen",
    rank: "Silver",
    personalPV: 650,
    commissionEarned: 567.80,
    myCommission: 28.39,
    level: 2,
  },
  {
    name: "Emily Rodriguez",
    rank: "Bronze",
    personalPV: 420,
    commissionEarned: 234.60,
    myCommission: 11.73,
    level: 2,
  },
]

const rankRequirements = {
  current: "Diamond",
  next: "Crown Diamond",
  progress: 75,
  requirements: [
    { name: "Personal PV", current: 1245, required: 1500, percentage: 83 },
    { name: "Group PV", current: 15680, required: 20000, percentage: 78 },
    { name: "Active Legs", current: 3, required: 4, percentage: 75 },
    { name: "Leadership Volume", current: 12000, required: 15000, percentage: 80 },
  ]
}

export default function CommissionPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("2025-09")
  const [viewMode, setViewMode] = useState<"overview" | "details" | "team">("overview")

  const currentPeriod = commissionPeriods.find(p => p.id === selectedPeriod) || commissionPeriods[0]

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "current": return "default"
      case "paid": return "outline"
      case "pending": return "secondary"
      default: return "secondary"
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Commission Dashboard</h1>
          <p className="text-muted-foreground">
            Track your earnings and team performance
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Statement
          </Button>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {commissionStats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">{stat.change}</span> from last period
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Period Selector and View Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              {commissionPeriods.map((period) => (
                <SelectItem key={period.id} value={period.id}>
                  {period.period}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Badge variant={getStatusColor(currentPeriod.status)}>
            {currentPeriod.status.charAt(0).toUpperCase() + currentPeriod.status.slice(1)}
          </Badge>
        </div>

        <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "overview" | "details" | "team")}>
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Content */}
      <Tabs value={viewMode} className="space-y-6">
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Current Period Summary */}
            <Card>
              <CardHeader>
                <CardTitle>{currentPeriod.period} Summary</CardTitle>
                <CardDescription>Your commission breakdown for this period</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-green-600">
                    {formatCurrency(currentPeriod.totalEarnings)}
                  </span>
                  <Badge variant="outline">Total Earned</Badge>
                </div>
                
                <div className="space-y-3">
                  {currentPeriod.bonuses.map((bonus, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">{bonus.type}</span>
                      <span className="font-medium">{formatCurrency(bonus.amount)}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Personal PV</p>
                      <p className="text-lg font-semibold">{currentPeriod.personalPV.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Group PV</p>
                      <p className="text-lg font-semibold">{currentPeriod.groupPV.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Rank Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Rank Advancement</CardTitle>
                <CardDescription>
                  Progress toward {rankRequirements.next} rank
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant="default" className="text-lg py-1 px-3">
                    {rankRequirements.current}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {rankRequirements.progress}% to {rankRequirements.next}
                  </span>
                </div>
                
                <Progress value={rankRequirements.progress} className="h-3" />
                
                <div className="space-y-3">
                  {rankRequirements.requirements.map((req, index) => (
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
          </div>

          {/* Monthly Trend Chart Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle>Commission Trend</CardTitle>
              <CardDescription>Your earnings over the last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <TrendingUp className="h-12 w-12 mx-auto mb-4" />
                  <p>Chart visualization coming soon...</p>
                  <p className="text-sm">Historical commission data will be displayed here</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Commission Breakdown</CardTitle>
              <CardDescription>Complete breakdown for {currentPeriod.period}</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Commission Type</TableHead>
                    <TableHead>Rate</TableHead>
                    <TableHead>Volume</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentPeriod.bonuses.map((bonus, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{bonus.type}</TableCell>
                      <TableCell>
                        {bonus.type === "Retail Profit" ? "45%" : 
                         bonus.type === "Team Bonus" ? "8%" :
                         bonus.type === "Leadership Bonus" ? "6%" : "Fixed"}
                      </TableCell>
                      <TableCell>
                        {bonus.type === "Retail Profit" ? currentPeriod.personalPV.toLocaleString() :
                         bonus.type === "Team Bonus" ? currentPeriod.groupPV.toLocaleString() :
                         bonus.type === "Leadership Bonus" ? (currentPeriod.groupPV - currentPeriod.personalPV).toLocaleString() :
                         "N/A"}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(bonus.amount)}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-muted/50">
                    <TableCell className="font-bold">Total</TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell className="text-right font-bold">
                      {formatCurrency(currentPeriod.totalEarnings)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Team Commission Overview</CardTitle>
              <CardDescription>Commission earned by your team members</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Team Member</TableHead>
                    <TableHead>Rank</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead>Personal PV</TableHead>
                    <TableHead>Their Commission</TableHead>
                    <TableHead className="text-right">Your Commission</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teamCommissions.map((member, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{member.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{member.rank}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">Level {member.level}</Badge>
                      </TableCell>
                      <TableCell>{member.personalPV.toLocaleString()}</TableCell>
                      <TableCell>{formatCurrency(member.commissionEarned)}</TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(member.myCommission)}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-muted/50">
                    <TableCell className="font-bold" colSpan={5}>Total from Team</TableCell>
                    <TableCell className="text-right font-bold">
                      {formatCurrency(teamCommissions.reduce((sum, member) => sum + member.myCommission, 0))}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
