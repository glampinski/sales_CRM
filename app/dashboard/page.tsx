"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  Target,
  Calendar,
  Phone,
  Mail,
  CheckSquare,
  Crown,
  Settings,
  Eye,
  BarChart3,
  Activity,
  Shield
} from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { usePermissions } from "@/contexts/PermissionContext"
import { PermissionGate } from "@/components/permission-gate"
import { SuperAdminDashboard } from "@/components/super-admin-dashboard"
import { SuperAdminPermissionManagement } from "@/components/super-admin-permission-management"

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
    value: "8,962",
    change: "+22.1%",
    trend: "up",
    icon: TrendingUp,
  },
]

const recentContacts = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah@example.com",
    phone: "+1 (555) 123-4567",
    status: "qualified",
    lastContact: "2 hours ago",
    avatar: "/placeholder-user.jpg",
  },
  {
    id: 2,
    name: "Mike Chen",
    email: "mike@example.com",
    phone: "+1 (555) 987-6543",
    status: "new",
    lastContact: "1 day ago",
    avatar: "/placeholder-user.jpg",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    email: "emily@example.com",
    phone: "+1 (555) 456-7890",
    status: "proposal",
    lastContact: "3 days ago",
    avatar: "/placeholder-user.jpg",
  },
]

const upcomingTasks = [
  {
    id: 1,
    title: "Follow up with Sarah Johnson",
    type: "call",
    dueTime: "2:00 PM",
    priority: "high",
  },
  {
    id: 2,
    title: "Send proposal to Mike Chen",
    type: "email",
    dueTime: "4:30 PM",
    priority: "medium",
  },
  {
    id: 3,
    title: "Team meeting preparation",
    type: "meeting",
    dueTime: "Tomorrow 9:00 AM",
    priority: "medium",
  },
]

const rankProgress = {
  current: "Silver",
  next: "Gold",
  progress: 75,
  requirements: {
    personalPV: { current: 1245, required: 1500 },
    teamPV: { current: 8962, required: 10000 },
  },
}

export default function DashboardPage() {
  const { user } = useAuth()
  const { getWidgetsForRole, hasModuleAccess } = usePermissions()
  
  if (!user) return null

  // Get widgets available for current user role
  const availableWidgets = getWidgetsForRole(user.role)
  
  // Check if user is super admin
  const isSuperAdmin = user.role === 'super_admin'

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center">
            {isSuperAdmin && <Crown className="h-8 w-8 text-yellow-500 mr-3" />}
            Dashboard
          </h1>
          <p className="text-muted-foreground">
            {isSuperAdmin 
              ? "Super Admin Control Center - Manage everything and control what users see"
              : "Welcome back! Here's what's happening with your business."
            }
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <PermissionGate module="customers" action="create">
            <Button>Add Contact</Button>
          </PermissionGate>
          <Button variant="outline">Create Task</Button>
        </div>
      </div>

      {/* Super Admin Interface */}
      {isSuperAdmin ? (
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>System Overview</span>
            </TabsTrigger>
            <TabsTrigger value="permissions" className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>Permission Control</span>
            </TabsTrigger>
            <TabsTrigger value="user-view" className="flex items-center space-x-2">
              <Eye className="h-4 w-4" />
              <span>User Dashboard Preview</span>
            </TabsTrigger>
            <TabsTrigger value="widgets" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Widget Management</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <SuperAdminDashboard />
          </TabsContent>

          <TabsContent value="permissions">
            <SuperAdminPermissionManagement />
          </TabsContent>

          <TabsContent value="user-view">
            <UserDashboardPreview />
          </TabsContent>

          <TabsContent value="widgets">
            <DashboardWidgetManagement />
          </TabsContent>
        </Tabs>
      ) : (
        /* Regular User Dashboard */
        <RoleBasedDashboard />
      )}
    </div>
  )
}

// Component for regular users (non-super admin)
function RoleBasedDashboard() {
  const { user } = useAuth()
  const { getWidgetsForRole, hasModuleAccess } = usePermissions()
  
  if (!user) return null
  
  const availableWidgets = getWidgetsForRole(user.role)

  return (
    <>
      {/* Role-specific Stats Grid */}
      <PermissionGate module="dashboard" action="view">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">{stat.change}</span> from last month
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </PermissionGate>

      {/* Role-based Widgets */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* MLM Rank Progress - Only for distributors */}
        <PermissionGate module="mlm" action="view">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Rank Progress</CardTitle>
              <CardDescription>
                Your path from {rankProgress.current} to {rankProgress.next}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Overall Progress</span>
                  <span>{rankProgress.progress}%</span>
                </div>
                <Progress value={rankProgress.progress} className="h-2" />
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Personal PV</span>
                  <Badge variant="outline">
                    {rankProgress.requirements.personalPV.current} / {rankProgress.requirements.personalPV.required}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Team PV</span>
                  <Badge variant="outline">
                    {rankProgress.requirements.teamPV.current} / {rankProgress.requirements.teamPV.required}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </PermissionGate>

        {/* Recent Contacts - Permission controlled */}
        <PermissionGate module="customers" action="view">
          <Card>
            <CardHeader>
              <CardTitle>Recent Contacts</CardTitle>
              <CardDescription>Latest people you've been in touch with</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentContacts.map((contact) => (
                  <div key={contact.id} className="flex items-center space-x-4">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={contact.avatar} />
                      <AvatarFallback>
                        {contact.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{contact.name}</p>
                      <div className="flex items-center space-x-2">
                        <Badge 
                          variant={contact.status === 'qualified' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {contact.status}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {contact.lastContact}
                        </span>
                      </div>
                    </div>
                    <PermissionGate module="customers" action="manage">
                      <div className="flex space-x-1">
                        <Button size="icon" variant="ghost" className="h-6 w-6">
                          <Phone className="h-3 w-3" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-6 w-6">
                          <Mail className="h-3 w-3" />
                        </Button>
                      </div>
                    </PermissionGate>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </PermissionGate>

        {/* Upcoming Tasks */}
        <Card>
          <CardHeader>
            <CardTitle>Today's Tasks</CardTitle>
            <CardDescription>Your schedule for today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingTasks.map((task) => (
                <div key={task.id} className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <CheckSquare className="h-4 w-4 text-muted-foreground" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">{task.title}</p>
                      <div className="flex items-center space-x-2">
                        <Badge 
                          variant={task.priority === 'high' ? 'destructive' : 'secondary'}
                          className="text-xs"
                        >
                          {task.priority}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {task.dueTime}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

// Component to show how dashboard looks for different roles
function UserDashboardPreview() {
  const { rolePermissions } = usePermissions()
  
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Dashboard Preview by Role</h2>
        <p className="text-muted-foreground">See how the dashboard appears to different user roles</p>
      </div>
      
      <Tabs defaultValue="admin" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="admin">Admin</TabsTrigger>
          <TabsTrigger value="manager">Manager</TabsTrigger>
          <TabsTrigger value="distributor">Distributor</TabsTrigger>
          <TabsTrigger value="user">User</TabsTrigger>
        </TabsList>

        {Object.entries(rolePermissions).filter(([role]) => role !== 'super_admin').map(([role, config]) => (
          <TabsContent key={role} value={role}>
            <Card>
              <CardHeader>
                <CardTitle className="capitalize">{role.replace('_', ' ')} Dashboard View</CardTitle>
                <CardDescription>{config.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <h4 className="font-medium mb-2">Available Modules</h4>
                      <div className="space-y-1">
                        {Object.entries(config.modules).filter(([_, module]) => module?.enabled).map(([moduleName]) => (
                          <Badge key={moduleName} variant="outline" className="mr-1 mb-1">
                            {moduleName}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Permissions</h4>
                      <p className="text-sm text-muted-foreground">
                        {config.permissions.length} total permissions
                      </p>
                      <div className="max-h-32 overflow-y-auto text-xs text-muted-foreground mt-2">
                        {config.permissions.slice(0, 10).join(', ')}
                        {config.permissions.length > 10 && '...'}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

// Component for managing dashboard widgets
function DashboardWidgetManagement() {
  const { dashboardWidgets, updateDashboardWidget, rolePermissions } = usePermissions()
  
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Dashboard Widget Management</h2>
        <p className="text-muted-foreground">Control which widgets appear for each user role</p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {dashboardWidgets.map((widget) => (
          <Card key={widget.id}>
            <CardHeader>
              <CardTitle className="text-base">{widget.name}</CardTitle>
              <CardDescription>{widget.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Global Enable</span>
                <Badge variant={widget.enabled ? "default" : "secondary"}>
                  {widget.enabled ? "Enabled" : "Disabled"}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <h5 className="text-sm font-medium">Role Visibility</h5>
                {Object.entries(rolePermissions).map(([role]) => {
                  const roleConfig = widget.roleSpecific?.[role as keyof typeof widget.roleSpecific]
                  const isEnabled = roleConfig?.enabled ?? widget.enabled
                  
                  return (
                    <div key={role} className="flex items-center justify-between">
                      <span className="text-xs capitalize">{role.replace('_', ' ')}</span>
                      <Badge variant={isEnabled ? "default" : "secondary"} className="text-xs">
                        {isEnabled ? "Visible" : "Hidden"}
                        {roleConfig?.variant && ` (${roleConfig.variant})`}
                      </Badge>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
