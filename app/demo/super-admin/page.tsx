"use client"

import React from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Crown, CheckCircle, Users, Shield, Settings, Eye } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { usePermissions } from '@/contexts/PermissionContext-simple'

const DEMO_FEATURES = [
  {
    id: 'comprehensive_dashboard',
    title: 'Comprehensive Super Admin Dashboard',
    description: 'Complete system overview with real-time metrics, user analytics, revenue breakdown, and system health monitoring',
    features: [
      'Real-time user statistics and role distribution',
      'Revenue analytics with source breakdown',
      'Top performer tracking and commission summaries',
      'System health monitoring and error tracking',
      'Recent activity feed with severity indicators'
    ]
  },
  {
    id: 'permission_management',
    title: 'Role-Based Permission Management',
    description: 'Granular control over what each role can access and perform throughout the system',
    features: [
      'Module-level access control (Dashboard, Users, Customers, etc.)',
      'Action-specific permissions (View, Create, Edit, Delete, etc.)',
      'Real-time permission updates across all user sessions',
      'Permission copying between roles',
      'Export/Import permission configurations'
    ]
  },
  {
    id: 'dashboard_widgets',
    title: 'Configurable Dashboard Widgets',
    description: 'Control which dashboard widgets are visible to different user roles',
    features: [
      'Role-specific widget visibility controls',
      'Widget variant customization (Full, Summary, Personal views)',
      'Drag-and-drop widget ordering',
      'Real-time widget configuration updates'
    ]
  },
  {
    id: 'hierarchical_access',
    title: 'Hierarchical Access Control',
    description: 'Super admin sees everything, with progressive restriction by role level',
    features: [
      'Super Admin: Complete system access and control',
      'Admin: Management access with user oversight',
      'Manager: Operational access with limited admin functions',
      'Distributor: MLM-focused features and personal data',
      'User: Basic access to products and personal orders'
    ]
  }
]

export default function SuperAdminDemoPage() {
  const { user } = useAuth()
  const permissions = usePermissions()

  // Simple demo metrics
  const totalPermissions = 25
  const enabledModules = 8  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <Crown className="h-8 w-8 text-yellow-500" />
          <h1 className="text-3xl font-bold">Super Admin Management Architecture</h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Complete role-based permission system where super admin controls what every user role can see and do across the entire application
        </p>
      </div>

      {/* Current User Status */}
      <Alert className="border-green-200 bg-green-50">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertTitle className="text-green-800">System Status</AlertTitle>
        <AlertDescription className="text-green-700">
          Logged in as <strong>{user?.name}</strong> ({user?.role?.replace('_', ' ')}) • 
          Permission system active with {totalPermissions} total permissions across {Object.keys(rolePermissions).length} roles
        </AlertDescription>
      </Alert>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">User Roles</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Object.keys(rolePermissions).length}</div>
            <p className="text-xs text-muted-foreground">Configured roles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Permissions</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPermissions}</div>
            <p className="text-xs text-muted-foreground">Across all roles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Access</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {user?.role === 'super_admin' ? 'Full' : 'Limited'}
            </div>
            <p className="text-xs text-muted-foreground">System access level</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Management</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Active</div>
            <p className="text-xs text-muted-foreground">Permission system</p>
          </CardContent>
        </Card>
      </div>

      {/* Features Overview */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Implemented Features</h2>
        
        <div className="grid gap-6 md:grid-cols-2">
          {DEMO_FEATURES.map((feature) => (
            <Card key={feature.id}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  {feature.title}
                </CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {feature.features.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <Badge variant="outline" className="mr-2 mt-0.5">✓</Badge>
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Role Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Role Permission Breakdown</CardTitle>
          <CardDescription>
            Overview of permissions assigned to each user role
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(rolePermissions).map(([role, config]) => (
              <div key={role} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium capitalize">{role.replace('_', ' ')}</h4>
                  <p className="text-sm text-muted-foreground">{config.description}</p>
                </div>
                <div className="text-right">
                  <Badge variant="outline">
                    {config.permissions.length} permissions
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">
                    {Object.values(config.modules).filter(m => m?.enabled).length} modules enabled
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4">
        <PermissionGate fallback={
          <Button disabled>
            <Crown className="h-4 w-4 mr-2" />
            Super Admin Required
          </Button>
        }>
          <Button asChild>
            <Link href="/dashboard/super-admin">
              <Crown className="h-4 w-4 mr-2" />
              Access Super Admin Dashboard
            </Link>
          </Button>
        </PermissionGate>
        
        <Button variant="outline" asChild>
          <Link href="/dashboard">
            <Eye className="h-4 w-4 mr-2" />
            View Standard Dashboard
          </Link>
        </Button>
      </div>
    </div>
  )
}
