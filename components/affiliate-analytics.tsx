"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { 
  TrendingUp, 
  TrendingDown,
  Users, 
  Crown, 
  DollarSign,
  Target,
  Award,
  Activity,
  Calendar,
  Building2,
  Star,
  Zap,
  BarChart3,
  PieChart
} from "lucide-react"

interface AnalyticsData {
  overview: {
    totalDistributors: number
    activeDistributors: number
    newThisMonth: number
    growthRate: number
    totalVolume: number
    avgVolume: number
    topPerformers: number
    retentionRate: number
  }
  rankDistribution: {
    rank: string
    count: number
    percentage: number
    growth: number
  }[]
  performance: {
    topPerformers: {
      id: string
      name: string
      rank: string
      volume: number
      growth: number
    }[]
    newJoiners: {
      id: string
      name: string
      joinDate: string
      sponsor: string
      status: string
    }[]
    achievements: {
      id: string
      name: string
      achievement: string
      date: string
      type: string
    }[]
  }
  trends: {
    month: string
    newDistributors: number
    totalVolume: number
    avgCommission: number
    retentionRate: number
  }[]
}

// Mock analytics data
const mockAnalytics: AnalyticsData = {
  overview: {
    totalDistributors: 1247,
    activeDistributors: 1089,
    newThisMonth: 34,
    growthRate: 12.5,
    totalVolume: 2456789,
    avgVolume: 1970,
    topPerformers: 89,
    retentionRate: 87.3
  },
  rankDistribution: [
    { rank: "Diamond", count: 8, percentage: 0.6, growth: 2 },
    { rank: "Platinum", count: 23, percentage: 1.8, growth: 5 },
    { rank: "Gold", count: 58, percentage: 4.7, growth: 8 },
    { rank: "Silver", count: 187, percentage: 15.0, growth: 12 },
    { rank: "Bronze", count: 971, percentage: 77.9, growth: -3 }
  ],
  performance: {
    topPerformers: [
      { id: "1", name: "Sarah Johnson", rank: "Diamond", volume: 45789, growth: 23.5 },
      { id: "2", name: "Michael Chen", rank: "Platinum", volume: 38456, growth: 18.2 },
      { id: "3", name: "Emma Wilson", rank: "Platinum", volume: 34567, growth: 15.8 },
      { id: "4", name: "David Rodriguez", rank: "Gold", volume: 28934, growth: 22.1 },
      { id: "5", name: "Lisa Anderson", rank: "Diamond", volume: 67890, growth: 31.4 }
    ],
    newJoiners: [
      { id: "1", name: "Jennifer Brown", joinDate: "2025-09-10", sponsor: "Sarah Johnson", status: "pending" },
      { id: "2", name: "Robert Taylor", joinDate: "2025-09-08", sponsor: "Michael Chen", status: "active" },
      { id: "3", name: "Amanda Davis", joinDate: "2025-09-05", sponsor: "Emma Wilson", status: "active" },
      { id: "4", name: "Carlos Martinez", joinDate: "2025-09-03", sponsor: "David Rodriguez", status: "pending" },
      { id: "5", name: "Maria Garcia", joinDate: "2025-09-01", sponsor: "Lisa Anderson", status: "active" }
    ],
    achievements: [
      { id: "1", name: "Sarah Johnson", achievement: "Reached Diamond Rank", date: "2025-09-12", type: "rank" },
      { id: "2", name: "Michael Chen", achievement: "100K Volume Milestone", date: "2025-09-10", type: "volume" },
      { id: "3", name: "Emma Wilson", achievement: "Top Recruiter Award", date: "2025-09-08", type: "recruitment" },
      { id: "4", name: "David Rodriguez", achievement: "Leadership Excellence", date: "2025-09-05", type: "leadership" },
      { id: "5", name: "Lisa Anderson", achievement: "Mentor of the Month", date: "2025-09-01", type: "mentorship" }
    ]
  },
  trends: [
    { month: "Sep 2025", newDistributors: 34, totalVolume: 2456789, avgCommission: 1247, retentionRate: 87.3 },
    { month: "Aug 2025", newDistributors: 28, totalVolume: 2234567, avgCommission: 1189, retentionRate: 85.7 },
    { month: "Jul 2025", newDistributors: 31, totalVolume: 2345678, avgCommission: 1203, retentionRate: 86.2 },
    { month: "Jun 2025", newDistributors: 25, totalVolume: 2123456, avgCommission: 1156, retentionRate: 84.9 },
    { month: "May 2025", newDistributors: 29, totalVolume: 2098765, avgCommission: 1134, retentionRate: 83.4 },
    { month: "Apr 2025", newDistributors: 22, totalVolume: 1987654, avgCommission: 1098, retentionRate: 82.1 }
  ]
}

const getRankColor = (rank: string) => {
  switch (rank) {
    case "Diamond": return "bg-blue-500 text-white"
    case "Platinum": return "bg-gray-400 text-white"
    case "Gold": return "bg-yellow-500 text-white"
    case "Silver": return "bg-gray-300 text-black"
    case "Bronze": return "bg-orange-600 text-white"
    default: return "bg-gray-200 text-black"
  }
}

const getAchievementIcon = (type: string) => {
  switch (type) {
    case "rank": return Crown
    case "volume": return TrendingUp
    case "recruitment": return Users
    case "leadership": return Award
    case "mentorship": return Star
    default: return Target
  }
}

export function DistributorAnalytics() {
  const { overview, rankDistribution, performance, trends } = mockAnalytics

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Distributor Analytics</h2>
        <p className="text-muted-foreground">
          Comprehensive insights into your distributor network performance
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Distributors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview.totalDistributors.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+{overview.newThisMonth}</span> new this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Rate</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {((overview.activeDistributors / overview.totalDistributors) * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              {overview.activeDistributors} of {overview.totalDistributors} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(overview.totalVolume / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+{overview.growthRate}%</span> growth rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Retention Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview.retentionRate}%</div>
            <p className="text-xs text-muted-foreground">
              Monthly retention rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="distribution" className="space-y-4">
        <TabsList>
          <TabsTrigger value="distribution">Rank Distribution</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="distribution" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Rank Distribution</CardTitle>
                <CardDescription>
                  Distribution of distributors across different ranks
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {rankDistribution.map((rank) => (
                  <div key={rank.rank} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <Badge className={getRankColor(rank.rank)}>
                          {rank.rank}
                        </Badge>
                        <span>{rank.count} distributors</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span>{rank.percentage}%</span>
                        {rank.growth > 0 ? (
                          <div className="flex items-center text-green-600">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            <span className="text-xs">+{rank.growth}</span>
                          </div>
                        ) : rank.growth < 0 ? (
                          <div className="flex items-center text-red-600">
                            <TrendingDown className="h-3 w-3 mr-1" />
                            <span className="text-xs">{rank.growth}</span>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">±0</span>
                        )}
                      </div>
                    </div>
                    <Progress value={rank.percentage} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Growth Analysis</CardTitle>
                <CardDescription>
                  Rank advancement trends and growth patterns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4" />
                  <p>Growth chart visualization</p>
                  <p className="text-sm">Detailed growth analytics will be displayed here</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Top Performers</CardTitle>
                <CardDescription>
                  Highest performing distributors this month
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {performance.topPerformers.map((performer, index) => (
                    <div key={performer.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted">
                          <span className="text-sm font-medium">#{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-medium">{performer.name}</p>
                          <Badge className={getRankColor(performer.rank)} variant="secondary">
                            {performer.rank}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${performer.volume.toLocaleString()}</p>
                        <p className="text-sm text-green-600">+{performer.growth}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>New Joiners</CardTitle>
                <CardDescription>
                  Recent distributor additions to the network
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {performance.newJoiners.map((joiner) => (
                    <div key={joiner.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{joiner.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Sponsored by {joiner.sponsor}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge variant={joiner.status === "active" ? "default" : "secondary"}>
                          {joiner.status}
                        </Badge>
                        <p className="text-xs text-muted-foreground">
                          {new Date(joiner.joinDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Trends</CardTitle>
              <CardDescription>
                6-month trend analysis of key metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Month</TableHead>
                    <TableHead>New Distributors</TableHead>
                    <TableHead>Total Volume</TableHead>
                    <TableHead>Avg Commission</TableHead>
                    <TableHead>Retention Rate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trends.map((trend, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{trend.month}</TableCell>
                      <TableCell>{trend.newDistributors}</TableCell>
                      <TableCell>${(trend.totalVolume / 1000000).toFixed(1)}M</TableCell>
                      <TableCell>${trend.avgCommission.toLocaleString()}</TableCell>
                      <TableCell>{trend.retentionRate}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Achievements</CardTitle>
              <CardDescription>
                Latest milestones and accomplishments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {performance.achievements.map((achievement) => {
                  const IconComponent = getAchievementIcon(achievement.type)
                  return (
                    <div key={achievement.id} className="flex items-center space-x-4 p-3 border rounded-lg">
                      <IconComponent className="h-8 w-8 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="font-medium">{achievement.name}</p>
                        <p className="text-sm text-muted-foreground">{achievement.achievement}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {new Date(achievement.date).toLocaleDateString()}
                        </p>
                        <Badge variant="outline" className="text-xs">
                          {achievement.type}
                        </Badge>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
