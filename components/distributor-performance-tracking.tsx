"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  TrendingUp, 
  TrendingDown,
  Target,
  Award,
  Users,
  DollarSign,
  Calendar,
  Crown,
  Star,
  ArrowUp,
  ArrowDown,
  Minus,
  Filter,
  Download,
  RefreshCw
} from "lucide-react"

interface PerformanceMetric {
  id: string
  distributorId: string
  distributorName: string
  rank: string
  period: string
  personalVolume: {
    current: number
    previous: number
    target: number
    growth: number
  }
  groupVolume: {
    current: number
    previous: number
    target: number
    growth: number
  }
  commissions: {
    current: number
    previous: number
    target: number
    growth: number
  }
  recruiting: {
    current: number
    previous: number
    target: number
    growth: number
  }
  teamSize: {
    current: number
    previous: number
    growth: number
  }
  rankProgress: {
    currentPoints: number
    requiredPoints: number
    percentage: number
    timeInRank: number
  }
  kpis: {
    retentionRate: number
    activationRate: number
    leadershipScore: number
    customerSatisfaction: number
  }
}

// Mock performance data
const mockPerformanceData: PerformanceMetric[] = [
  {
    id: "perf-001",
    distributorId: "dist-001",
    distributorName: "Sarah Johnson",
    rank: "Gold",
    period: "2025-09",
    personalVolume: { current: 3250, previous: 2800, target: 4000, growth: 16.1 },
    groupVolume: { current: 18750, previous: 16200, target: 20000, growth: 15.7 },
    commissions: { current: 4687.50, previous: 4050.00, target: 5000, growth: 15.7 },
    recruiting: { current: 3, previous: 2, target: 5, growth: 50.0 },
    teamSize: { current: 23, previous: 20, growth: 15.0 },
    rankProgress: { currentPoints: 1250, requiredPoints: 2000, percentage: 62.5, timeInRank: 8 },
    kpis: { retentionRate: 85, activationRate: 78, leadershipScore: 92, customerSatisfaction: 88 }
  },
  {
    id: "perf-002",
    distributorId: "dist-002",
    distributorName: "Michael Chen",
    rank: "Silver",
    period: "2025-09",
    personalVolume: { current: 2100, previous: 1950, target: 2500, growth: 7.7 },
    groupVolume: { current: 8500, previous: 7800, target: 10000, growth: 9.0 },
    commissions: { current: 1875.00, previous: 1710.00, target: 2200, growth: 9.6 },
    recruiting: { current: 2, previous: 1, target: 3, growth: 100.0 },
    teamSize: { current: 12, previous: 10, growth: 20.0 },
    rankProgress: { currentPoints: 850, requiredPoints: 1500, percentage: 56.7, timeInRank: 4 },
    kpis: { retentionRate: 78, activationRate: 72, leadershipScore: 85, customerSatisfaction: 82 }
  },
  {
    id: "perf-003",
    distributorId: "dist-003",
    distributorName: "Emma Wilson",
    rank: "Platinum",
    period: "2025-09",
    personalVolume: { current: 4500, previous: 4200, target: 5000, growth: 7.1 },
    groupVolume: { current: 32000, previous: 28500, target: 35000, growth: 12.3 },
    commissions: { current: 8500.00, previous: 7400.00, target: 9000, growth: 14.9 },
    recruiting: { current: 4, previous: 3, target: 6, growth: 33.3 },
    teamSize: { current: 45, previous: 39, growth: 15.4 },
    rankProgress: { currentPoints: 3200, requiredPoints: 5000, percentage: 64.0, timeInRank: 12 },
    kpis: { retentionRate: 92, activationRate: 85, leadershipScore: 95, customerSatisfaction: 94 }
  }
]

const getRankColor = (rank: string) => {
  switch (rank) {
    case "Diamond": return "bg-blue-500 text-white"
    case "Platinum": return "bg-gray-400 text-white"
    case "Gold": return "bg-yellow-500 text-white"
    case "Silver": return "bg-gray-300 text-black"
    case "Bronze": return "bg-orange-600 text-white"
    case "Ambassador": return "bg-purple-600 text-white"
    default: return "bg-gray-200 text-black"
  }
}

const getGrowthIcon = (growth: number) => {
  if (growth > 0) return <ArrowUp className="h-4 w-4 text-green-600" />
  if (growth < 0) return <ArrowDown className="h-4 w-4 text-red-600" />
  return <Minus className="h-4 w-4 text-gray-600" />
}

const getGrowthColor = (growth: number) => {
  if (growth > 0) return "text-green-600"
  if (growth < 0) return "text-red-600"
  return "text-gray-600"
}

export function DistributorPerformanceTracking() {
  const [selectedPeriod, setSelectedPeriod] = useState("2025-09")
  const [selectedRank, setSelectedRank] = useState("all")
  const [sortBy, setSortBy] = useState("performance")
  const [isLoading, setIsLoading] = useState(false)

  const handleRefresh = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsLoading(false)
  }

  const handleExport = () => {
    // Export performance data
    console.log("Exporting performance data...")
  }

  // Calculate summary stats
  const totalDistributors = mockPerformanceData.length
  const avgGrowth = mockPerformanceData.reduce((acc, d) => acc + d.personalVolume.growth, 0) / totalDistributors
  const topPerformers = mockPerformanceData.filter(d => d.personalVolume.growth > 10).length
  const needsAttention = mockPerformanceData.filter(d => d.personalVolume.growth < 0).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Performance Tracking</h1>
          <p className="text-muted-foreground">
            Monitor distributor performance metrics and growth indicators
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Distributors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDistributors}</div>
            <p className="text-xs text-muted-foreground">
              Performance tracked
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Growth</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgGrowth.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Month over month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Performers</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{topPerformers}</div>
            <p className="text-xs text-muted-foreground">
              Above 10% growth
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Needs Attention</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{needsAttention}</div>
            <p className="text-xs text-muted-foreground">
              Negative growth
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 p-4 bg-muted/50 rounded-lg">
        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2025-09">September 2025</SelectItem>
            <SelectItem value="2025-08">August 2025</SelectItem>
            <SelectItem value="2025-07">July 2025</SelectItem>
            <SelectItem value="Q3-2025">Q3 2025</SelectItem>
            <SelectItem value="YTD-2025">YTD 2025</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedRank} onValueChange={setSelectedRank}>
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Rank" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Ranks</SelectItem>
            <SelectItem value="Diamond">Diamond</SelectItem>
            <SelectItem value="Platinum">Platinum</SelectItem>
            <SelectItem value="Gold">Gold</SelectItem>
            <SelectItem value="Silver">Silver</SelectItem>
            <SelectItem value="Bronze">Bronze</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="performance">Performance</SelectItem>
            <SelectItem value="growth">Growth Rate</SelectItem>
            <SelectItem value="volume">Personal Volume</SelectItem>
            <SelectItem value="commissions">Commissions</SelectItem>
            <SelectItem value="rank">Rank Progress</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Performance Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Individual Performance</h2>
          <Badge variant="outline">{mockPerformanceData.length} distributors</Badge>
        </div>

        <div className="grid gap-6">
          {mockPerformanceData.map((metric) => (
            <Card key={metric.id} className="hover:shadow-lg transition-all duration-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src="/placeholder-user.jpg" />
                      <AvatarFallback>
                        {metric.distributorName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{metric.distributorName}</CardTitle>
                      <div className="flex items-center space-x-2">
                        <Badge className={getRankColor(metric.rank)}>{metric.rank}</Badge>
                        <span className="text-sm text-muted-foreground">•</span>
                        <span className="text-sm text-muted-foreground">{metric.period}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">
                      {metric.personalVolume.growth >= 0 ? '+' : ''}{metric.personalVolume.growth.toFixed(1)}%
                    </div>
                    <p className="text-sm text-muted-foreground">Overall Growth</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="metrics" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="metrics">Key Metrics</TabsTrigger>
                    <TabsTrigger value="progress">Rank Progress</TabsTrigger>
                    <TabsTrigger value="kpis">KPIs</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="metrics" className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Personal Volume</span>
                          {getGrowthIcon(metric.personalVolume.growth)}
                        </div>
                        <div className="text-lg font-semibold">${metric.personalVolume.current.toLocaleString()}</div>
                        <div className="flex items-center justify-between text-xs">
                          <span className={getGrowthColor(metric.personalVolume.growth)}>
                            {metric.personalVolume.growth >= 0 ? '+' : ''}{metric.personalVolume.growth.toFixed(1)}%
                          </span>
                          <span className="text-muted-foreground">Target: ${metric.personalVolume.target.toLocaleString()}</span>
                        </div>
                        <Progress value={(metric.personalVolume.current / metric.personalVolume.target) * 100} className="h-2" />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Group Volume</span>
                          {getGrowthIcon(metric.groupVolume.growth)}
                        </div>
                        <div className="text-lg font-semibold">${metric.groupVolume.current.toLocaleString()}</div>
                        <div className="flex items-center justify-between text-xs">
                          <span className={getGrowthColor(metric.groupVolume.growth)}>
                            {metric.groupVolume.growth >= 0 ? '+' : ''}{metric.groupVolume.growth.toFixed(1)}%
                          </span>
                          <span className="text-muted-foreground">Target: ${metric.groupVolume.target.toLocaleString()}</span>
                        </div>
                        <Progress value={(metric.groupVolume.current / metric.groupVolume.target) * 100} className="h-2" />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Commissions</span>
                          {getGrowthIcon(metric.commissions.growth)}
                        </div>
                        <div className="text-lg font-semibold text-green-600">${metric.commissions.current.toLocaleString()}</div>
                        <div className="flex items-center justify-between text-xs">
                          <span className={getGrowthColor(metric.commissions.growth)}>
                            {metric.commissions.growth >= 0 ? '+' : ''}{metric.commissions.growth.toFixed(1)}%
                          </span>
                          <span className="text-muted-foreground">Target: ${metric.commissions.target.toLocaleString()}</span>
                        </div>
                        <Progress value={(metric.commissions.current / metric.commissions.target) * 100} className="h-2" />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">New Recruits</span>
                          {getGrowthIcon(metric.recruiting.growth)}
                        </div>
                        <div className="text-lg font-semibold">{metric.recruiting.current}</div>
                        <div className="flex items-center justify-between text-xs">
                          <span className={getGrowthColor(metric.recruiting.growth)}>
                            {metric.recruiting.growth >= 0 ? '+' : ''}{metric.recruiting.growth.toFixed(1)}%
                          </span>
                          <span className="text-muted-foreground">Target: {metric.recruiting.target}</span>
                        </div>
                        <Progress value={(metric.recruiting.current / metric.recruiting.target) * 100} className="h-2" />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="progress" className="space-y-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold">Next Rank Progress</h4>
                          <p className="text-sm text-muted-foreground">
                            {metric.rankProgress.currentPoints} / {metric.rankProgress.requiredPoints} points
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold">{metric.rankProgress.percentage.toFixed(1)}%</div>
                          <p className="text-sm text-muted-foreground">{metric.rankProgress.timeInRank} months in rank</p>
                        </div>
                      </div>
                      <Progress value={metric.rankProgress.percentage} className="h-3" />
                      <div className="text-sm text-muted-foreground">
                        {metric.rankProgress.requiredPoints - metric.rankProgress.currentPoints} points needed for next rank
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="kpis" className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold">{metric.kpis.retentionRate}%</div>
                        <p className="text-sm text-muted-foreground">Retention Rate</p>
                        <Progress value={metric.kpis.retentionRate} className="h-2 mt-1" />
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">{metric.kpis.activationRate}%</div>
                        <p className="text-sm text-muted-foreground">Activation Rate</p>
                        <Progress value={metric.kpis.activationRate} className="h-2 mt-1" />
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">{metric.kpis.leadershipScore}%</div>
                        <p className="text-sm text-muted-foreground">Leadership Score</p>
                        <Progress value={metric.kpis.leadershipScore} className="h-2 mt-1" />
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">{metric.kpis.customerSatisfaction}%</div>
                        <p className="text-sm text-muted-foreground">Customer Satisfaction</p>
                        <Progress value={metric.kpis.customerSatisfaction} className="h-2 mt-1" />
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
