"use client"

import React from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Crown, CheckCircle, Users, Shield, Settings, Eye, Home, Building2, CheckSquare, TrendingUp, DollarSign, FileText, CreditCard, Wallet, Megaphone, PieChart, BookOpen, HeadphonesIcon, MessageSquare, Bell, UserCog } from 'lucide-react'
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
  const enabledModules = 8

  return (
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
          Granular permission system active with 10+ permission categories across dashboard, users, products, and system access
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
            <div className="text-2xl font-bold">5</div>
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
              {permissions.canViewAdminFeatures ? 'Full' : 'Limited'}
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

      {/* Permission Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Complete Granular Permission System</CardTitle>
          <CardDescription>
            Live permission breakdown showing ALL modules and capabilities per role
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Dashboard Permissions */}
            <div>
              <h4 className="font-medium mb-3 flex items-center">
                <Home className="h-4 w-4 mr-2" />
                Dashboard Permissions
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                <div className="p-2 border rounded">
                  <p className="font-medium">Overview</p>
                  <p className="text-xs text-green-600">✓ All Roles</p>
                </div>
                <div className="p-2 border rounded">
                  <p className="font-medium">Business</p>
                  <p className="text-xs text-green-600">✓ Manager+</p>
                </div>
                <div className="p-2 border rounded">
                  <p className="font-medium">Network</p>
                  <p className="text-xs text-green-600">✓ Affiliate+</p>
                </div>
                <div className="p-2 border rounded">
                  <p className="font-medium">Admin Stats</p>
                  <p className="text-xs text-green-600">✓ Admin+</p>
                </div>
              </div>
            </div>

            {/* Main Workflow Modules */}
            <div>
              <h4 className="font-medium mb-3 flex items-center">
                <CheckSquare className="h-4 w-4 mr-2" />
                Main Workflow
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                <div className="p-2 border rounded">
                  <p className="font-medium">Contacts</p>
                  <p className="text-xs text-green-600">✓ Affiliate+ View/Create</p>
                  <p className="text-xs text-orange-600">△ Manager+ Edit/Delete</p>
                </div>
                <div className="p-2 border rounded">
                  <p className="font-medium">Tasks</p>
                  <p className="text-xs text-green-600">✓ Affiliate+ View/Create</p>
                  <p className="text-xs text-orange-600">△ Manager+ Edit/Assign</p>
                </div>
                <div className="p-2 border rounded">
                  <p className="font-medium">Pipeline</p>
                  <p className="text-xs text-green-600">✓ Affiliate+ View</p>
                  <p className="text-xs text-orange-600">△ Manager+ Manage</p>
                </div>
              </div>
            </div>

            {/* Network Modules */}
            <div>
              <h4 className="font-medium mb-3 flex items-center">
                <TrendingUp className="h-4 w-4 mr-2" />
                Network & MLM
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                <div className="p-2 border rounded">
                  <p className="font-medium">Genealogy</p>
                  <p className="text-xs text-green-600">✓ Affiliate+ View</p>
                  <p className="text-xs text-red-600">✗ Admin+ Manage</p>
                </div>
                <div className="p-2 border rounded">
                  <p className="font-medium">Commission</p>
                  <p className="text-xs text-green-600">✓ Affiliate+ View</p>
                  <p className="text-xs text-red-600">✗ Admin+ Calculate</p>
                </div>
                <div className="p-2 border rounded">
                  <p className="font-medium">Ranks</p>
                  <p className="text-xs text-green-600">✓ Affiliate+ View</p>
                  <p className="text-xs text-red-600">✗ Admin+ Promote</p>
                </div>
                <div className="p-2 border rounded">
                  <p className="font-medium">Affiliates</p>
                  <p className="text-xs text-green-600">✓ Affiliate+ View</p>
                  <p className="text-xs text-red-600">✗ Admin+ Manage</p>
                </div>
              </div>
            </div>

            {/* Business Modules */}
            <div>
              <h4 className="font-medium mb-3 flex items-center">
                <Building2 className="h-4 w-4 mr-2" />
                Business & Commerce
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                <div className="p-2 border rounded">
                  <p className="font-medium">Customers</p>
                  <p className="text-xs text-green-600">✓ Affiliate+ View/Create</p>
                  <p className="text-xs text-orange-600">△ Manager+ Edit</p>
                </div>
                <div className="p-2 border rounded">
                  <p className="font-medium">Products</p>
                  <p className="text-xs text-green-600">✓ All View</p>
                  <p className="text-xs text-blue-600">◆ Customer Purchase</p>
                </div>
                <div className="p-2 border rounded">
                  <p className="font-medium">Orders</p>
                  <p className="text-xs text-green-600">✓ All View</p>
                  <p className="text-xs text-orange-600">△ Manager+ Process</p>
                </div>
                <div className="p-2 border rounded">
                  <p className="font-medium">Payments</p>
                  <p className="text-xs text-green-600">✓ All View</p>
                  <p className="text-xs text-red-600">✗ Admin+ Refund</p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm mt-2">
                <div className="p-2 border rounded">
                  <p className="font-medium">Wallet</p>
                  <p className="text-xs text-green-600">✓ All View</p>
                  <p className="text-xs text-blue-600">◆ Affiliate+ Transfer</p>
                </div>
                <div className="p-2 border rounded">
                  <p className="font-medium">Marketing</p>
                  <p className="text-xs text-green-600">✓ Affiliate+ View</p>
                  <p className="text-xs text-orange-600">△ Manager+ Create</p>
                </div>
                <div className="p-2 border rounded">
                  <p className="font-medium">Reports</p>
                  <p className="text-xs text-green-600">✓ Affiliate+ View</p>
                  <p className="text-xs text-red-600">✗ Admin+ Export</p>
                </div>
              </div>
            </div>

            {/* System Modules */}
            <div>
              <h4 className="font-medium mb-3 flex items-center">
                <Shield className="h-4 w-4 mr-2" />
                System & Support
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                <div className="p-2 border rounded">
                  <p className="font-medium">Training</p>
                  <p className="text-xs text-green-600">✓ All View</p>
                  <p className="text-xs text-orange-600">△ Manager+ Create</p>
                </div>
                <div className="p-2 border rounded">
                  <p className="font-medium">Support</p>
                  <p className="text-xs text-green-600">✓ All Create Tickets</p>
                  <p className="text-xs text-orange-600">△ Manager+ Respond</p>
                </div>
                <div className="p-2 border rounded">
                  <p className="font-medium">Communication</p>
                  <p className="text-xs text-green-600">✓ All View</p>
                  <p className="text-xs text-orange-600">△ Affiliate+ Send</p>
                </div>
                <div className="p-2 border rounded">
                  <p className="font-medium">Settings</p>
                  <p className="text-xs text-green-600">✓ All View</p>
                  <p className="text-xs text-orange-600">△ Affiliate+ Edit</p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-2 gap-2 text-sm mt-2">
                <div className="p-2 border rounded">
                  <p className="font-medium">User Management</p>
                  <p className="text-xs text-red-600">✗ Admin+ Only</p>
                </div>
                <div className="p-2 border rounded">
                  <p className="font-medium">Invitations</p>
                  <p className="text-xs text-red-600">✗ Admin+ Only</p>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Permission Legend</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                <div className="flex items-center">
                  <span className="text-green-600 mr-1">✓</span>
                  <span>Available</span>
                </div>
                <div className="flex items-center">
                  <span className="text-orange-600 mr-1">△</span>
                  <span>Limited Access</span>
                </div>
                <div className="flex items-center">
                  <span className="text-red-600 mr-1">✗</span>
                  <span>Admin Required</span>
                </div>
                <div className="flex items-center">
                  <span className="text-blue-600 mr-1">◆</span>
                  <span>Special Access</span>
                </div>
              </div>
            </div>

            {/* Current User Permissions - showing actual values */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium mb-3 flex items-center">
                <Crown className="h-4 w-4 mr-2 text-blue-600" />
                Your Current Permissions ({user?.role?.replace('_', ' ')})
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                <div className={`p-2 border rounded ${permissions.permissions.dashboard.canViewBusiness ? 'bg-green-100 border-green-200' : 'bg-gray-100'}`}>
                  <p className="font-medium">Business Dashboard</p>
                  <p className={`text-xs ${permissions.permissions.dashboard.canViewBusiness ? 'text-green-600' : 'text-gray-500'}`}>
                    {permissions.permissions.dashboard.canViewBusiness ? '✓ Enabled' : '✗ Disabled'}
                  </p>
                </div>
                <div className={`p-2 border rounded ${permissions.permissions.admin.canManageUsers ? 'bg-green-100 border-green-200' : 'bg-gray-100'}`}>
                  <p className="font-medium">User Management</p>
                  <p className={`text-xs ${permissions.permissions.admin.canManageUsers ? 'text-green-600' : 'text-gray-500'}`}>
                    {permissions.permissions.admin.canManageUsers ? '✓ Enabled' : '✗ Disabled'}
                  </p>
                </div>
                <div className={`p-2 border rounded ${permissions.permissions.products.canPurchase ? 'bg-green-100 border-green-200' : 'bg-gray-100'}`}>
                  <p className="font-medium">Product Purchase</p>
                  <p className={`text-xs ${permissions.permissions.products.canPurchase ? 'text-green-600' : 'text-gray-500'}`}>
                    {permissions.permissions.products.canPurchase ? '✓ Enabled' : '✗ Disabled'}
                  </p>
                </div>
                <div className={`p-2 border rounded ${permissions.permissions.admin.canViewFullAccess ? 'bg-green-100 border-green-200' : 'bg-gray-100'}`}>
                  <p className="font-medium">Admin Features</p>
                  <p className={`text-xs ${permissions.permissions.admin.canViewFullAccess ? 'text-green-600' : 'text-gray-500'}`}>
                    {permissions.permissions.admin.canViewFullAccess ? '✓ Enabled' : '✗ Disabled'}
                  </p>
                </div>
                <div className={`p-2 border rounded ${permissions.permissions.commission.canView ? 'bg-green-100 border-green-200' : 'bg-gray-100'}`}>
                  <p className="font-medium">Commission View</p>
                  <p className={`text-xs ${permissions.permissions.commission.canView ? 'text-green-600' : 'text-gray-500'}`}>
                    {permissions.permissions.commission.canView ? '✓ Enabled' : '✗ Disabled'}
                  </p>
                </div>
                <div className={`p-2 border rounded ${permissions.permissions.marketing.canCreate ? 'bg-green-100 border-green-200' : 'bg-gray-100'}`}>
                  <p className="font-medium">Marketing Create</p>
                  <p className={`text-xs ${permissions.permissions.marketing.canCreate ? 'text-green-600' : 'text-gray-500'}`}>
                    {permissions.permissions.marketing.canCreate ? '✓ Enabled' : '✗ Disabled'}
                  </p>
                </div>
                <div className={`p-2 border rounded ${permissions.permissions.wallet.canTransfer ? 'bg-green-100 border-green-200' : 'bg-gray-100'}`}>
                  <p className="font-medium">Wallet Transfer</p>
                  <p className={`text-xs ${permissions.permissions.wallet.canTransfer ? 'text-green-600' : 'text-gray-500'}`}>
                    {permissions.permissions.wallet.canTransfer ? '✓ Enabled' : '✗ Disabled'}
                  </p>
                </div>
                <div className={`p-2 border rounded ${permissions.permissions.training.canManage ? 'bg-green-100 border-green-200' : 'bg-gray-100'}`}>
                  <p className="font-medium">Training Manage</p>
                  <p className={`text-xs ${permissions.permissions.training.canManage ? 'text-green-600' : 'text-gray-500'}`}>
                    {permissions.permissions.training.canManage ? '✓ Enabled' : '✗ Disabled'}
                  </p>
                </div>
              </div>
              <div className="mt-3 text-xs text-blue-600">
                Total Modules: 15 | Available to {user?.role?.replace('_', ' ')}: {Object.values(permissions.permissions).filter(module => Object.values(module).some(perm => perm === true)).length}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4">
        {permissions.canViewAdminFeatures ? (
          <Button asChild>
            <Link href="/dashboard/super-admin">
              <Crown className="h-4 w-4 mr-2" />
              Access Super Admin Dashboard
            </Link>
          </Button>
        ) : (
          <Button disabled>
            <Crown className="h-4 w-4 mr-2" />
            Super Admin Required
          </Button>
        )}
        
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
