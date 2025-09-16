"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  ShoppingCart,
  UserCheck,
  Crown,
  Settings,
  BarChart3,
  Activity,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  Filter,
  Download,
  Share2,
  FileText,
  Calendar,
  TrendingDown
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { usePermissions } from '@/contexts/PermissionContext-simple'

// Mock data for comprehensive dashboard
const DASHBOARD_STATS = {
  users: {
    total: 15847,
    active: 12456,
    newThisMonth: 1234,
    growth: 12.5,
    byRole: {
      super_admin: 2,
      admin: 15,
      manager: 45,
      distributor: 3456,
      user: 12329
    }
  },
  revenue: {
    total: 2456789,
    thisMonth: 345678,
    growth: 18.3,
    bySource: {
      direct: 1234567,
      distributor: 890123,
      recurring: 332099
    }
  },
  orders: {
    total: 45678,
    pending: 234,
    processing: 567,
    completed: 44877,
    growth: 15.7
  },
  distributors: {
    total: 3456,
    active: 2890,
    topPerformers: 156,
    totalCommissions: 456789
  },
  systemHealth: {
    uptime: 99.8,
    errors: 12,
    warnings: 45,
    lastIncident: '2 days ago'
  }
}

const RECENT_ACTIVITIES = [
  { id: 1, type: 'user_registration', user: 'john.doe@email.com', timestamp: '2 minutes ago', severity: 'info' },
  { id: 2, type: 'large_order', user: 'distributor_premium', amount: '$15,432', timestamp: '15 minutes ago', severity: 'success' },
  { id: 3, type: 'permission_change', user: 'admin_sarah', action: 'Updated role permissions', timestamp: '1 hour ago', severity: 'warning' },
  { id: 4, type: 'system_alert', message: 'High server load detected', timestamp: '2 hours ago', severity: 'error' },
  { id: 5, type: 'commission_payout', amount: '$45,678', distributors: 234, timestamp: '4 hours ago', severity: 'success' }
]

const TOP_DISTRIBUTORS = [
  { id: 1, name: 'Sarah Johnson', email: 'sarah.j@email.com', revenue: '$45,678', commissions: '$4,567', rank: 'Diamond' },
  { id: 2, name: 'Mike Chen', email: 'mike.c@email.com', revenue: '$38,234', commissions: '$3,823', rank: 'Platinum' },
  { id: 3, name: 'Lisa Rodriguez', email: 'lisa.r@email.com', revenue: '$32,890', commissions: '$3,289', rank: 'Gold' },
  { id: 4, name: 'David Kim', email: 'david.k@email.com', revenue: '$28,456', commissions: '$2,845', rank: 'Silver' },
  { id: 5, name: 'Emma Wilson', email: 'emma.w@email.com', revenue: '$24,123', commissions: '$2,412', rank: 'Bronze' }
]

function StatCard({ title, value, subtitle, icon: Icon, trend, className = "" }: {
  title: string
  value: string | number
  subtitle?: string
  icon: any
  trend?: number
  className?: string
}) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{typeof value === 'number' ? value.toLocaleString() : value}</div>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        )}
        {trend && (
          <div className={`text-xs flex items-center mt-1 ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
            <TrendingUp className="h-3 w-3 mr-1" />
            {trend > 0 ? '+' : ''}{trend}% from last month
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function ActivityItem({ activity }: { activity: typeof RECENT_ACTIVITIES[0] }) {
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-500" />
      default: return <Activity className="h-4 w-4 text-blue-500" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'success': return 'border-l-green-500'
      case 'warning': return 'border-l-yellow-500'
      case 'error': return 'border-l-red-500'
      default: return 'border-l-blue-500'
    }
  }

  return (
    <div className={`flex items-start space-x-3 p-3 border-l-4 ${getSeverityColor(activity.severity)} bg-muted/30 rounded-r-lg`}>
      {getSeverityIcon(activity.severity)}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium truncate">
            {activity.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </p>
          <span className="text-xs text-muted-foreground flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            {activity.timestamp}
          </span>
        </div>
        <p className="text-xs text-muted-foreground">
          {activity.user && `User: ${activity.user}`}
          {activity.amount && ` • Amount: ${activity.amount}`}
          {activity.action && ` • ${activity.action}`}
          {activity.message && activity.message}
        </p>
      </div>
    </div>
  )
}

export function SuperAdminDashboard() {
  const { user } = useAuth()
  const { permissions, canViewAdminFeatures } = usePermissions()
  const [selectedTimeframe, setSelectedTimeframe] = useState('30d')
  const [selectedMetric, setSelectedMetric] = useState('revenue')

  if (!user || !canViewAdminFeatures) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">You don't have permission to view this content.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={DASHBOARD_STATS.users.total}
          subtitle={`${DASHBOARD_STATS.users.active} active users`}
          icon={Users}
          trend={DASHBOARD_STATS.users.growth}
        />
        <StatCard
          title="Revenue"
          value={`$${DASHBOARD_STATS.revenue.total.toLocaleString()}`}
          subtitle={`$${DASHBOARD_STATS.revenue.thisMonth.toLocaleString()} this month`}
          icon={DollarSign}
          trend={DASHBOARD_STATS.revenue.growth}
        />
        <StatCard
          title="Orders"
          value={DASHBOARD_STATS.orders.total}
          subtitle={`${DASHBOARD_STATS.orders.pending} pending`}
          icon={ShoppingCart}
          trend={DASHBOARD_STATS.orders.growth}
        />
        <StatCard
          title="Active Distributors"
          value={DASHBOARD_STATS.distributors.active}
          subtitle={`${DASHBOARD_STATS.distributors.total} total distributors`}
          icon={UserCheck}
          trend={8.2}
        />
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="distributors">Distributors</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  Recent Activity
                </CardTitle>
                <CardDescription>
                  Latest system events and user actions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {RECENT_ACTIVITIES.map((activity) => (
                  <ActivityItem key={activity.id} activity={activity} />
                ))}
              </CardContent>
            </Card>

            {/* Top Distributors */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Top Distributors
                </CardTitle>
                <CardDescription>
                  Highest performing distributors this month
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {TOP_DISTRIBUTORS.map((distributor, index) => (
                    <div key={distributor.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full text-sm font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{distributor.name}</p>
                          <p className="text-xs text-muted-foreground">{distributor.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{distributor.revenue}</p>
                        <Badge variant="outline" className="text-xs">
                          {distributor.rank}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>User Distribution by Role</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(DASHBOARD_STATS.users.byRole).map(([role, count]) => (
                    <div key={role} className="flex items-center justify-between">
                      <span className="capitalize">{role.replace('_', ' ')}</span>
                      <Badge variant="outline">{count.toLocaleString()}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Permission Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Super Admin</span>
                    <Badge variant="outline">Full Access</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Admin</span>
                    <Badge variant="outline">Business Access</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Manager</span>
                    <Badge variant="outline">Limited Access</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Affiliate</span>
                    <Badge variant="outline">Network Access</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Customer</span>
                    <Badge variant="outline">Basic Access</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Dashboard Widgets</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Revenue Analytics</span>
                    <Badge variant="default">Enabled</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">User Management</span>
                    <Badge variant="default">Enabled</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Network Overview</span>
                    <Badge variant="default">Enabled</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Commission Tracking</span>
                    <Badge variant="default">Enabled</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <StatCard
              title="Direct Sales"
              value={`$${DASHBOARD_STATS.revenue.bySource.direct.toLocaleString()}`}
              subtitle="50.2% of total revenue"
              icon={DollarSign}
              className="bg-green-50 border-green-200"
            />
            <StatCard
              title="Distributor Sales"
              value={`$${DASHBOARD_STATS.revenue.bySource.distributor.toLocaleString()}`}
              subtitle="36.3% of total revenue"
              icon={Users}
              className="bg-blue-50 border-blue-200"
            />
            <StatCard
              title="Recurring Revenue"
              value={`$${DASHBOARD_STATS.revenue.bySource.recurring.toLocaleString()}`}
              subtitle="13.5% of total revenue"
              icon={BarChart3}
              className="bg-purple-50 border-purple-200"
            />
          </div>
        </TabsContent>

        <TabsContent value="distributors" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Distributor Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Total Distributors</span>
                  <Badge variant="outline">{DASHBOARD_STATS.distributors.total}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Active This Month</span>
                  <Badge variant="outline">{DASHBOARD_STATS.distributors.active}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Top Performers</span>
                  <Badge variant="outline">{DASHBOARD_STATS.distributors.topPerformers}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Total Commissions Paid</span>
                  <Badge variant="outline">${DASHBOARD_STATS.distributors.totalCommissions.toLocaleString()}</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Commission Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {TOP_DISTRIBUTORS.map((distributor) => (
                    <div key={distributor.id} className="flex items-center justify-between">
                      <span className="text-sm">{distributor.name}</span>
                      <span className="font-medium">{distributor.commissions}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-4">
            <StatCard
              title="System Uptime"
              value={`${DASHBOARD_STATS.systemHealth.uptime}%`}
              subtitle="Last 30 days"
              icon={CheckCircle}
              className="bg-green-50 border-green-200"
            />
            <StatCard
              title="Active Errors"
              value={DASHBOARD_STATS.systemHealth.errors}
              subtitle="Requires attention"
              icon={AlertTriangle}
              className="bg-red-50 border-red-200"
            />
            <StatCard
              title="Warnings"
              value={DASHBOARD_STATS.systemHealth.warnings}
              subtitle="Monitoring required"
              icon={Eye}
              className="bg-yellow-50 border-yellow-200"
            />
            <StatCard
              title="Last Incident"
              value={DASHBOARD_STATS.systemHealth.lastIncident}
              subtitle="System status"
              icon={Clock}
              className="bg-blue-50 border-blue-200"
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
