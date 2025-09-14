"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  Target,
  Calendar,
  CheckSquare,
  Eye
} from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { SuperAdminDashboard } from "@/components/super-admin-dashboard"
import { SimpleGroupPermissions } from "@/components/simple-group-permissions"
import { CompactReferralSection } from "@/components/compact-referral-section"

// Mock data for dashboard
const stats = [
  {
    title: "Total Contacts",
    value: "2,847", 
    change: "+12.5%",
    trend: "up",
    icon: Users,
  },
  {
    title: "This Month Sales",
    value: "$45,231",
    change: "+8.2%", 
    trend: "up",
    icon: DollarSign,
  },
  {
    title: "Personal PV",
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

const recentActivities = [
  {
    id: 1,
    action: "New customer registered",
    customer: "Sarah Wilson",
    time: "2 hours ago",
    type: "registration"
  },
  {
    id: 2,
    action: "Order completed",
    customer: "John Smith", 
    amount: "$299",
    time: "4 hours ago",
    type: "order"
  },
  {
    id: 3,
    action: "Commission earned",
    amount: "$45.50",
    time: "6 hours ago",
    type: "commission"
  },
  {
    id: 4,
    action: "New team member",
    customer: "Emma Davis",
    time: "1 day ago",
    type: "team"
  },
]

const upcomingTasks = [
  {
    id: 1,
    task: "Follow up with potential customer",
    dueDate: "Today",
    priority: "high"
  },
  {
    id: 2,
    task: "Team training session",
    dueDate: "Tomorrow",
    priority: "medium"
  },
  {
    id: 3,
    task: "Monthly report review",
    dueDate: "Friday",
    priority: "low"
  },
]

export default function Dashboard() {
  const { user } = useAuth()

  // Simple role-based check
  const isSuperAdmin = user?.role === 'super_admin'

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Jan 20 - Feb 09
          </Button>
        </div>
      </div>

      {isSuperAdmin ? (
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="permissions">Group Permissions</TabsTrigger>
            <TabsTrigger value="preview">User Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <SuperAdminDashboard />
          </TabsContent>

          <TabsContent value="permissions" className="space-y-4">
            <SimpleGroupPermissions />
          </TabsContent>

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
      ) : (
        // Regular user dashboard
        <div className="space-y-6">
          {/* Stats Overview */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
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

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            {/* Recent Activity */}
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={`/avatars/0${activity.id}.png`} alt="Avatar" />
                        <AvatarFallback>
                          {activity.customer ? activity.customer.split(' ').map(n => n[0]).join('') : 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {activity.action}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {activity.customer && `${activity.customer} • `}
                          {activity.amount && `${activity.amount} • `}
                          {activity.time}
                        </p>
                      </div>
                      <div className="ml-auto font-medium">
                        <Badge variant={
                          activity.type === 'order' ? 'default' :
                          activity.type === 'commission' ? 'secondary' :
                          activity.type === 'registration' ? 'outline' : 'default'
                        }>
                          {activity.type}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Tasks */}
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckSquare className="h-5 w-5" />
                  Upcoming Tasks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingTasks.map((task) => (
                    <div key={task.id} className="flex items-center space-x-4">
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {task.task}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Due: {task.dueDate}
                        </p>
                      </div>
                      <Badge 
                        variant={
                          task.priority === 'high' ? 'destructive' :
                          task.priority === 'medium' ? 'default' : 'secondary'
                        }
                      >
                        {task.priority}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Referral Dashboard Section */}
          <CompactReferralSection 
            userId={user?.id || 'user_123'} 
            userEmail={user?.email || 'user@example.com'} 
          />
        </div>
      )}
    </div>
  )
}
