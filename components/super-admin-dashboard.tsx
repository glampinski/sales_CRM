"use client"

import React, { useState } from 'react'
import { useTranslations } from 'next-intl'
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
  { id: 1, type: 'user_registration', user: 'Sarah Wilson', timestamp: '2 ore fa', severity: 'info' },
  { id: 2, type: 'large_order', user: 'John Smith', amount: '$299', timestamp: '4 ore fa', severity: 'success' },
  { id: 3, type: 'commission_earned', amount: '$45.50', timestamp: '6 ore fa', severity: 'success' },
  { id: 4, type: 'new_team_member', user: 'Emma Davis', timestamp: '1 giorno fa', severity: 'info' },
  { id: 5, type: 'commission_payout', amount: '$45,678', distributors: 234, timestamp: '4 ore fa', severity: 'success' }
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
  const tAdmin = useTranslations('dashboard.admin.overview')
  
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
            {trend > 0 ? '+' : ''}{trend}% {tAdmin('metrics.fromLastMonth')}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function ActivityItem({ activity }: { activity: typeof RECENT_ACTIVITIES[0] }) {
  const tAdmin = useTranslations('dashboard.admin.overview')
  
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

  const getActivityTypeLabel = (type: string) => {
    try {
      return tAdmin(`recentActivity.types.${type}`)
    } catch {
      // Fallback to formatted English if translation is missing
      return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
    }
  }

  const getActionLabel = (action: string) => {
    try {
      return tAdmin(`recentActivity.actions.${action.toLowerCase().replace(/\s+/g, '_')}`)
    } catch {
      return action
    }
  }

  return (
    <div className={`flex items-start space-x-3 p-3 border-l-4 ${getSeverityColor(activity.severity)} bg-muted/30 rounded-r-lg`}>
      {getSeverityIcon(activity.severity)}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium truncate">
            {getActivityTypeLabel(activity.type)}
          </p>
          <span className="text-xs text-muted-foreground flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            {activity.timestamp}
          </span>
        </div>
        <p className="text-xs text-muted-foreground">
          {activity.user && `${tAdmin('recentActivity.labels.user')}: ${activity.user}`}
          {activity.amount && ` • ${tAdmin('recentActivity.labels.amount')}: ${activity.amount}`}
        </p>
      </div>
    </div>
  )
}

export function SuperAdminDashboard() {
  const { user } = useAuth()
  const { permissions, canViewAdminFeatures } = usePermissions()
  const tAdmin = useTranslations('dashboard.admin.overview')
  const [selectedTimeframe, setSelectedTimeframe] = useState('30d')
  const [selectedMetric, setSelectedMetric] = useState('revenue')

  if (!user || !canViewAdminFeatures) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">{tAdmin('noPermission')}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title={tAdmin('metrics.totalUsers')}
          value={DASHBOARD_STATS.users.total}
          subtitle={tAdmin('metrics.activeUsers', { count: DASHBOARD_STATS.users.active })}
          icon={Users}
          trend={DASHBOARD_STATS.users.growth}
        />
        <StatCard
          title={tAdmin('metrics.revenue')}
          value={`$${DASHBOARD_STATS.revenue.total.toLocaleString()}`}
          subtitle={tAdmin('metrics.thisMonth', { amount: DASHBOARD_STATS.revenue.thisMonth.toLocaleString() })}
          icon={DollarSign}
          trend={DASHBOARD_STATS.revenue.growth}
        />
        <StatCard
          title={tAdmin('metrics.orders')}
          value={DASHBOARD_STATS.orders.total}
          subtitle={tAdmin('metrics.pending', { count: DASHBOARD_STATS.orders.pending })}
          icon={ShoppingCart}
          trend={DASHBOARD_STATS.orders.growth}
        />
        <StatCard
          title={tAdmin('metrics.activeDistributors')}
          value={DASHBOARD_STATS.distributors.active}
          subtitle={tAdmin('metrics.totalDistributors', { count: DASHBOARD_STATS.distributors.total })}
          icon={UserCheck}
          trend={8.2}
        />
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">{tAdmin('tabs.overview')}</TabsTrigger>
          <TabsTrigger value="users">{tAdmin('tabs.users')}</TabsTrigger>
          <TabsTrigger value="revenue">{tAdmin('tabs.revenue')}</TabsTrigger>
          <TabsTrigger value="distributors">{tAdmin('tabs.distributors')}</TabsTrigger>
          <TabsTrigger value="system">{tAdmin('tabs.system')}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  {tAdmin('recentActivity.title')}
                </CardTitle>
                <CardDescription>
                  {tAdmin('recentActivity.description')}
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
                  {tAdmin('topDistributors.title')}
                </CardTitle>
                <CardDescription>
                  {tAdmin('topDistributors.description')}
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
                <CardTitle>{tAdmin('userDistribution.title')}</CardTitle>
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
                <CardTitle>{tAdmin('permissions.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>{tAdmin('userDistribution.superAdmin')}</span>
                    <Badge variant="outline">{tAdmin('permissions.fullAccess')}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>{tAdmin('userDistribution.admin')}</span>
                    <Badge variant="outline">{tAdmin('permissions.businessAccess')}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>{tAdmin('userDistribution.manager')}</span>
                    <Badge variant="outline">{tAdmin('permissions.limitedAccess')}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>{tAdmin('permissions.affiliate')}</span>
                    <Badge variant="outline">{tAdmin('permissions.networkAccess')}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>{tAdmin('permissions.customer')}</span>
                    <Badge variant="outline">{tAdmin('permissions.basicAccess')}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{tAdmin('widgets.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{tAdmin('widgets.revenueAnalytics')}</span>
                    <Badge variant="default">{tAdmin('widgets.enabled')}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{tAdmin('widgets.userManagement')}</span>
                    <Badge variant="default">{tAdmin('widgets.enabled')}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{tAdmin('widgets.networkAnalytics')}</span>
                    <Badge variant="default">{tAdmin('widgets.enabled')}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{tAdmin('widgets.commissionTracking')}</span>
                    <Badge variant="default">{tAdmin('widgets.enabled')}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <StatCard
              title={tAdmin('revenue.directSales')}
              value={`$${DASHBOARD_STATS.revenue.bySource.direct.toLocaleString()}`}
              subtitle={`50.2% ${tAdmin('revenue.ofTotalRevenue')}`}
              icon={DollarSign}
              className="bg-green-50 border-green-200"
            />
            <StatCard
              title={tAdmin('revenue.distributorSales')}
              value={`$${DASHBOARD_STATS.revenue.bySource.distributor.toLocaleString()}`}
              subtitle={`36.3% ${tAdmin('revenue.ofTotalRevenue')}`}
              icon={Users}
              className="bg-blue-50 border-blue-200"
            />
            <StatCard
              title={tAdmin('revenue.recurringRevenue')}
              value={`$${DASHBOARD_STATS.revenue.bySource.recurring.toLocaleString()}`}
              subtitle={`13.5% ${tAdmin('revenue.ofTotalRevenue')}`}
              icon={BarChart3}
              className="bg-purple-50 border-purple-200"
            />
          </div>
        </TabsContent>

        <TabsContent value="distributors" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>{tAdmin('distributorStats.title')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>{tAdmin('distributorStats.totalDistributors')}</span>
                  <Badge variant="outline">{DASHBOARD_STATS.distributors.total}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>{tAdmin('distributorStats.activeThisMonth')}</span>
                  <Badge variant="outline">{DASHBOARD_STATS.distributors.active}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>{tAdmin('distributorStats.topPerformers')}</span>
                  <Badge variant="outline">{DASHBOARD_STATS.distributors.topPerformers}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>{tAdmin('distributorStats.totalCommissionsPaid')}</span>
                  <Badge variant="outline">${DASHBOARD_STATS.distributors.totalCommissions.toLocaleString()}</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{tAdmin('commissionBreakdown.title')}</CardTitle>
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
              title={tAdmin('systemHealth.systemUptime')}
              value={`${DASHBOARD_STATS.systemHealth.uptime}%`}
              subtitle={tAdmin('systemHealth.subtitles.last30Days')}
              icon={CheckCircle}
              className="bg-green-50 border-green-200"
            />
            <StatCard
              title={tAdmin('systemHealth.activeErrors')}
              value={DASHBOARD_STATS.systemHealth.errors}
              subtitle={tAdmin('systemHealth.subtitles.requiresAttention')}
              icon={AlertTriangle}
              className="bg-red-50 border-red-200"
            />
            <StatCard
              title={tAdmin('systemHealth.warnings')}
              value={DASHBOARD_STATS.systemHealth.warnings}
              subtitle={tAdmin('systemHealth.subtitles.monitoringRequired')}
              icon={Eye}
              className="bg-yellow-50 border-yellow-200"
            />
            <StatCard
              title={tAdmin('systemHealth.lastIncident')}
              value={DASHBOARD_STATS.systemHealth.lastIncident}
              subtitle={tAdmin('systemHealth.subtitles.systemStatus')}
              icon={Clock}
              className="bg-blue-50 border-blue-200"
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
