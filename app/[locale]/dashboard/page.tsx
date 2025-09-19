"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  Target,
  Calendar,
  CheckSquare,
  Eye,
  Download,
  Building2,
  ShoppingCart,
  Package,
  BarChart,
  LineChart,
  PieChart,
  Crown
} from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { SuperAdminDashboard } from "@/components/super-admin-dashboard"
import { SimpleGroupPermissions } from "@/components/simple-group-permissions"
import { CompactReferralSection } from "@/components/compact-referral-section"
import { usePermissions } from "@/contexts/PermissionContext-simple"

// Business Analytics Data
const businessStats = [
  {
    title: "Total Revenue",
    value: "$45,678", 
    change: "+18.2%",
    trend: "up",
    icon: DollarSign,
  },
  {
    title: "Active Customers",
    value: "1,247",
    change: "+12.5%", 
    trend: "up",
    icon: Users,
  },
  {
    title: "Orders Processed",
    value: "892",
    change: "+8.7%",
    trend: "up",
    icon: ShoppingCart,
  },
  {
    title: "Products Sold",
    value: "2,156",
    change: "-3.2%",
    trend: "down", 
    icon: Package,
  },
]

// Network Analytics Data
const networkStats = [
  {
    title: "Team Members",
    value: "2,847", 
    change: "+12.5%",
    trend: "up",
    icon: Users,
  },
  {
    title: "Total Commission",
    value: "$23,381",
    change: "+15.8%", 
    trend: "up",
    icon: DollarSign,
  },
  {
    title: "Personal Volume",
    value: "1,245",
    change: "+15.3%",
    trend: "up",
    icon: Target,
  },
  {
    title: "Team Volume",
    value: "8,932",
    change: "+23.1%",
    trend: "up", 
    icon: TrendingUp,
  },
]

const topProducts = [
  { name: "Wellness Pack Premium", sales: 156, revenue: 14043.44, growth: 23.5 },
  { name: "Beauty Essentials Set", sales: 134, revenue: 17419.66, growth: 18.2 },
  { name: "Fitness Boost Formula", sales: 298, revenue: 13704.02, growth: 15.8 },
  { name: "Complete Nutrition Bundle", sales: 67, revenue: 13399.33, growth: 12.1 },
  { name: "Organic Green Tea Extract", sales: 189, revenue: 5667.11, growth: -5.3 },
]

const customerSegments = [
  { segment: "VIP Customers", count: 45, percentage: 18.2, revenue: 15234.56 },
  { segment: "Gold Customers", count: 89, percentage: 36.1, revenue: 18567.89 },
  { segment: "Standard Customers", count: 113, percentage: 45.7, revenue: 11876.45 },
]

const commissionMetrics = [
  { type: "Retail Profit", amount: 8234.56, percentage: 35.2 },
  { type: "Team Bonus", amount: 6789.12, percentage: 29.1 },
  { type: "Leadership Bonus", amount: 4567.89, percentage: 19.5 },
  { type: "Rank Bonus", amount: 3789.45, percentage: 16.2 },
]

const teamPerformance = [
  { name: "Sarah Johnson", rank: "Gold", commission: 2345.67, teamSize: 45, volume: 12500 },
  { name: "David Wilson", rank: "Silver", commission: 1789.23, teamSize: 32, volume: 8900 },
  { name: "Mike Chen", rank: "Bronze", commission: 1234.56, teamSize: 28, volume: 7200 },
  { name: "Emily Rodriguez", rank: "Bronze", commission: 987.65, teamSize: 19, volume: 5400 },
]

const regionalData = [
  { region: "North America", customers: 456, revenue: 23456.78, growth: 15.2, teamMembers: 89 },
  { region: "Europe", customers: 234, revenue: 12345.67, growth: 8.7, teamMembers: 54 },
  { region: "Asia Pacific", customers: 189, revenue: 8901.23, growth: 22.1, teamMembers: 67 },
  { region: "South America", customers: 67, revenue: 3456.78, growth: 5.3, teamMembers: 23 },
]

export default function Dashboard() {
  const { user } = useAuth()
  const permissions = usePermissions()
  const [timeRange, setTimeRange] = useState("30d")
  const [activeView, setActiveView] = useState("overview")

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`
  }

  // Unified Dashboard for All Users with Permission-Based Visibility
  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Complete business overview and analytics
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Unified Navigation with All Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          
          {/* Business Tab - Show for all users who can view business data */}
          {permissions.hasModuleAccess('business') && (
            <TabsTrigger value="business">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Business
            </TabsTrigger>
          )}
          
          {/* Network Tab - Show for users who can view network data */}
          {permissions.hasModuleAccess('network') && (
            <TabsTrigger value="network">
              <Building2 className="h-4 w-4 mr-2" />
              Network
            </TabsTrigger>
          )}
          
          {/* Admin Tabs - Show for users with admin permissions */}
          {permissions.hasModuleAccess('admin') && (
            <>
              <TabsTrigger value="admin">Admin Overview</TabsTrigger>
              <TabsTrigger value="permissions">Group Permissions</TabsTrigger>
              <TabsTrigger value="preview">User Preview</TabsTrigger>
            </>
          )}
        </TabsList>

        {/* Overview Tab Content */}
        <TabsContent value="overview" className="space-y-6">
          {/* Quick Stats Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$45,678</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+18.2%</span> from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Team Members</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,847</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+12.5%</span> from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,247</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+12.5%</span> from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Commission</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$23,381</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+15.8%</span> from last month
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity & Quick Insights */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { action: "New customer registered", customer: "Sarah Wilson", time: "2 hours ago", type: "registration" },
                    { action: "Order completed", customer: "John Smith", amount: "$299", time: "4 hours ago", type: "order" },
                    { action: "Commission earned", amount: "$45.50", time: "6 hours ago", type: "commission" },
                    { action: "New team member", customer: "Emma Davis", time: "1 day ago", type: "team" },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{activity.action}</p>
                        <p className="text-sm text-muted-foreground">
                          {activity.customer && `${activity.customer} • `}
                          {activity.amount && `${activity.amount} • `}
                          {activity.time}
                        </p>
                      </div>
                      <Badge variant="outline">{activity.type}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="font-medium">Best Performing Day</p>
                  <p className="text-2xl font-bold">Tuesday</p>
                  <p className="text-sm text-muted-foreground">Average: $1,847 in sales</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="font-medium">Average Order Value</p>
                  <p className="text-2xl font-bold">$156.78</p>
                  <p className="text-sm text-green-600">+12.3% from last month</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="font-medium">Customer Retention</p>
                  <p className="text-2xl font-bold">84.5%</p>
                  <p className="text-sm text-green-600">+2.1% improvement</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Referral Dashboard Section - Permission-based instead of role-based */}
          {permissions.hasModuleAccess('referrals') && (
            <CompactReferralSection 
              userId={user?.id || 'user_123'} 
              userEmail={user?.email || 'user@example.com'}
              userRole={user?.role}
            />
          )}
        </TabsContent>

        {/* Business Tab Content */}
        <TabsContent value="business" className="space-y-6">
          {/* Business Stats */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {businessStats.map((stat, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <stat.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className={stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                      {stat.change}
                    </span>
                    {' '}from last month
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Product Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Products</CardTitle>
              <CardDescription>Best-selling products and revenue contributors</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Units Sold</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Growth</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topProducts.map((product, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.sales}</TableCell>
                      <TableCell>{formatCurrency(product.revenue)}</TableCell>
                      <TableCell>
                        <span className={product.growth >= 0 ? "text-green-600" : "text-red-600"}>
                          {formatPercentage(product.growth)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={product.growth >= 0 ? "default" : "secondary"}>
                          {product.growth >= 0 ? "Growing" : "Declining"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Customer Segments & Regional Data */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Customer Segments</CardTitle>
                <CardDescription>Customer distribution by tier</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {customerSegments.map((segment, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{segment.segment}</span>
                        <span className="text-sm text-muted-foreground">
                          {segment.count} ({segment.percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${segment.percentage}%` }}
                        />
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Revenue: {formatCurrency(segment.revenue)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Regional Performance</CardTitle>
                <CardDescription>Sales by geographic region</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {regionalData.map((region, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium">{region.region}</p>
                        <p className="text-sm text-muted-foreground">{region.customers} customers</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(region.revenue)}</p>
                        <p className="text-sm text-green-600">{formatPercentage(region.growth)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Network Tab Content */}
        <TabsContent value="network" className="space-y-6">
          {/* Network Stats */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {networkStats.map((stat, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <stat.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className={stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                      {stat.change}
                    </span>
                    {' '}from last month
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Commission Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Commission Breakdown</CardTitle>
              <CardDescription>Commission distribution by type</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {commissionMetrics.map((metric, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium">{metric.type}</p>
                      <p className="text-sm text-muted-foreground">{metric.percentage}% of total</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-green-600">
                        {formatCurrency(metric.amount)}
                      </p>
                    </div>
                  </div>
                ))}
                <div className="border-t pt-3 mt-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Total Commission</span>
                    <span className="text-lg font-bold text-green-600">
                      {formatCurrency(commissionMetrics.reduce((sum, metric) => sum + metric.amount, 0))}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Team Performance & Network Insights */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Top Team Performers</CardTitle>
                <CardDescription>Highest earning team members</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {teamPerformance.map((member, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="text-xs">
                              <Crown className="h-3 w-3 mr-1" />
                              {member.rank}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {member.teamSize} team • {formatCurrency(member.volume)} volume
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="font-medium text-green-600">
                        {formatCurrency(member.commission)}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Network Distribution</CardTitle>
                <CardDescription>Team members by region</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {regionalData.map((region, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{region.region}</span>
                        <span className="text-sm text-muted-foreground">
                          {region.teamMembers} members
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${(region.teamMembers / 233) * 100}%` }}
                        />
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Revenue: {formatCurrency(region.revenue)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Admin Overview Tab Content */}
        <TabsContent value="admin" className="space-y-4">
          <SuperAdminDashboard />
        </TabsContent>

        {/* Group Permissions Tab Content */}
        <TabsContent value="permissions" className="space-y-4">
          <SimpleGroupPermissions />
        </TabsContent>

        {/* User Preview Tab Content */}
        <TabsContent value="preview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                User View Preview
              </CardTitle>
              <CardDescription>
                See how different user groups will see the dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Select a user group to preview their dashboard view...
              </p>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  )
}
