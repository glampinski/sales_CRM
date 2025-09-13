"use client"

import { useState } from "react"
import { BarChart, LineChart, PieChart, TrendingUp, TrendingDown, Calendar, Download, Filter, Eye, DollarSign, Users, ShoppingCart, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// Mock analytics data
const overviewStats = [
  { 
    label: "Total Revenue", 
    value: "$45,678.90", 
    change: "+18.2%", 
    trend: "up",
    icon: DollarSign,
    description: "Total sales revenue this month"
  },
  { 
    label: "Active Customers", 
    value: "1,247", 
    change: "+12.5%", 
    trend: "up",
    icon: Users,
    description: "Customers who made purchases"
  },
  { 
    label: "Orders Processed", 
    value: "892", 
    change: "+8.7%", 
    trend: "up",
    icon: ShoppingCart,
    description: "Total orders fulfilled"
  },
  { 
    label: "Products Sold", 
    value: "2,156", 
    change: "-3.2%", 
    trend: "down",
    icon: Package,
    description: "Individual product units sold"
  },
]

const salesData = [
  { period: "Jan", revenue: 28000, orders: 245, customers: 189 },
  { period: "Feb", revenue: 32000, orders: 278, customers: 201 },
  { period: "Mar", revenue: 35000, orders: 312, customers: 234 },
  { period: "Apr", revenue: 38000, orders: 356, customers: 267 },
  { period: "May", revenue: 42000, orders: 389, customers: 298 },
  { period: "Jun", revenue: 45678, orders: 425, customers: 324 },
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

const regionalData = [
  { region: "North America", customers: 456, revenue: 23456.78, growth: 15.2 },
  { region: "Europe", customers: 234, revenue: 12345.67, growth: 8.7 },
  { region: "Asia Pacific", customers: 189, revenue: 8901.23, growth: 22.1 },
  { region: "South America", customers: 67, revenue: 3456.78, growth: 5.3 },
]

export default function ReportsPage() {
  const [timeRange, setTimeRange] = useState("30d")
  const [reportType, setReportType] = useState("overview")

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
          <p className="text-muted-foreground">
            Comprehensive business insights and performance metrics
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

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {overviewStats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className={stat.trend === "up" ? "text-green-600" : "text-red-600"}>
                  {stat.trend === "up" ? "↑" : "↓"} {stat.change}
                </span>{" "}
                from last period
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Report Tabs */}
      <Tabs value={reportType} onValueChange={setReportType} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="commission">Commission</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Sales Trend Chart Placeholder */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
                <CardDescription>Monthly revenue performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <LineChart className="h-12 w-12 mx-auto mb-4" />
                    <p>Revenue trend chart</p>
                    <p className="text-sm">Interactive chart will be displayed here</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Customer Growth */}
            <Card>
              <CardHeader>
                <CardTitle>Customer Growth</CardTitle>
                <CardDescription>New customer acquisition over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <BarChart className="h-12 w-12 mx-auto mb-4" />
                    <p>Customer growth chart</p>
                    <p className="text-sm">Acquisition metrics will be displayed here</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Insights */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Best Performing Day</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Tuesday</div>
                <p className="text-sm text-muted-foreground">Average: {formatCurrency(1847.23)} in sales</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Average Order Value</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(156.78)}</div>
                <p className="text-sm text-muted-foreground">
                  <span className="text-green-600">+12.3%</span> from last month
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Customer Retention</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">84.5%</div>
                <p className="text-sm text-muted-foreground">
                  <span className="text-green-600">+2.1%</span> improvement
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sales" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Sales Performance Table */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Sales Performance</CardTitle>
                <CardDescription>Revenue, orders, and customer trends</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Month</TableHead>
                      <TableHead>Revenue</TableHead>
                      <TableHead>Orders</TableHead>
                      <TableHead>Customers</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {salesData.map((data) => (
                      <TableRow key={data.period}>
                        <TableCell className="font-medium">{data.period}</TableCell>
                        <TableCell>{formatCurrency(data.revenue)}</TableCell>
                        <TableCell>{data.orders}</TableCell>
                        <TableCell>{data.customers}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Regional Performance */}
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

        <TabsContent value="products" className="space-y-6">
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
        </TabsContent>

        <TabsContent value="customers" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Customer Segments */}
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

            {/* Customer Lifecycle */}
            <Card>
              <CardHeader>
                <CardTitle>Customer Lifecycle</CardTitle>
                <CardDescription>Customer journey and retention metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <PieChart className="h-12 w-12 mx-auto mb-4" />
                    <p>Customer lifecycle chart</p>
                    <p className="text-sm">Lifecycle analysis will be displayed here</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="commission" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
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

            {/* Team Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Team Performance</CardTitle>
                <CardDescription>Top performing team members</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: "Sarah Johnson", rank: "Gold", commission: 2345.67 },
                    { name: "David Wilson", rank: "Silver", commission: 1789.23 },
                    { name: "Mike Chen", rank: "Bronze", commission: 1234.56 },
                    { name: "Emily Rodriguez", rank: "Bronze", commission: 987.65 },
                  ].map((member, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded-lg">
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <Badge variant="outline" className="text-xs">{member.rank}</Badge>
                      </div>
                      <p className="font-medium text-green-600">
                        {formatCurrency(member.commission)}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
